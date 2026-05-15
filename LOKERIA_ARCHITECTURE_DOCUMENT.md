# LOKERIA: Master Planning & Architecture Document

## 1. PRODUCT OVERVIEW

**Vision**
To democratize career growth by seamlessly connecting global talent with their ideal opportunities through advanced semantic intelligence, completely eliminating the noise of traditional keyword-based job boards.

**Mission**
To dramatically reduce the friction of job hunting and hiring by leveraging state-of-the-art NLP models (TF-IDF, SBERT) to deeply understand the context, nuance, and true potential of both job seekers and job descriptions.

**Problem Statement**
Traditional job platforms rely on rigid keyword matching, leading to highly qualified candidates being rejected by ATS systems due to missing exact keywords, while irrelevant candidates flood job postings. Users spend hours manually filtering jobs because "Software Engineer" in one company means something completely different in another.

**Target Users**
- Active Job Seekers: Professionals actively looking for their next role, frustrated by traditional job boards.
- Passive Job Seekers: Professionals open to roles that perfectly match their extremely specific niche or semantic profile.

**User Pain Points**
- Information overload with irrelevant job recommendations.
- Keyword-matching systems failing to recognize synonymous skills (e.g., "React.js" vs "Frontend UI Library").
- Time-consuming manual filtering for salary, location, and remote work preferences.

**Unique Selling Proposition (USP)**
A fundamentally smarter search. Lokeria doesn't just look for words; it understands the *meaning* of a user's profile and matches it against the *meaning* of a job description using hybrid semantic search (SBERT + TF-IDF).

**Product Goals**
- Deliver highly personalized job recommendations with >85% user relevance satisfaction.
- Achieve a sub-500ms response time for complex semantic queries.
- Build a highly scalable platform capable of handling millions of job postings.

**Success Metrics (KPIs)**
- Recommendation Click-Through Rate (CTR).
- Application Conversion Rate (Saved/Applied vs. Viewed).
- Daily Active Users (DAU) & Monthly Active Users (MAU).
- Average Session Duration.

---

## 2. FEATURE BREAKDOWN

### Core Features
- **Job Search Engine**: Keyword, title, and company search with dynamic filtering.
- **Job Details View**: Comprehensive view of job descriptions, requirements, and company info.
- **User Authentication**: Secure Login/Register via email, Google, and GitHub (Supabase Auth).
- **Profile Management**: Resume upload, skills extraction, and preference setting.

### AI Features (The Differentiator)
- **Semantic Job Recommendations**: "Jobs you might love" powered by SBERT and Cosine Similarity.
- **Smart Search Expansion**: Automatically expanding user queries using NLP (e.g., searching "Frontend" also brings up "React", "Vue", "Web Developer").
- **Profile-to-Job Match Scoring**: A percentage score indicating how well a user's profile fits a specific job.

### User Features
- **Job Bookmarking**: Save jobs to a personal collection.
- **Application Tracking**: (v1.5) Mark jobs as 'Applied', 'Interviewing', etc.
- **Custom Email Alerts**: Notifications for new jobs matching the user's semantic profile.

### Admin Features
- **Job Management Dashboard**: CRUD operations for jobs and companies.
- **Platform Analytics**: High-level view of search trends and user activity.

### Future Features (v2)
- Resume auto-parsing and scoring using LLMs.
- Employer portal for direct hiring.
- AI Career Assistant (Chatbot for career advice).

---

## 3. USER FLOW

**Guest User Flow**
1. Lands on Homepage -> Views featured jobs and hero search bar.
2. Performs Search -> Views paginated search results.
3. Clicks Job -> Views job details.
4. Attempts to Bookmark/Apply -> Prompted to Register/Login.

**Registered User Flow**
1. Logs in -> Redirected to Personalized Dashboard.
2. Dashboard displays "Recommended for You" based on profile vector embeddings.
3. User updates Profile -> Adds skills, uploads resume. Vector embeddings are re-calculated in the background.
4. User browses recommendations -> Clicks "Bookmark" on interesting jobs.
5. User navigates to "Saved Jobs" -> Reviews bookmarked jobs and clicks external "Apply" links.

**Admin Flow**
1. Logs into Admin Portal (Protected Route based on role).
2. Navigates to Job Management -> Adds new job postings manually or triggers scraper.
3. New jobs are automatically processed by the AI pipeline (TF-IDF and SBERT embeddings generated) before being visible.

