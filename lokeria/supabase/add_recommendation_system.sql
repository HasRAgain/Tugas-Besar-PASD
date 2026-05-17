-- ============================================================
-- LOKERIA: AI RECOMMENDATION SYSTEM
-- Run this in Supabase SQL Editor
-- ============================================================

-- STEP 1: Enable pgvector extension (safe to re-run)
CREATE EXTENSION IF NOT EXISTS vector;

-- STEP 2: Add embedding column and tracking timestamp to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS embedding vector(384),
  ADD COLUMN IF NOT EXISTS embedding_updated_at TIMESTAMPTZ;

-- STEP 3: Create index on embedded_jobs for fast similarity search
-- HNSW index is the best for cosine similarity on pgvector
CREATE INDEX IF NOT EXISTS idx_embedded_jobs_embedding
  ON public.embedded_jobs
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- STEP 4: Create RPC function for semantic job matching
-- This function takes a user embedding and returns the top N matching jobs
CREATE OR REPLACE FUNCTION match_jobs_for_user(
  query_embedding vector(384),
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id bigint,
  job_title text,
  role text,
  company text,
  location text,
  country text,
  min_salary_usd int,
  max_salary_usd int,
  semantic_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ej.id,
    ej.job_title,
    ej.role,
    ej.company,
    ej.location,
    ej.country,
    ej.min_salary_usd,
    ej.max_salary_usd,
    ej.semantic_text,
    1 - (ej.embedding <=> query_embedding) AS similarity
  FROM public.embedded_jobs ej
  ORDER BY ej.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- STEP 5: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_jobs_for_user TO authenticated;

-- STEP 6: RLS policy for profiles embedding column
-- (profiles already has RLS enabled with select/update policies)
-- No additional policies needed since embedding is part of the profiles row

-- ============================================================
-- DONE! Run this once. Then continue with the Next.js code.
-- ============================================================
