import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import { getBookmarks } from "@/actions/bookmarks";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { Bookmark, Search } from "lucide-react";
import type { Job } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Saved Jobs",
  description: "Your bookmarked jobs.",
};

export default async function BookmarksPage() {
  let user = null;
  let bookmarks: { id: string; job_id: string; job?: Job }[] = [];

  try {
    user = await getUser();
    if (!user) redirect("/login");
    const rawBookmarks = await getBookmarks();
    bookmarks = rawBookmarks as typeof bookmarks;
  } catch {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <Bookmark className="h-7 w-7 text-primary" />
          Saved Jobs
        </h1>
        <p className="mt-1 text-muted-foreground">
          {bookmarks.length} saved job{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bm) =>
            bm.job ? (
              <JobCard
                key={bm.id}
                job={bm.job as Job}
                isBookmarked={true}
                isAuthenticated={true}
              />
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-20">
          <Bookmark className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No saved jobs yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start browsing and save jobs you&apos;re interested in.
          </p>
          <Button className="mt-4 gap-2" asChild>
            <Link href="/jobs">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
