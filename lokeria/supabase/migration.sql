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
CREATE TYPE work_type_enum AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  min_salary INTEGER,
  max_salary INTEGER,
  experience_level TEXT,
  location TEXT,
  country TEXT,
  work_type work_type_enum DEFAULT 'ONSITE',
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
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- 11. SEED DATA: COMPANIES
-- =========================
INSERT INTO public.companies (id, name, logo_url, website, description, industry, location) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'TechNova', NULL, 'https://technova.example.com', 'A leading AI and cloud computing company building next-generation enterprise solutions.', 'Technology', 'San Francisco, CA'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'GreenLeaf Studios', NULL, 'https://greenleaf.example.com', 'Award-winning design and creative agency specializing in branding and digital experiences.', 'Design & Creative', 'New York, NY'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'DataStream Analytics', NULL, 'https://datastream.example.com', 'Data analytics and business intelligence platform for mid-market companies.', 'Analytics', 'London, UK'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'CloudPeak Systems', NULL, 'https://cloudpeak.example.com', 'Cloud infrastructure and DevOps solutions provider trusted by Fortune 500 companies.', 'Cloud Computing', 'Seattle, WA'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'FinCore', NULL, 'https://fincore.example.com', 'Modern fintech platform offering payment processing and digital banking APIs.', 'Fintech', 'Singapore'),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'HealthBridge', NULL, 'https://healthbridge.example.com', 'Digital health platform connecting patients with healthcare providers worldwide.', 'Healthcare', 'Berlin, Germany');

