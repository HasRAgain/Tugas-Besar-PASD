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

    // 1. Search Query Validation (Requirement 1)
    if (filters.query) {
      const q = filters.query.trim();
      const isOneChar = q.length <= 1;
      const isNumbersOrSymbolsOnly = /^[^a-zA-Z]+$/.test(q);

      if (!q || isOneChar || isNumbersOrSymbolsOnly) {
        return EMPTY_RESULT;
      }
    }

    let query = supabase
      .from("jobs")
      .select("*, company:companies(*)", { count: "exact" })
      .eq("is_active", true)
      .order("job_posting_date", { ascending: false })
      .range(from, to);

    // Apply text search
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,job_description.ilike.%${filters.query}%,company.ilike.%${filters.query}%,role.ilike.%${filters.query}%`
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
      return EMPTY_RESULT;
    }

    // 2. Similarity Search Fallback (Requirement 3)
    if (filters.query && (!data || data.length === 0)) {
      try {
        const { generateEmbedding } = await import("@/lib/embeddings");
        const queryEmbedding = await generateEmbedding(filters.query);
        const { data: recommendations, error: recError } = await supabase.rpc(
          "match_jobs_for_user",
          {
            query_embedding: queryEmbedding,
            match_count: perPage,
          }
        );

        if (!recError && recommendations && recommendations.length > 0) {
          const similarJobs = recommendations.map((rec: any) => ({
            id: String(rec.id),
            title: rec.job_title,
            role: rec.role,
            company_name: rec.company,
            location: rec.location,
            country: rec.country,
            min_salary: rec.min_salary_usd,
            max_salary: rec.max_salary_usd,
            description: rec.semantic_text,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          return {
            jobs: similarJobs,
            totalCount: similarJobs.length,
            totalPages: 1,
            currentPage: page,
          };
        }
      } catch (err) {
        console.error("Similarity search failed:", err);
      }
    }

    const mappedData = data?.map((job: any) => {
      let cName = job.company_name;
      if (!cName) {
        cName = typeof job.company === 'string' ? job.company : job.company?.name;
      }
      return {
        ...job,
        description: job.description || job.job_description,
        company_name: cName || "Unknown Company",
      };
    });

    return {
      jobs: mappedData || [],
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
    
    let cName = data.company_name;
    if (!cName) {
      cName = typeof data.company === 'string' ? data.company : data.company?.name;
    }

    return {
      ...data,
      description: data.description || data.job_description,
      company_name: cName || "Unknown Company",
    };
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

    return (data || []).map((job: any) => {
      let cName = job.company_name;
      if (!cName) {
        cName = typeof job.company === 'string' ? job.company : job.company?.name;
      }
      return {
        ...job,
        description: job.description || job.job_description,
        company_name: cName || "Unknown Company",
      };
    });
  } catch {
    return [];
  }
}