**AI Recommendation Flow**
1. User profile data (skills, bio, history) is aggregated into a single text document.
2. System calls AI Service -> Generates a dense vector representation (SBERT).
3. System runs vector similarity search (pgvector) against the `jobs` table.
4. Results are combined with TF-IDF keyword scores.
5. Final ranked list is served to the Next.js frontend.

---

## 4. SYSTEM ARCHITECTURE

**High-Level Architecture**
Lokeria utilizes a modern, decoupled serverless-first architecture. 
- **Client**: Next.js App Router (React)
- **Primary Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **AI Inference Engine**: Python FastAPI microservice
- **Vector Database**: Supabase pgvector extension

**Frontend Architecture (Next.js)**
- Utilizing React Server Components (RSC) for initial page loads (SEO optimization, fast LCP).
- Client Components only used for interactive elements (search bars, bookmark toggles).
- Server Actions for form submissions and mutations (login, profile updates) to eliminate intermediate API routes.

**Backend Architecture (Supabase)**
- Direct DB access via Supabase Client with strict Row Level Security (RLS).
- Supabase Webhooks to trigger embedding generation when a new job is inserted.

**AI Recommendation Architecture**
- A dedicated Python FastAPI service running on a containerized platform (e.g., Render/AWS ECS).
- **Why?** Python has the richest ecosystem for NLP (HuggingFace `sentence-transformers`, `scikit-learn`). Running heavy ML models in Node.js/Edge functions is inefficient and often impossible due to memory limits.
- Exposes internal REST endpoints: `/embed`, `/recommend`, `/parse-resume`.

**Data Flow (Job Insertion)**
1. Admin inserts Job into Supabase.
2. Supabase Database Webhook fires to FastAPI Service.
3. FastAPI generates TF-IDF terms and SBERT embeddings.
4. FastAPI updates the Job record in Supabase with the generated vectors.

**Scalability & Security Considerations**
- Edge caching via Vercel CDN.
- pgvector enables scalable approximate nearest neighbor (ANN) search via HNSW or IVFFlat indexes.
- RLS ensures users can only read their own preferences and bookmarks.

---

## 5. DATABASE DESIGN (Supabase PostgreSQL)

**Tables & Schema**

`users` (Managed by Supabase Auth)
- `id` (uuid, PK)
- `email`

`profiles`
- `id` (uuid, PK, FK to users.id)
- `full_name` (text)
- `headline` (text)
- `bio` (text)
- `location` (text)
- `country` (text)
- `resume_url` (text)
- `profile_vector` (vector(384)) -- SBERT embedding
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

`companies`
- `id` (uuid, PK)
- `name` (text)
- `logo_url` (text)
- `website` (text)
- `description` (text)
- `industry` (text)
- `location` (text)
- `created_at` (timestamptz)

`jobs`
- `id` (uuid, PK)
- `company_id` (uuid, FK to companies.id)
- `title` (text)
- `description` (text)
- `requirements` (text)
- `benefits` (text)
- `min_salary` (integer)
- `max_salary` (integer)
- `experience_level` (text)
- `location` (text)
- `country` (text)
- `work_type` (enum: REMOTE, HYBRID, ONSITE)
- `is_active` (boolean)
- `search_vector` (vector(384)) -- SBERT embedding
- `tfidf_keywords` (text[]) -- Extracted keywords
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

`bookmarks`
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles.id)
- `job_id` (uuid, FK to jobs.id)
- `created_at` (timestamptz)
- *Constraint: UNIQUE(user_id, job_id)*

`recommendations`
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles.id)
- `job_id` (uuid, FK to jobs.id)
- `score` (float)
- `algorithm_used` (text)
- `created_at` (timestamptz)

`user_preferences`
- `user_id` (uuid, PK, FK to profiles.id)
- `expected_salary` (integer)
- `preferred_locations` (text[])
- `preferred_work_types` (text[])
- `skills` (jsonb)

`search_history`
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles.id)
- `query` (text)
- `filters` (jsonb)
- `created_at` (timestamptz)

`notifications`
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles.id)
- `type` (text)
- `content` (text)
- `is_read` (boolean, default false)
- `created_at` (timestamptz)

**Indexing Strategy**
- B-Tree indexes on `jobs.location`, `jobs.work_type`, `jobs.created_at` for fast standard filtering.
- HNSW (Hierarchical Navigable Small World) index on `jobs.search_vector` and `profiles.profile_vector` using `pgvector` for blazingly fast semantic search.
- GIN index on `jobs.tfidf_keywords` for fast keyword matching.

