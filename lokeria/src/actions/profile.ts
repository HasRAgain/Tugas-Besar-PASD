"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  generateEmbedding,
  buildProfileSemanticText,
  hasEnoughProfileData,
} from "@/lib/embeddings";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Parse array fields sent as JSON from the form
  const interestsRaw = formData.get("interests") as string;
  const skillsRaw = formData.get("skills") as string;
  const interests: string[] = interestsRaw ? JSON.parse(interestsRaw) : [];
  const skills: string[] = skillsRaw ? JSON.parse(skillsRaw) : [];

  const headline = formData.get("headline") as string;
  const bio = formData.get("bio") as string;
  const major = formData.get("major") as string;
  const skillField = formData.get("skill_field") as string;

  const updates = {
    full_name: formData.get("full_name") as string,
    headline,
    bio,
    location: formData.get("location") as string,
    country: formData.get("country") as string,
    major,
    skill_field: skillField,
    interests,
    skills,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  // === EMBEDDING GENERATION (event-driven, only on profile save) ===
  // Build from the form data we just saved — no extra DB fetch needed
  let embeddingStatus = "skipped";
  try {
    const profileForEmbedding = {
      headline,
      bio,
      skills,
      interests,
      skill_field: skillField,
      major,
    };

    console.log("[Embedding] Combined profile data:", JSON.stringify(profileForEmbedding));

    if (hasEnoughProfileData(profileForEmbedding)) {
      const semanticText = buildProfileSemanticText(profileForEmbedding);
      console.log("[Embedding] Semantic text:", semanticText.substring(0, 200));

      const embedding = await generateEmbedding(semanticText);
      console.log("[Embedding] Generated vector, length:", embedding.length);

      // pgvector expects the vector as a formatted string: "[0.1, 0.2, ...]"
      const vectorString = `[${embedding.join(",")}]`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          embedding: vectorString,
          embedding_updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("[Embedding] DB update failed:", updateError);
        embeddingStatus = `db_error: ${updateError.message}`;
      } else {
        console.log("[Embedding] Saved successfully!");
        embeddingStatus = "success";
      }
    } else {
      console.log("[Embedding] Not enough profile data to generate embedding");
      embeddingStatus = "insufficient_data";
    }
  } catch (embeddingError) {
    console.error("[Embedding] Generation failed:", embeddingError);
    embeddingStatus = `error: ${embeddingError instanceof Error ? embeddingError.message : "unknown"}`;
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true, embeddingStatus };
}
