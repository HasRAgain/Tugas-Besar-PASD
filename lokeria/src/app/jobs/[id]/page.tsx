import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById } from "@/actions/jobs";
import { getUser } from "@/actions/auth";
import { getBookmarkedJobIds } from "@/actions/bookmarks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  ExternalLink,
} from "lucide-react";
import { BookmarkButton } from "./bookmark-button";

interface JobDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: "Job Not Found" };
  return {
    title: job.title,
    description: `${job.title} at ${job.company?.name || "Unknown Company"} — ${job.location || "Remote"}`,
  };
}

export default async function JobDetailPage({ params }: JobDetailProps) {
  const { id } = await params;
  let job = null;
  let user = null;
  let isBookmarked = false;

  try {
    job = await getJobById(id);
    user = await getUser();
    if (user) {
      const bookmarkedIds = await getBookmarkedJobIds();
      isBookmarked = bookmarkedIds.includes(id);
    }
  } catch {
    // Supabase not configured
  }

  if (!job) {
    notFound();
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) => `$${n.toLocaleString()}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  const workTypeColor: Record<string, string> = {
    REMOTE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    HYBRID: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    ONSITE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 gap-1.5">
        <Link href="/jobs">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading sm:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {job.company?.name || "Unknown Company"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className={workTypeColor[job.work_type] || ""}>
                  {job.work_type}
                </Badge>
                {job.experience_level && (
                  <Badge variant="secondary">{job.experience_level}</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <section>
            <h2 className="mb-4 text-xl font-semibold font-heading">
              Job Description
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {/* Requirements */}
          {job.requirements && (
            <section>
              <h2 className="mb-4 text-xl font-semibold font-heading">
                Requirements
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && (
            <section>
              <h2 className="mb-4 text-xl font-semibold font-heading">
                Benefits
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.benefits}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.country && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{job.country}</span>
                </div>
              )}
              {formatSalary(job.min_salary, job.max_salary) && (
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{formatSalary(job.min_salary, job.max_salary)}</span>
                </div>
              )}
              {job.experience_level && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{job.experience_level}</span>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Button className="w-full gap-2" asChild>
                  <a href={job.company?.website || "#"} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <BookmarkButton
                  jobId={job.id}
                  isBookmarked={isBookmarked}
                  isAuthenticated={!!user}
                />
              </div>

              {/* Company Info */}
              {job.company && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">About the Company</h4>
                    <p className="text-sm font-medium">
                      {job.company.name}
                    </p>
                    {job.company.industry && (
                      <p className="text-xs text-muted-foreground">
                        {job.company.industry}
                      </p>
                    )}
                    {job.company.description && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-4">
                        {job.company.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