**RLS (Row Level Security) Strategy**
- `jobs` & `companies`: `SELECT` is public. `INSERT/UPDATE/DELETE` restricted to admin role.
- `profiles`, `bookmarks`, `user_preferences`, `search_history`, `notifications`: `SELECT`, `INSERT`, `UPDATE`, `DELETE` restricted to `auth.uid() = id` (or `user_id`).

---

## 6. API DESIGN

While Next.js Server Actions handle most client-DB interactions, the FastAPI Service provides the following internal REST API:

**POST /api/v1/nlp/embed**
- **Purpose**: Generates SBERT embedding for a given text.
- **Request Body**: `{ "text": "Software engineer with 5 years React experience..." }`
- **Response**: `{ "embedding": [0.12, -0.04, 0.88, ...] }`
- **Auth**: Internal API Key (Bearer).

**POST /api/v1/nlp/recommend**
- **Purpose**: Returns top K job IDs based on a user's profile vector.
- **Request Body**: `{ "user_id": "uuid", "top_k": 20, "filters": {"remote": true} }`
- **Response**: `{ "recommendations": [{ "job_id": "uuid", "score": 0.92 }] }`
- **Auth**: Internal API Key (Bearer).

**Next.js Server Actions (Supabase Abstraction)**
- `signIn(email, password)`
- `signUp(email, password, profileData)`
- `getJobs(query, filters, page)`
- `getJobDetails(jobId)`
- `toggleBookmark(jobId)`
- `getRecommendedJobs(userId)`
- `updateProfile(data)`

---

## 7. FRONTEND STRUCTURE (Next.js App Router)

