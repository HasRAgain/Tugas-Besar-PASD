import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser, getProfile } from "@/actions/auth";
import { getBookmarks } from "@/actions/bookmarks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Bookmark,
  User,
  Search,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized Lokeria dashboard.",
};

export default async function DashboardPage() {
  let user = null;
  let profile = null;
  let bookmarkCount = 0;

  try {
    user = await getUser();
    if (!user) redirect("/login");
    profile = await getProfile();
    const bookmarks = await getBookmarks();
    bookmarkCount = bookmarks.length;
  } catch {
    redirect("/login");
  }

  // Profile completeness
  const fields = [
    profile?.full_name,
    profile?.headline,
    profile?.bio,
    profile?.location,
    profile?.country,
  ];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold font-heading sm:text-3xl">
          Welcome back, {profile?.full_name || "there"}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{bookmarkCount}</p>
              <p className="text-sm text-muted-foreground">Saved Jobs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completeness}%</p>
              <p className="text-sm text-muted-foreground">Profile Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">∞</p>
              <p className="text-sm text-muted-foreground">Jobs Available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="mb-4 text-xl font-semibold font-heading">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" />
              Search Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse thousands of opportunities with powerful filters.
            </p>
            <Button size="sm" asChild className="gap-1.5">
              <Link href="/jobs">
                Browse
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bookmark className="h-4 w-4 text-primary" />
              Saved Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Review your bookmarked jobs and track applications.
            </p>
            <Button size="sm" variant="outline" asChild className="gap-1.5">
              <Link href="/bookmarks">
                View Saved
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {completeness < 100
                ? "Complete your profile to stand out."
                : "Your profile is all set!"}
            </p>
            <Button size="sm" variant="outline" asChild className="gap-1.5">
              <Link href="/profile">
                {completeness < 100 ? "Complete" : "View"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
