"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HeroSection,
  TrendingSidebar,
  RecentPostsGrid,
} from "@/components/web/HomePage";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Newspaper,
  BookOpen,
  LogIn,
  UserPlus,
  LayoutDashboard,
  PenSquare,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GuestCTA() {
  return (
    <section className="relative py-16 px-6 rounded-3xl overflow-hidden border border-dashed border-primary/30 bg-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary)/0.08),transparent_70%)]" />
      <div className="relative max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
          <BookOpen className="size-4" />
          Sign in to explore
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">
          Discover articles and join the community
        </h2>
        <p className="text-muted-foreground">
          Create an account to read the latest posts, save your favorites, and
          share your own stories.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Link
            href="/auth/login"
            className={buttonVariants({
              size: "lg",
              className: "gap-2 shadow-lg shadow-primary/20",
            })}
          >
            <LogIn className="size-4" />
            Log in
          </Link>
          <Link
            href="/auth/sign-up"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "gap-2",
            })}
          >
            <UserPlus className="size-4" />
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}

function WelcomeStrip() {
  const user = useQuery(api.auth.getCurrentUser);
  const profile = useQuery(
    api.users.getProfile,
    user ? { userId: user._id } : "skip",
  );
  const bookmarks = useQuery(api.bookmarks.getUserBookmarks);
  const myPosts = useQuery(api.posts.getMyPosts);

  const displayName =
    profile?.displayName ?? user?.name ?? user?.email ?? "there";
  const savedCount = bookmarks?.length ?? 0;
  const postsCount = myPosts?.length ?? 0;

  return (
    <Card className="p-4 md:p-5 bg-gradient-to-r from-primary/5 via-card to-primary/5 border-primary/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-lg">
              Welcome back, {displayName}!
            </h2>
            <p className="text-sm text-muted-foreground">
              {savedCount > 0 && `${savedCount} saved · `}
              {postsCount > 0 && `${postsCount} post${postsCount !== 1 ? "s" : ""}`}
              {savedCount === 0 && postsCount === 0 && "Ready to explore?"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5",
            })}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/create"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5",
            })}
          >
            <PenSquare className="size-4" />
            Create
          </Link>
          <Link
            href="/bookmarks"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5",
            })}
          >
            <Bookmark className="size-4" />
            Saved
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function HomePageWithAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="space-y-16 py-6">
      <HeroSection showFeatured={isAuthenticated ?? false} />

      <Separator className="my-8" />

      {!isAuthenticated ? (
        <GuestCTA />
      ) : isLoading ? (
        <section className="grid lg:grid-cols-[1fr_320px] gap-8">
          <HomePageSkeleton />
          <aside className="hidden lg:block">
            <Card className="p-6 sticky top-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="size-16 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </section>
      ) : (
        <>
          <WelcomeStrip />

          <section className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="size-5 text-primary" />
                  <h2 className="text-2xl font-bold">Recent Articles</h2>
                </div>
                <Link
                  href="/blog"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "gap-1",
                  })}
                >
                  View All
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <RecentPostsGrid />
            </div>

            <aside className="space-y-8">
              <Card className="p-6 sticky top-6 bg-linear-to-br from-card via-card to-muted/20">
                <TrendingSidebar />
              </Card>
            </aside>
          </section>

          <section className="relative py-16 px-8 rounded-3xl overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary)/0.08),transparent_50%)]" />

            <div className="relative text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Share Your Story?
              </h2>
              <p className="text-muted-foreground text-lg">
                Join our community of writers and readers. Create your next post
                and inspire others with your ideas.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link
                  href="/create"
                  className={buttonVariants({
                    size: "lg",
                    className: "gap-2",
                  })}
                >
                  Start Writing
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/blog"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  Explore Articles
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