**Folder Structure**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── bookmarks/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── recommendations/page.tsx
│   ├── jobs/
│   │   ├── page.tsx (Job Listing/Search)
│   │   ├── [id]/page.tsx (Job Details)
│   ├── layout.tsx
│   ├── page.tsx (Landing)
├── components/
│   ├── ui/ (Shadcn UI components)
│   ├── jobs/ (JobCard, JobList, JobFilters)
│   ├── layout/ (Navbar, Footer, Sidebar)
│   ├── forms/ (Login Form, Profile Form)
├── lib/
│   ├── supabase/ (client, server, middleware config)
│   ├── utils.ts (Tailwind merge, formatting)
├── actions/ (Next.js Server Actions)
│   ├── auth.ts
│   ├── jobs.ts
│   ├── profile.ts
├── types/
│   ├── database.types.ts (Generated from Supabase)
```

**Architecture Strategy**
- **State Management**: Server state managed by Next.js App Router cache and Server Components. Minimal client state managed via React `useState` and Zustand (if complex filtering state is needed across components).
- **Data Fetching**: Primarily fetched in Server Components (`await supabase.from(...)`). Pass data down as props. React Query/SWR is largely unnecessary with App Router caching, except for infinite scrolling on the jobs page where `useInfiniteQuery` (React Query) shines.
- **Form Handling**: `react-hook-form` coupled with `zod` for strict schema validation, submitted via Server Actions.
- **Error Handling**: `error.tsx` boundaries for distinct application sections. Toast notifications for mutation errors.

---

## 8. UI/UX PLANNING

**Design System & Aesthetics**
- **Vibe**: Clean, modern, trustworthy, high-tech SaaS.
- **Color Palette**: 
  - Primary: Deep Indigo (#4F46E5)
  - Secondary: Teal/Cyan (#0D9488) for tech-focused accents.
  - Background: Off-white (#F9FAFB) for light mode, Slate (#0F172A) for dark mode.
- **Typography**: `Inter` or `Plus Jakarta Sans` for extreme legibility and modern feel.
- **Layout Strategy**: Max-width containers for readability. Persistent sidebars for authenticated routes.
- **Responsive Strategy**: Mobile-first design using Tailwind breakpoints. Hide complex filters in a drawer on mobile.
- **Accessibility**: ARIA labels, keyboard navigability via Shadcn/UI primitives.

**Page Component Breakdown**
1. **Landing Page**: 
   - Sections: Hero (Search Bar), Featured Jobs, "How AI Matches You", Testimonials, Footer.
2. **Login/Register**: 
   - Clean centered card, Social auth buttons, Email/Password fields.
3. **Job Listing (Search)**: 
   - Left Sidebar: Filters (Location, Work Type, Salary Range). 
   - Main Area: Search Bar, Active Filters tags, Job Cards list, Pagination.
4. **Job Details**: 
   - Header: Job Title, Company Logo, Tags. 
   - Main: Description, Requirements, Benefits. 
   - Sticky Aside: "Apply Now" button, Bookmark toggle, Match Score chart.
5. **Dashboard**: 
   - Welcome banner, Profile completeness widget, "Jobs Matched For You" horizontal scroll, Recent searches.
6. **Profile Page**: 
   - Editable forms for skills, bio, experience. Resume upload dropzone.

---

## 9. AI / NLP SYSTEM DESIGN

**Why TF-IDF + SBERT? (The Hybrid Approach)**
- **TF-IDF**: Excellent at exact keyword matching. If a job strictly requires "Kubernetes", TF-IDF heavily penalizes profiles without it.
- **SBERT (Sentence-BERT)**: Excellent at deep semantic understanding. Understands that "Frontend Developer" and "React/UI Engineer" are conceptually identical.
- **Flaw of SBERT alone**: Might match a "Senior Java Dev" to a "Senior Python Dev" role because they are both "Senior Backend roles" semantically.
- **Solution**: Hybrid Scoring.

**The Workflow**
1. **Data Preprocessing**: Lowercase text, remove special characters, remove stopwords (for TF-IDF pipeline).
2. **Embedding Generation**: Use `sentence-transformers/all-MiniLM-L6-v2` (fast, 384-dimensional vector, excellent performance/latency ratio).
3. **Vector Storage**: Store in Supabase using `pgvector` (`vector(384)`).
4. **Hybrid Recommendation Formula**:
   ```python
   semantic_score = cosine_similarity(user_vector, job_vector)  # 0 to 1
   keyword_score = tf_idf_match(user_keywords, job_keywords) # 0 to 1
   
   final_score = (0.7 * semantic_score) + (0.3 * keyword_score) + boost_factors
   ```
5. **Boost Factors**: Add flat points if hard constraints match (e.g., User wants Remote, Job is Remote = +0.10).

---

## 10. SEARCH SYSTEM DESIGN

**Smart Search Architecture**
When a user types a query (e.g., "Remote React Jobs in London"):
1. **Query Handling**: Next.js Server Action receives query.
2. **Filtering System**: Apply hard filters (Location: London, Work Type: Remote, Min Salary).
3. **Search Optimization & Execution**:
   - Perform full-text search (PostgreSQL `to_tsvector` / `to_tsquery`) on the filtered subset for exact keyword matches.
   - Run semantic vector search using the query string's SBERT embedding via `pgvector` `<=>` operator to find conceptually related roles.
4. **Ranking Logic**: Combine full-text rank and semantic distance to produce a final sorted list.

---

## 11. SECURITY PLANNING

- **Authentication Security**: Delegated entirely to Supabase Auth. Secure HTTP-only cookies used via `@supabase/ssr` in Next.js to prevent token theft.
- **JWT Handling**: Short-lived JWTs managed by Supabase, refreshed automatically.
- **Row Level Security (RLS)**: The cornerstone of DB security. Users cannot query profiles or bookmarks that don't belong to their `auth.uid()`.
- **API Protection**: FastAPI endpoints protected via internal bearer tokens. Rate limiting implemented via FastAPI `slowapi`.
- **Input Validation**: All client and server inputs validated via `Zod`.
- **XSS Protection**: Next.js automatically escapes React variables.
- **SQL Injection Prevention**: Supabase client uses parameterized queries inherently preventing SQL injection.

---

## 12. PERFORMANCE OPTIMIZATION

- **Frontend Optimization**: Next.js App Router Server Components ship zero JS to the client. Next/Image for auto WebP conversion.
- **Database Optimization**: `pgvector` HNSW index is critical; without it, vector search requires sequential scanning (O(N)). HNSW provides sub-millisecond retrieval.
- **API Optimization**: Edge caching for static API responses.
- **AI Inference Optimization**: FastAPI runs SBERT model loaded into memory ONCE at startup. Use ONNX runtime for faster CPU inference if GPU is unavailable/expensive.
- **Pagination Strategy**: Cursor-based pagination for job feeds to ensure consistent performance over deep page traversal.
- **Lazy Loading**: Lazy load heavy components (e.g., Markdown parsers for job descriptions).

---

## 13. DEPLOYMENT ARCHITECTURE

**Infrastructure**
- **Frontend**: Vercel (Auto CI/CD from GitHub, Edge networking).
- **Database, Auth, Storage**: Supabase Managed Cloud.
- **AI Service**: Render (Web Service, Python environment) or Fly.io.

**CI/CD Planning**
- GitHub Actions for testing (Linting, TypeScript checks).
- Automatic preview deployments on Pull Requests via Vercel.
- Main branch automatically deploys to Production.

**Environment Variables Structure**
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Backend/AI: `SUPABASE_SERVICE_ROLE_KEY`, `INTERNAL_API_SECRET`, `NLP_SERVICE_URL`

---

## 14. DEVELOPMENT ROADMAP

**Phase 1: MVP Setup & Core Functionality (Weeks 1-3)**
- Next.js scaffolding, Tailwind setup, Shadcn/UI integration.
- Supabase project creation, Auth configuration, DB schema & RLS.
- Basic Job Listing, Search, and Job Details pages.

**Phase 2: User Profiles & AI Engine (Weeks 4-6)**
- Build Python FastAPI service for TF-IDF & SBERT.
- Implement background webhooks for job embedding generation.
- Profile creation flows and Resume uploading to Supabase Storage.

**Phase 3: Hybrid Search & Recommendations (Weeks 7-8)**
- Integrate `pgvector` semantic search.
- Develop the "Recommended Jobs" matching algorithm.
- Build the Dashboard and Bookmarking systems.

**Phase 4: Polish & Launch (Weeks 9-10)**
- UI/UX refinements, animations.
- Performance testing, index optimization.
- Vercel and Render production deployments.

---

## 15. MONETIZATION IDEAS (Startup Grade)

1. **B2B (Employers)**:
   - **Premium Job Postings**: Pay to boost visibility and guarantee top placement in semantic search results.
   - **Candidate Discovery / Company Dashboard**: Charge employers a SaaS subscription to search the candidate vector database to find perfect passive candidates.
2. **B2C (Job Seekers) - "Lokeria Pro"**:
   - **AI Resume Analysis**: Premium feature offering "See why you have a 60% match for this job and how to fix your resume to get 95%."
   - See who viewed your profile.
   - Early access to highly competitive jobs.

---

## 16. SCALABILITY STRATEGY

- **Database Scaling**: Supabase handles connection pooling via PgBouncer. As data grows, scale up compute on Supabase.
- **Recommendation Scaling**: As millions of jobs are added, `pgvector` with HNSW handles vector scaling gracefully. For extreme scale, move AI inference to an async queue (RabbitMQ/Celery or Supabase Edge/Inngest) so job postings don't block the main DB transaction.
- **Search Optimization at Scale**: Offload complex full-text/vector searches to dedicated read replicas to avoid locking the primary write database.

---

## 17. TECHNICAL RISKS & MITIGATIONS

- **Risk**: Python AI service latency is too high (>2s).
  - *Mitigation*: Switch to lighter models (e.g., `all-MiniLM-L3-v2`), use ONNX runtime, or implement semantic caching.
- **Risk**: Vector Search returns irrelevant results (Semantic mismatch).
  - *Mitigation*: Heavy reliance on the Hybrid TF-IDF model. Allow users to strictly filter by category/location to narrow the search space before vector math occurs.
- **Risk**: Database costs spike due to vector index memory usage.
  - *Mitigation*: Regularly archive expired jobs (move vectors to cold storage or delete them) to keep the active `pgvector` index lean.

---

## 18. FINAL RECOMMENDATION (CTO PERSPECTIVE)

**Architecture Decision**
Proceed with **Next.js App Router + Supabase + Python FastAPI**. This trifecta offers the highest developer velocity while maintaining enterprise-grade scalability. Do not attempt to run NLP models natively in Node.js.

**MVP Scope**
Focus relentlessly on the **Candidate Experience**. Build the core search and the "Magic" Recommendation engine. Seed the database with scraped or dummy jobs. If the AI recommendation gives users an "aha!" moment, you have product-market fit. Defer the B2B Employer Portal to v2; initially, curate jobs manually to maintain quality.

Lokeria has the technical foundation to completely disrupt traditional keyword-based job boards. Focus heavily on the UI/UX polish and the accuracy of the Hybrid Search, and the product will succeed.
