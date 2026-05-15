// =========================================================
// Lokeria Database Types
// These types mirror the Supabase PostgreSQL schema.
// In production, generate these with: npx supabase gen types typescript
// =========================================================

export type WorkType = "REMOTE" | "HYBRID" | "ONSITE";

export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  min_salary: number | null;
  max_salary: number | null;
  experience_level: string | null;
  location: string | null;
  country: string | null;
  work_type: WorkType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  company?: Company;
}

export interface Bookmark {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  // Joined
  job?: Job;
}

export interface UserPreferences {
  user_id: string;
  expected_salary: number | null;
  preferred_locations: string[] | null;
  preferred_work_types: WorkType[] | null;
  skills: Record<string, unknown> | null;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  filters: Record<string, unknown> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Filter types for search
export interface JobFilters {
  query?: string;
  location?: string;
  country?: string;
  work_type?: WorkType;
  min_salary?: number;
  max_salary?: number;
  experience_level?: string;
  page?: number;
  per_page?: number;
}
