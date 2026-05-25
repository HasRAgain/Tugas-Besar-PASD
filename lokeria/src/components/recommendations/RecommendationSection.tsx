import Link from "next/link";
import { getRecommendations } from "@/actions/recommendations";
import { RecommendationCard } from "./RecommendationCard";
import { RecommendationCarousel } from "./RecommendationCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  UserCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

/**
 * Server Component that fetches and renders the AI recommendation section.
 * Handles three states:
 * 1. Profile incomplete → prompt user to complete profile
 * 2. Error → show error message
 * 3. Recommendations found → show job cards grid
 */
export async function RecommendationSection() {
  const result = await getRecommendations(9);

  // State: user needs to complete their profile first
  if (result.needsProfile) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
            <UserCircle className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Complete Your Profile
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            Add your headline, bio, skills, and interests so our AI can find
            the best job matches for you.
          </p>
          <Button asChild className="gap-2">
            <Link href="/profile">
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // State: error fetching recommendations
  if (result.error) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Something Went Wrong
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We couldn&apos;t load your recommendations right now. Please try
            again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // State: no recommendations (shouldn't happen with 50k jobs, but handle it)
  if (result.jobs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            No Recommendations Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Update your profile with more details and we&apos;ll find the
            best matches for you.
          </p>
        </CardContent>
      </Card>
    );
  }

  // State: recommendations found!
  return (
    <RecommendationCarousel>
      {result.jobs.map((job) => (
        <div key={job.id} className="min-w-[85vw] sm:min-w-[350px] max-w-[350px] snap-center sm:snap-start shrink-0 flex flex-col">
          <div className="flex-1 h-full">
            <RecommendationCard job={job} />
          </div>
        </div>
      ))}
    </RecommendationCarousel>
  );
}
