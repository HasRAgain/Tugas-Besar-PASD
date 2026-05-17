"use server";

import { createClient } from "@/lib/supabase/server";
import type { RecommendedJob } from "@/types/database.types";

interface RecommendationResult {
  jobs: RecommendedJob[];
  needsProfile: boolean;
  error?: string;
}

/**
 * Fetch AI-powered job recommendations for the current user.
 *
 * Flow:
 * 1. Get user's stored embedding from profiles table
 * 2. If no embedding → return needsProfile: true
 * 3. Call pgvector RPC function for cosine similarity search
 * 4. Return top matching jobs with similarity scores
 */
export async function getRecommendations(
  limit: number = 10
): Promise<RecommendationResult> {
  try {
    const supabase = await createClient();

    // 1. Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { jobs: [], needsProfile: false, error: "Not authenticated" };
    }

    // 2. Fetch user's embedding
    const { data: profile } = await supabase
      .from("profiles")
      .select("embedding")
      .eq("id", user.id)
      .single();

    if (!profile?.embedding) {
      return { jobs: [], needsProfile: true };
    }

    // 3. Call the pgvector similarity RPC function
    const { data: recommendations, error } = await supabase.rpc(
      "match_jobs_for_user",
      {
        query_embedding: profile.embedding,
        match_count: limit,
      }
    );

    if (error) {
      console.error("Recommendation RPC error:", error);
      return { jobs: [], needsProfile: false, error: error.message };
    }

    return {
      jobs: (recommendations as RecommendedJob[]) || [],
      needsProfile: false,
    };
  } catch (err) {
    console.error("Recommendation fetch failed:", err);
    return { jobs: [], needsProfile: false, error: "Failed to load recommendations" };
  }
}
