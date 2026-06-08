"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SERVER_INSTANCE_ID } from "@/lib/server-session";

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

  const cookieStore = await cookies();
  cookieStore.set("server_instance_id", SERVER_INSTANCE_ID);

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

  const cookieStore = await cookies();
  cookieStore.set("server_instance_id", SERVER_INSTANCE_ID);

  // Profile is created automatically via the handle_new_user database trigger

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const cookieStore = await cookies();
  cookieStore.delete("server_instance_id");
  
  redirect("/login");
}

export async function verifyServerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("server_instance_id")?.value;

  if (sessionId && sessionId !== SERVER_INSTANCE_ID) {
    // Session ID mismatch: NPM server was restarted
    const supabase = await createClient();
    await supabase.auth.signOut();
    cookieStore.delete("server_instance_id");
    redirect("/login");
  }
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
