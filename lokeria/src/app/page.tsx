import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Briefcase,
  MapPin,
  Filter,
  Bookmark,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { InteractiveBackground } from "@/components/InteractiveBackground";

export default function HomePage() {
  return (
    <div className="flex flex-col relative">
      <InteractiveBackground />
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden border-b bg-transparent">

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Smart Job Search Platform
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl lg:text-6xl">
              Find Your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              Faster Than Ever
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Lokeria helps you discover the most relevant job opportunities with
              powerful search and intelligent filtering. Stop scrolling endlessly
              — find what matters.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2 px-8 text-base">
                <Link href="/jobs">
                  <Search className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 px-8 text-base"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 py-20 sm:py-28 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Everything You Need to Land Your Next Role
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lokeria is built for speed, precision, and a beautiful experience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-none bg-muted/40">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-heading">Smart Filters</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Filter by location, salary range, work type, experience level,
                  and more. Find exactly what you&apos;re looking for in seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none bg-muted/40">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-heading">Save & Organize</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Bookmark jobs you love and organize them in your personal
                  dashboard. Never lose track of an opportunity again.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none bg-muted/40">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-heading">Lightning Fast</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Built on Next.js and Supabase for blazing-fast load times.
                  Server-side rendering ensures instant first paint.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="relative z-10 border-y bg-muted/10 backdrop-blur-sm py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              { value: "10K+", label: "Job Listings" },
              { value: "5K+", label: "Companies" },
              { value: "50K+", label: "Job Seekers" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary font-heading">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative z-10 py-20 sm:py-28 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
            <div className="pointer-events-none absolute -top-16 left-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <Shield className="mx-auto mb-4 h-10 w-10" />
              <h2 className="text-3xl font-bold font-heading sm:text-4xl">
                Ready to Find Your Perfect Job?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Join thousands of professionals who&apos;ve found their dream
                roles through Lokeria.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="gap-2 px-8"
                >
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 gap-2 px-8"
                >
                  <Link href="/jobs">
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
