import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, DollarSign, Building2, Sparkles } from "lucide-react";
import type { RecommendedJob } from "@/types/database.types";

interface RecommendationCardProps {
  job: RecommendedJob;
}

export function RecommendationCard({ job }: RecommendationCardProps) {
  const matchPercent = Math.round(job.similarity * 100);

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  const matchColor =
    matchPercent >= 85
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : matchPercent >= 70
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
      {/* Match Score Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <Badge className={`gap-1 shadow-sm ${matchColor}`}>
          <Sparkles className="h-3 w-3" />
          {matchPercent}% Match
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight line-clamp-1">
              {job.job_title}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
              {job.company || "Unknown Company"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {job.role && (
          <Badge variant="outline" className="text-xs mb-2">
            {job.role}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 pt-0">
        {job.location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}

        {formatSalary(job.min_salary_usd, job.max_salary_usd) && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            {formatSalary(job.min_salary_usd, job.max_salary_usd)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
