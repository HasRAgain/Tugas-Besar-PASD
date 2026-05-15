"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to bookmark jobs." };
  }

  // Check if bookmark exists
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .single();

  if (existing) {
    // Remove bookmark
    await supabase.from("bookmarks").delete().eq("id", existing.id);
  } else {
    // Add bookmark
    await supabase.from("bookmarks").insert({
      user_id: user.id,
      job_id: jobId,
    });
  }

  revalidatePath("/bookmarks");
  revalidatePath("/jobs");
  return { success: true, bookmarked: !existing };
}

export async function getBookmarks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("bookmarks")
    .select("*, job:jobs(*, company:companies(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getBookmarkedJobIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("bookmarks")
    .select("job_id")
    .eq("user_id", user.id);

  return data?.map((b) => b.job_id) || [];
}
