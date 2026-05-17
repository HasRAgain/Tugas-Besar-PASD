-- ============================================================
-- LOKERIA: JOBS TABLE MIGRATION SCRIPT
-- Run this ENTIRE script in Supabase SQL Editor
-- (for existing databases that already have the jobs table)
-- ============================================================

-- STEP 1: Drop old columns that no longer exist in the new schema
ALTER TABLE public.jobs
  DROP COLUMN IF EXISTS requirements,
  DROP COLUMN IF EXISTS experience_level;

-- STEP 2: Convert work_type from ENUM to plain TEXT
--   Must drop the default first since it references the enum type
ALTER TABLE public.jobs ALTER COLUMN work_type DROP DEFAULT;
ALTER TABLE public.jobs ALTER COLUMN work_type TYPE TEXT;
DROP TYPE IF EXISTS work_type_enum;

-- STEP 3: Add all the new columns from the CSV
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

-- STEP 4: Make description nullable (CSV rows might not always have it)
ALTER TABLE public.jobs ALTER COLUMN description DROP NOT NULL;

-- STEP 5: Update the company_id foreign key to SET NULL (not CASCADE)
--   so jobs are not deleted when a company is removed
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- STEP 6: Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_jobs_country        ON public.jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_role           ON public.jobs(role);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name   ON public.jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_job_posting_date ON public.jobs(job_posting_date DESC);

-- ============================================================
-- DONE! Your jobs table is now ready for CSV import.
-- Next step: Supabase Dashboard → Table Editor → jobs → Import CSV
-- ============================================================