-- =========================
-- 12. SEED DATA: JOBS
-- =========================
INSERT INTO public.jobs (company_id, title, description, requirements, benefits, min_salary, max_salary, experience_level, location, country, work_type) VALUES
  -- TechNova Jobs
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Senior Frontend Engineer',
   'We are looking for a Senior Frontend Engineer to join our product team and build beautiful, performant user interfaces for our enterprise cloud platform.\n\nYou will work closely with designers and backend engineers to deliver pixel-perfect UI components and lead frontend architecture decisions.',
   '• 5+ years of experience with React/Next.js\n• Strong TypeScript proficiency\n• Experience with state management (Zustand, Redux)\n• Understanding of web performance optimization\n• Familiarity with CI/CD pipelines',
   '• Competitive salary + equity\n• Remote-first culture\n• $2,000 annual learning budget\n• Health, dental, and vision insurance\n• Unlimited PTO',
   120000, 180000, 'Senior', 'San Francisco, CA', 'United States', 'REMOTE'),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Backend Engineer (Go)',
   'Join our backend team to design and build highly scalable microservices in Go that power our cloud platform.\n\nYou will own critical services handling millions of requests per day and contribute to our API design standards.',
   '• 3+ years experience with Go\n• Experience with PostgreSQL and Redis\n• Knowledge of gRPC and REST API design\n• Understanding of distributed systems\n• Experience with Docker and Kubernetes',
   '• Competitive salary + equity\n• Remote-first culture\n• $2,000 annual learning budget\n• Health insurance',
   100000, 160000, 'Mid', 'San Francisco, CA', 'United States', 'HYBRID'),

  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'DevOps Engineer',
   'We need a DevOps Engineer to manage and improve our cloud infrastructure across AWS and GCP.\n\nYou will build CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for our production systems.',
   '• 4+ years in DevOps/SRE roles\n• Deep experience with AWS or GCP\n• Kubernetes administration\n• Terraform/Infrastructure as Code\n• Monitoring and alerting (Datadog, Grafana)',
   '• Competitive salary\n• Stock options\n• Flexible working hours\n• Home office stipend',
   110000, 170000, 'Senior', 'Remote', 'United States', 'REMOTE'),

  -- GreenLeaf Studios Jobs
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'UI/UX Designer',
   'GreenLeaf Studios is hiring a UI/UX Designer to create stunning digital experiences for our global clients.\n\nYou will lead the design process from user research through high-fidelity prototypes and work directly with developers to ensure pixel-perfect implementation.',
   '• 3+ years of UI/UX design experience\n• Proficiency in Figma\n• Strong portfolio showcasing web and mobile designs\n• Understanding of accessibility standards\n• Experience with design systems',
   '• Creative studio environment\n• Flexible schedule\n• Annual conference budget\n• Health insurance',
   80000, 120000, 'Mid', 'New York, NY', 'United States', 'ONSITE'),

  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Junior Web Developer',
   'Start your career at GreenLeaf Studios! We are looking for a Junior Web Developer to join our development team and help build beautiful websites for top brands.\n\nYou will learn from senior developers and work on real projects from day one.',
   '• Basic knowledge of HTML, CSS, JavaScript\n• Familiarity with React or Vue.js\n• Eagerness to learn and grow\n• Good communication skills\n• Portfolio or personal projects are a plus',
   '• Mentorship program\n• Learning stipend\n• Team lunches\n• Fun creative office',
   50000, 70000, 'Entry', 'New York, NY', 'United States', 'ONSITE'),

  -- DataStream Analytics Jobs
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Data Engineer',
   'DataStream Analytics is looking for a Data Engineer to build and maintain our data pipelines that process terabytes of data daily.\n\nYou will design ETL workflows, optimize data warehouses, and ensure data quality across the platform.',
   '• 3+ years in data engineering\n• Experience with Apache Spark, Airflow\n• Strong SQL skills\n• Python proficiency\n• Knowledge of data warehousing (Snowflake, BigQuery)',
   '• Competitive UK salary\n• 25 days holiday + bank holidays\n• Pension scheme\n• Remote work options',
   65000, 95000, 'Mid', 'London', 'United Kingdom', 'HYBRID'),

  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Product Manager',
   'Lead the product strategy for our analytics dashboard used by thousands of businesses.\n\nYou will define the product roadmap, prioritize features based on customer feedback and data insights, and work with cross-functional teams to deliver exceptional products.',
   '• 4+ years in product management\n• Experience with B2B SaaS products\n• Strong analytical skills\n• Excellent stakeholder management\n• Technical background preferred',
   '• Competitive salary\n• Stock options\n• Private healthcare\n• Flexible working',
   80000, 110000, 'Senior', 'London', 'United Kingdom', 'REMOTE'),

  -- CloudPeak Systems Jobs
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Cloud Solutions Architect',
   'Design and implement enterprise-grade cloud architectures for our Fortune 500 clients.\n\nYou will serve as the technical lead for complex cloud migration projects and establish best practices for cloud-native development.',
   '• 7+ years in cloud architecture\n• AWS Solutions Architect Professional certification\n• Experience with multi-cloud environments\n• Strong leadership skills\n• Client-facing experience',
   '• Top-tier compensation package\n• Remote-first\n• Annual tech conference attendance\n• 401(k) matching',
   150000, 220000, 'Lead', 'Seattle, WA', 'United States', 'REMOTE'),

  -- FinCore Jobs
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Full Stack Developer',
   'Build the future of digital payments at FinCore. We are looking for a Full Stack Developer to work on our payment processing platform used by thousands of merchants across Asia.\n\nTech stack: React, Node.js, PostgreSQL, Redis, Docker.',
   '• 3+ years full stack experience\n• React and Node.js proficiency\n• PostgreSQL experience\n• Understanding of payment systems is a plus\n• Good problem-solving skills',
   '• Competitive salary in SGD\n• Annual bonus\n• Flexible work arrangements\n• Medical and dental coverage',
   70000, 100000, 'Mid', 'Singapore', 'Singapore', 'HYBRID'),

  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Security Engineer',
   'Protect our fintech platform and our customers data. As a Security Engineer at FinCore, you will lead security assessments, implement security controls, and respond to security incidents.\n\nThis is a critical role ensuring PCI-DSS compliance and protecting millions of financial transactions.',
   '• 4+ years in cybersecurity\n• Experience with PCI-DSS compliance\n• Knowledge of OWASP Top 10\n• Penetration testing experience\n• Security certifications (CISSP, CEH) preferred',
   '• Competitive salary\n• Annual bonus\n• Training and certification budget\n• Health insurance',
   90000, 140000, 'Senior', 'Singapore', 'Singapore', 'ONSITE'),

  -- HealthBridge Jobs
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'React Native Developer',
   'Build cross-platform mobile apps that help patients connect with healthcare providers.\n\nYou will work on our patient-facing mobile application used by millions of users across Europe, delivering telemedicine and health tracking features.',
   '• 3+ years React Native experience\n• Experience with TypeScript\n• Knowledge of mobile CI/CD\n• Understanding of healthcare regulations (HIPAA/GDPR) is a plus\n• Published apps on App Store/Play Store',
   '• Competitive German salary\n• 30 days vacation\n• Public transit pass\n• Health and wellness benefits',
   60000, 90000, 'Mid', 'Berlin', 'Germany', 'HYBRID'),

  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Machine Learning Engineer',
   'Apply machine learning to improve patient outcomes. You will build predictive models for early disease detection and treatment recommendation systems.\n\nWork at the intersection of AI and healthcare to make a real impact on peoples lives.',
   '• MS/PhD in Computer Science or related field\n• 3+ years ML experience\n• Proficiency in Python, TensorFlow/PyTorch\n• Experience with medical data is a plus\n• Strong research background',
   '• Competitive salary\n• Research publication support\n• Conference attendance\n• Relocation assistance',
   80000, 130000, 'Senior', 'Berlin', 'Germany', 'REMOTE');

-- ============================================================
-- DONE! Your database is now set up with schema, RLS, and seed data.
-- ============================================================
