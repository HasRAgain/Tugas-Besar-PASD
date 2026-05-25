import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationCarousel } from "./RecommendationCarousel";

export function RecommendationSkeleton() {
  return (
    <RecommendationCarousel>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="min-w-[85vw] sm:min-w-[350px] max-w-[350px] snap-center sm:snap-start shrink-0">
          <Card className="relative h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 flex-1">
              <Skeleton className="h-5 w-20 rounded-full" />
            </CardContent>
            <CardFooter className="flex gap-3 pt-0">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </CardFooter>
          </Card>
        </div>
      ))}
    </RecommendationCarousel>
  );
}
