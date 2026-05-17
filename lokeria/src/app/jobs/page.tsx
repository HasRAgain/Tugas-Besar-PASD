import { Suspense } from "react";
import { Metadata } from "next";
import { getJobs } from "@/actions/jobs";
import { getBookmarkedJobIds } from "@/actions/bookmarks";
import { getUser } from "@/actions/auth";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Browse thousands of job opportunities. Filter by location, salary, work type, and more.",
};

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    work_type?: string;
    min_salary?: string;
    max_salary?: string;
    page?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  let jobs: Job[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let currentPage = 1;
  let bookmarkedIds: string[] = [];
  let user = null;

  try {
    user = await getUser();

    const result = await getJobs({
      query: params.q,
      location: params.location,
      work_type: params.work_type,
      min_salary: params.min_salary ? Number(params.min_salary) : undefined,
      max_salary: params.max_salary ? Number(params.max_salary) : undefined,
      page: params.page ? Number(params.page) : 1,
    });

    jobs = (result.jobs || []) as Job[];
    totalCount = result.totalCount || 0;
    totalPages = result.totalPages || 1;
    currentPage = result.currentPage || 1;

    if (user) {
      bookmarkedIds = await getBookmarkedJobIds();
    }
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Find Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          {totalCount > 0
            ? `${totalCount} jobs found`
            : "Browse all available positions"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-5">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <JobFilters />
            </Suspense>
          </div>
        </aside>

        {/* Job Results */}
        <div>
          {/* Active filter tags */}
          {(params.q || params.location || params.work_type) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {params.q && (
                <Badge variant="secondary" className="text-xs">
                  Search: {params.q}
                </Badge>
              )}
              {params.location && (
                <Badge variant="secondary" className="text-xs">
                  Location: {params.location}
                </Badge>
              )}
              {params.work_type && (
                <Badge variant="secondary" className="text-xs">
                  {params.work_type}
                </Badge>
              )}
            </div>
          )}

          {jobs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isBookmarked={bookmarkedIds.includes(job.id)}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-20">
              <Briefcase className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search query.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/jobs">Clear all filters</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
              >
                {currentPage > 1 ? (
                  <Link
                    href={`/jobs?${new URLSearchParams({
                      ...params,
                      page: String(currentPage - 1),
                    }).toString()}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </span>
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
              >
                {currentPage < totalPages ? (
                  <Link
                    href={`/jobs?${new URLSearchParams({
                      ...params,
                      page: String(currentPage + 1),
                    }).toString()}`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
