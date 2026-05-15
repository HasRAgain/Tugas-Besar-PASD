# LOKERIA: Master Planning & Architecture Document

## 1. PRODUCT OVERVIEW

**Vision**
To seamlessly connect global talent with their ideal opportunities through a highly optimized, fast, and user-friendly job platform.

**Mission**
To dramatically reduce the friction of job hunting and hiring by providing a streamlined, modern platform with powerful filtering and advanced traditional search capabilities.

**Problem Statement**
Traditional job platforms are often clunky, slow, and lack modern UX. Users spend hours navigating poorly designed interfaces and complex filter systems.

**Target Users**
- Active Job Seekers: Professionals actively looking for their next role.
- Passive Job Seekers: Professionals open to roles that match their profile.

**User Pain Points**
- Information overload with poorly structured job descriptions.
- Time-consuming manual filtering for salary, location, and remote work preferences.
- Clunky interfaces on legacy job boards.

**Unique Selling Proposition (USP)**
A modern, lightning-fast, and highly intuitive job board with advanced standard filtering, built on a cutting-edge serverless tech stack.

**Product Goals**
- Deliver a fast, responsive user experience.
- Build a scalable platform capable of handling thousands of job postings.

**Success Metrics (KPIs)**
- Application Conversion Rate (Saved/Applied vs. Viewed).
- Daily Active Users (DAU) & Monthly Active Users (MAU).
- Average Session Duration.

---

## 2. FEATURE BREAKDOWN

### Core Features
- **Job Search Engine**: Keyword, title, and company search with dynamic filtering.
- **Job Details View**: Comprehensive view of job descriptions, requirements, and company info.
- **User Authentication**: Secure Login/Register via email, Google, and GitHub (Supabase Auth).
- **Profile Management**: Profile creation and preference setting.

### User Features
- **Job Bookmarking**: Save jobs to a personal collection.
- **Application Tracking**: (v1.5) Mark jobs as 'Applied', 'Interviewing', etc.

### Admin Features
- **Job Management Dashboard**: CRUD operations for jobs and companies.
- **Platform Analytics**: High-level view of search trends and user activity.

### Future Features (v2)
- Employer portal for direct hiring.

---

## 3. USER FLOW

**Guest User Flow**
1. Lands on Homepage -> Views featured jobs and hero search bar.
2. Performs Search -> Views paginated search results.
3. Clicks Job -> Views job details.
4. Attempts to Bookmark/Apply -> Prompted to Register/Login.

**Registered User Flow**
1. Logs in -> Redirected to Personalized Dashboard.
2. Dashboard displays saved jobs and recent searches.
3. User updates Profile -> Adds skills, updates preferences.
4. User browses listings -> Clicks "Bookmark" on interesting jobs.
5. User navigates to "Saved Jobs" -> Reviews bookmarked jobs and clicks external "Apply" links.

**Admin Flow**
1. Logs into Admin Portal (Protected Route based on role).
2. Navigates to Job Management -> Adds new job postings manually.
3. Jobs are immediately visible on the platform.

---

## 4. SYSTEM ARCHITECTURE

**High-Level Architecture**
Lokeria utilizes a modern, decoupled serverless-first architecture. 
- **Client**: Next.js App Router (React)
- **Primary Backend/DB**: Supabase (PostgreSQL + Auth + Storage)

**Frontend Architecture (Next.js)**
- Utilizing React Server Components (RSC) for initial page loads (SEO optimization, fast LCP).
- Client Components only used for interactive elements (search bars, bookmark toggles).
- Server Actions for form submissions and mutations (login, profile updates) to eliminate intermediate API routes.

**Backend Architecture (Supabase)**
- Direct DB access via Supabase Client with strict Row Level Security (RLS).

**Data Flow (Job Insertion)**
1. Admin inserts Job into Supabase.
2. Data is immediately available to be queried by the Next.js frontend.

**Scalability & Security Considerations**
- Edge caching via Vercel CDN.
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
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

`bookmarks`
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles.id)
- `job_id` (uuid, FK to jobs.id)
- `created_at` (timestamptz)
- *Constraint: UNIQUE(user_id, job_id)*

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

**RLS (Row Level Security) Strategy**
- `jobs` & `companies`: `SELECT` is public. `INSERT/UPDATE/DELETE` restricted to admin role.
- `profiles`, `bookmarks`, `user_preferences`, `search_history`, `notifications`: `SELECT`, `INSERT`, `UPDATE`, `DELETE` restricted to `auth.uid() = id` (or `user_id`).

---

## 6. API DESIGN

All interactions are handled via Next.js Server Actions:

**Next.js Server Actions (Supabase Abstraction)**
- `signIn(email, password)`
- `signUp(email, password, profileData)`
- `getJobs(query, filters, page)`
- `getJobDetails(jobId)`
- `toggleBookmark(jobId)`
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
- **State Management**: Server state managed by Next.js App Router cache and Server Components. Minimal client state managed via React `useState`.
- **Data Fetching**: Primarily fetched in Server Components (`await supabase.from(...)`). Pass data down as props. 
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
   - Sections: Hero (Search Bar), Featured Jobs, Testimonials, Footer.
