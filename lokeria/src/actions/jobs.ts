"use server";

import { createClient } from "@/lib/supabase/server";
import type { JobFilters } from "@/types/database.types";

const ITEMS_PER_PAGE = 12;
const EMPTY_RESULT = { jobs: [], totalCount: 0, totalPages: 1, currentPage: 1 };

export async function getJobs(filters: JobFilters = {}) {
  try {
    const supabase = await createClient();
    const page = filters.page || 1;
    const perPage = filters.per_page || ITEMS_PER_PAGE;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("jobs")
      .select("*, company:companies(*)", { count: "exact" })
      .eq("is_active", true)
      .order("job_posting_date", { ascending: false })
      .range(from, to);

    // Apply text search
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,company_name.ilike.%${filters.query}%,role.ilike.%${filters.query}%`
      );
    }

    // Apply filters
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters.country) {
      query = query.ilike("country", `%${filters.country}%`);
    }
    if (filters.work_type) {
      query = query.ilike("work_type", `%${filters.work_type}%`);
    }
    if (filters.min_salary) {
      query = query.gte("max_salary", filters.min_salary);
    }
    if (filters.max_salary) {
      query = query.lte("min_salary", filters.max_salary);
    }
    if (filters.role) {
      query = query.ilike("role", `%${filters.role}%`);
    }
    if (filters.min_experience_years !== undefined) {
      query = query.lte("min_experience_years", filters.min_experience_years);
    }
    if (filters.max_experience_years !== undefined) {
      query = query.gte("max_experience_years", filters.max_experience_years);
    }

    const { data, error, count } = await query;

    if (error) {
      // Supabase not configured or table doesn't exist yet
      return EMPTY_RESULT;
    }

    return {
      jobs: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      currentPage: page,
    };
  } catch {
    // Supabase credentials not set or network error
    return EMPTY_RESULT;
  }
}

export async function getJobById(jobId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("id", jobId)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getFeaturedJobs() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    return data || [];
  } catch {
    return [];
  }
}
