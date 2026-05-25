"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, Building2 } from "lucide-react";
import type { Job } from "@/types/database.types";
import { toggleBookmark } from "@/actions/bookmarks";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
  isBookmarked?: boolean;
  isAuthenticated?: boolean;
}

export function JobCard({
  job,
  isBookmarked = false,
  isAuthenticated = false,
}: JobCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark jobs.");
      return;
    }
    startTransition(async () => {
      const result = await toggleBookmark(job.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        setBookmarked(result.bookmarked ?? false);
        toast.success(
          result.bookmarked ? "Job saved!" : "Bookmark removed."
        );
      }
    });
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  const workTypeColor = (workType: string | null): string => {
    const wt = (workType || "").toLowerCase();
    if (wt.includes("remote")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (wt.includes("hybrid")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    if (wt.includes("on-site") || wt.includes("onsite")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (wt.includes("intern")) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="text-base font-semibold leading-tight hover:text-primary transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                {job.company_name || job.company?.name || "Unknown Company"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={handleBookmark}
            disabled={isPending}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 pt-0">
        {job.work_type && (
          <Badge
            variant="secondary"
            className={`text-xs ${workTypeColor(job.work_type)}`}
          >
            {job.work_type}
          </Badge>
        )}

        {job.location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}

        {formatSalary(job.min_salary, job.max_salary) && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            {formatSalary(job.min_salary, job.max_salary)}
          </span>
        )}

        {(job.min_experience_years != null || job.max_experience_years != null) && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {job.min_experience_years != null && job.max_experience_years != null
              ? `${job.min_experience_years}–${job.max_experience_years} yrs`
              : job.min_experience_years != null
              ? `${job.min_experience_years}+ yrs`
              : `Up to ${job.max_experience_years} yrs`}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
