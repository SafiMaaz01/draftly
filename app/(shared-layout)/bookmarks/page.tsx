"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Bookmark, BookOpen, ArrowRight } from "lucide-react";
import { CategoryBadge, TagBadge } from "@/components/web/CategoryBadge";
import { PostMeta } from "@/components/web/PostMeta";

export default function BookmarksPage() {
  const bookmarks = useQuery(api.bookmarks.getUserBookmarks);

  if (bookmarks === undefined) {
    return (
      <div className="py-12 space-y-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Bookmark className="size-4" />
            Your Reading List
          </div>
          <h1 className="text-4xl font-extrabold">Saved Articles</h1>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 animate-in fade-in duration-500">
        <div className="text-8xl">📚</div>
        <h1 className="text-3xl font-bold">No saved articles yet</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Start exploring and bookmark articles you want to read later.
          They&apos;ll appear here!
        </p>
        <Link
          href="/blog"
          className={buttonVariants({ size: "lg", className: "gap-2" })}
        >
          <BookOpen className="size-4" />
          Explore Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Bookmark className="size-4 fill-current" />
          Your Reading List
        </div>
        <h1 className="text-4xl font-extrabold">
          Saved Articles{" "}
          <span className="text-muted-foreground font-normal">
            ({bookmarks.length})
          </span>
        </h1>
        <p className="text-muted-foreground">
          Articles you&apos;ve bookmarked for later reading
        </p>
      </header>

      {/* Bookmarked Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((post) => (
          <Card
            key={post._id}
            className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
          >
            <Link href={`/blog/${post._id}`}>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600"
                  }
                  fill
                  alt={post.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} size="sm" />
                  </div>
                )}
                {/* Bookmark indicator */}
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
                  <Bookmark className="size-4 fill-current" />
                </div>
              </div>
            </Link>

            <CardContent className="p-5 space-y-3">
              <Link href={`/blog/${post._id}`}>
                <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>

              <p className="text-muted-foreground text-sm line-clamp-2">
                {post.excerpt || post.content.substring(0, 120)}...
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <PostMeta
                  readingTime={post.readingTime}
                  createdAt={post._creationTime}
                  showViews={false}
                  showLikes={false}
                />
                <Link
                  href={`/blog/${post._id}`}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Read
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
