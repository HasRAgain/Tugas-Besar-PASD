// =========================================================
// Lokeria Database Types
// These types mirror the Supabase PostgreSQL schema.
// In production, generate these with: npx supabase gen types typescript
// =========================================================

export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  resume_url: string | null;
  major: string | null;
  skill_field: string | null;
  interests: string[] | null;
  skills: string[] | null;
  // AI embedding fields
  embedding: number[] | null;
  embedding_updated_at: string | null;
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
  // FK to companies table — nullable since CSV imports don't require it
  company_id: string | null;
  // Core fields (CSV: Job Title, Role)
  title: string;
  role: string | null;
  // Content (CSV: Job Description, qualifications_cleaned, Responsibilities)
  description: string | null;
  qualifications: string | null;
  responsibilities: string | null;
  // CSV: skills, Benefits_Cleaned
  skills: string | null;
  benefits: string | null;
  // Company info flat (CSV: Company, company desk)
  company_name: string | null;
  company_description: string | null;
  // Location (CSV: location, Country)
  location: string | null;
  country: string | null;
  // Work details (CSV: Work Type, Preference, Job Portal)
  work_type: string | null;
  preference: string | null;
  job_portal: string | null;
  // Contact (CSV: Contact Person, contact_cleaned)
  contact_person: string | null;
  contact_cleaned: string | null;
  // Experience (CSV: Min_Experience_Years, Max_Experience_Years)
  min_experience_years: number | null;
  max_experience_years: number | null;
  // Salary USD (CSV: Min_Salary_USD, Max_Salary_USD)
  min_salary: number | null;
  max_salary: number | null;
  // Meta (CSV: Job Posting Date)
  job_posting_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined relation (when fetched with company:companies(*))
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
  preferred_work_types: string[] | null;
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
  work_type?: string;
  min_salary?: number;
  max_salary?: number;
  min_experience_years?: number;
  max_experience_years?: number;
  role?: string;
  page?: number;
  per_page?: number;
}

// Embedded jobs table (pre-computed 50k job embeddings)
export interface EmbeddedJob {
  id: number;
  job_title: string;
  role: string | null;
  company: string | null;
  location: string | null;
  country: string | null;
  min_salary_usd: number | null;
  max_salary_usd: number | null;
  semantic_text: string | null;
  embedding: number[];
}

// Recommended job returned by the RPC similarity function
export interface RecommendedJob {
  id: number;
  job_title: string;
  role: string | null;
  company: string | null;
  location: string | null;
  country: string | null;
  min_salary_usd: number | null;
  max_salary_usd: number | null;
  semantic_text: string | null;
  similarity: number;
}