2. **Login/Register**: 
   - Clean centered card, Social auth buttons, Email/Password fields.
3. **Job Listing (Search)**: 
   - Left Sidebar: Filters (Location, Work Type, Salary Range). 
   - Main Area: Search Bar, Active Filters tags, Job Cards list, Pagination.
4. **Job Details**: 
   - Header: Job Title, Company Logo, Tags. 
   - Main: Description, Requirements, Benefits. 
   - Sticky Aside: "Apply Now" button, Bookmark toggle.
5. **Dashboard**: 
   - Welcome banner, Profile completeness widget, Recent searches.
6. **Profile Page**: 
   - Editable forms for skills, bio, experience. Resume upload dropzone.

---

## 9. SEARCH SYSTEM DESIGN

**Standard Search Architecture**
When a user types a query (e.g., "Remote React Jobs in London"):
1. **Query Handling**: Next.js Server Action receives query.
2. **Filtering System**: Apply hard filters (Location: London, Work Type: Remote, Min Salary).
3. **Execution**:
   - Perform PostgreSQL ILIKE or standard `to_tsvector` text search on the job title and description.
4. **Ranking Logic**: Sort by recency (`created_at`) and exact match relevancy.

---

## 10. SECURITY PLANNING

- **Authentication Security**: Delegated entirely to Supabase Auth. Secure HTTP-only cookies used via `@supabase/ssr` in Next.js to prevent token theft.
- **JWT Handling**: Short-lived JWTs managed by Supabase, refreshed automatically.
- **Row Level Security (RLS)**: The cornerstone of DB security. Users cannot query profiles or bookmarks that don't belong to their `auth.uid()`.
- **Input Validation**: All client and server inputs validated via `Zod`.
- **XSS Protection**: Next.js automatically escapes React variables.
- **SQL Injection Prevention**: Supabase client uses parameterized queries inherently preventing SQL injection.

---

## 11. PERFORMANCE OPTIMIZATION

- **Frontend Optimization**: Next.js App Router Server Components ship zero JS to the client. Next/Image for auto WebP conversion.
- **API Optimization**: Edge caching for static API responses.
- **Pagination Strategy**: Cursor-based pagination for job feeds to ensure consistent performance over deep page traversal.
- **Lazy Loading**: Lazy load heavy components.

---

## 12. DEPLOYMENT ARCHITECTURE

**Infrastructure**
- **Frontend**: Vercel (Auto CI/CD from GitHub, Edge networking).
- **Database, Auth, Storage**: Supabase Managed Cloud.

**CI/CD Planning**
- GitHub Actions for testing (Linting, TypeScript checks).
- Automatic preview deployments on Pull Requests via Vercel.
- Main branch automatically deploys to Production.

**Environment Variables Structure**
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Backend: `SUPABASE_SERVICE_ROLE_KEY`

---

## 13. DEVELOPMENT ROADMAP

**Phase 1: MVP Setup & Core Functionality (Weeks 1-3)**
- Next.js scaffolding, Tailwind setup, Shadcn/UI integration.
- Supabase project creation, Auth configuration, DB schema & RLS.
- Basic Job Listing, Search, and Job Details pages.

**Phase 2: User Profiles & Dashboards (Weeks 4-5)**
- Profile creation flows and Resume uploading to Supabase Storage.
- Build the Dashboard and Bookmarking systems.

**Phase 3: Polish & Launch (Weeks 6-7)**
- UI/UX refinements, animations.
- Performance testing, index optimization.
- Vercel production deployments.

---

## 14. MONETIZATION IDEAS (Startup Grade)

1. **B2B (Employers)**:
   - **Premium Job Postings**: Pay to boost visibility and guarantee top placement in search results.
2. **B2C (Job Seekers) - "Lokeria Pro"**:
   - See who viewed your profile.
   - Early access to highly competitive jobs.

---

## 15. SCALABILITY STRATEGY

- **Database Scaling**: Supabase handles connection pooling via PgBouncer. As data grows, scale up compute on Supabase.
- **Search Optimization at Scale**: Offload complex searches to dedicated read replicas to avoid locking the primary write database.

---

## 16. TECHNICAL RISKS & MITIGATIONS

- **Risk**: Database costs spike due to unoptimized queries.
  - *Mitigation*: Ensure proper indexing on frequently queried columns and implement pagination.
- **Risk**: Search becomes slow at scale.
  - *Mitigation*: Consider adding specialized search solutions (e.g. Algolia or Meilisearch) if PostgreSQL text search becomes a bottleneck later.

---

## 17. FINAL RECOMMENDATION (CTO PERSPECTIVE)

**Architecture Decision**
Proceed with **Next.js App Router + Supabase**. This combination offers the highest developer velocity while maintaining enterprise-grade scalability and an excellent developer experience.

**MVP Scope**
Focus relentlessly on the **Candidate Experience**. Build the core search and job details flows. Seed the database with scraped or dummy jobs. Defer the B2B Employer Portal to v2; initially, curate jobs manually to maintain quality.

Lokeria has the technical foundation to be a highly successful job platform. Focus heavily on the UI/UX polish, speed, and usability to win over users.
