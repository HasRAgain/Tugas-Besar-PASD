-- ============================================================
-- LOKERIA DATABASE SCHEMA
-- Run this entire script in the Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ============================================================

-- =========================
-- 1. PROFILES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  headline TEXT,
  bio TEXT,
  location TEXT,
  country TEXT,
  resume_url TEXT,
  major TEXT,
  skill_field TEXT,
  interests TEXT[],
  skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 2. COMPANIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  industry TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 3. JOBS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Optional FK to companies table (can be NULL for flat CSV imports)
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  -- Core job info (from CSV)
  title TEXT NOT NULL,
  role TEXT,
  description TEXT,
  qualifications TEXT,
  responsibilities TEXT,
  skills TEXT,
  benefits TEXT,
  -- Company info (flat, for direct CSV import)
  company_name TEXT,
  company_description TEXT,
  -- Location
  location TEXT,
  country TEXT,
  -- Work details
  work_type TEXT,
  preference TEXT,
  job_portal TEXT,
  -- Contact
  contact_person TEXT,
  contact_cleaned TEXT,
  -- Experience & Salary (USD)
  min_experience_years INTEGER,
  max_experience_years INTEGER,
  min_salary INTEGER,
  max_salary INTEGER,
  -- Meta
  job_posting_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 4. BOOKMARKS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- =========================
-- 5. USER PREFERENCES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  expected_salary INTEGER,
  preferred_locations TEXT[],
  preferred_work_types TEXT[],
  skills JSONB
);

-- =========================
-- 6. SEARCH HISTORY TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 7. NOTIFICATIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 8. INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_work_type ON public.jobs(work_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_job_id ON public.bookmarks(job_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =========================
-- 9. ROW LEVEL SECURITY (RLS)
-- =========================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- COMPANIES: Public read
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT TO anon, authenticated USING (true);

-- JOBS: Public read
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (true);

-- BOOKMARKS: Users manage their own
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- USER PREFERENCES: Users manage their own
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- SEARCH HISTORY: Users manage their own
CREATE POLICY "Users can view own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS: Users manage their own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- =========================
-- 10. AUTO-CREATE PROFILE ON SIGNUP
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, major, skill_field, interests, skills)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'major',
    NEW.raw_user_meta_data ->> 'skill_field',
    CASE
      WHEN NEW.raw_user_meta_data -> 'interests' IS NOT NULL
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'interests'))
      ELSE NULL
    END,
    CASE
      WHEN NEW.raw_user_meta_data -> 'skills' IS NOT NULL
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'skills'))
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- 11. SEED DATA: COMPANIES (optional — can be skipped if using flat job imports)
-- =========================
-- No seed data inserted. Import your real company data as needed.

-- =========================
-- 12. SEED DATA: JOBS
-- =========================
-- No seed data inserted. Import your real jobs data from CSV.
-- Use Supabase Dashboard → Table Editor → Import CSV,
-- or the SQL COPY command with your CSV file.

-- ============================================================
-- DONE! Your database is now set up with schema and RLS.
-- Next step: import your jobs CSV via Supabase Dashboard.
-- ============================================================

-- =========================
-- APPENDIX: ALTER TABLE statements
-- Run these if the jobs table already exists in Supabase
-- to migrate it to the new schema.
-- =========================
/*
ALTER TABLE public.jobs
  DROP COLUMN IF EXISTS requirements,
  DROP COLUMN IF EXISTS experience_level;

-- Change work_type from enum to text:
-- 1. Drop the default (it references the enum type)
ALTER TABLE public.jobs ALTER COLUMN work_type DROP DEFAULT;
-- 2. Cast the column to TEXT
ALTER TABLE public.jobs ALTER COLUMN work_type TYPE TEXT;
-- 3. Now the enum has no dependents and can be dropped
DROP TYPE IF EXISTS work_type_enum;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS qualifications TEXT,
  ADD COLUMN IF NOT EXISTS responsibilities TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS preference TEXT,
  ADD COLUMN IF NOT EXISTS job_portal TEXT,
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS contact_cleaned TEXT,
  ADD COLUMN IF NOT EXISTS min_experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS max_experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS job_posting_date TIMESTAMPTZ;

-- Make description nullable since CSV might have blanks
ALTER TABLE public.jobs ALTER COLUMN description DROP NOT NULL;

-- Also allow company_id to SET NULL instead of CASCADE
-- (re-create the FK constraint)
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create indexes for the new columns (run AFTER ADD COLUMN above)
CREATE INDEX IF NOT EXISTS idx_jobs_country ON public.jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_role ON public.jobs(role);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON public.jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_job_posting_date ON public.jobs(job_posting_date DESC);
*/
