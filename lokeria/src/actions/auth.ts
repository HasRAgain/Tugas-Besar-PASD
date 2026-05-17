"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const major = formData.get("major") as string;
  const skillField = formData.get("skill_field") as string;

  // Parse JSON arrays sent from the multi-step form
  const interestsRaw = formData.get("interests") as string;
  const skillsRaw = formData.get("skills") as string;
  const interests = interestsRaw ? JSON.parse(interestsRaw) : [];
  const skills = skillsRaw ? JSON.parse(skillsRaw) : [];

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        major,
        skill_field: skillField,
        interests,
        skills,
      },
    },
  });

  if (error) {
    console.log("Supabase signUp error:", JSON.stringify(error, null, 2));
    return { error: error.message };
  }

  // Profile is created automatically via the handle_new_user database trigger

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}
