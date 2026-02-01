"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Loader2 } from "lucide-react";
import { CategoryBadge, TagBadge } from "@/components/web/CategoryBadge";
import { PostMeta } from "@/components/web/PostMeta";

interface PaginatedBlogListProps {
  category?: string;
  tag?: string;
}

export function PaginatedBlogList({ category, tag }: PaginatedBlogListProps) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getPostsPaginated,
    { category, tag },
    { initialNumItems: 9 },
  );

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.map((post, index) => (
          <Card
            key={post._id}
            className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 pt-0 animate-in fade-in"
          >
            <Link href={`/blog/${post._id}`}>
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={
                    post.imageUrl ??
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600"
                  }
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={post.title}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} size="sm" />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                  <Clock className="size-3" />
                  {post.readingTime || 3} min
                </div>
              </div>
            </Link>

            <CardContent className="p-5 space-y-3">
              <Link href={`/blog/${post._id}`}>
                <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>
              </Link>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {post.excerpt ||
                  post.content.replace(/<[^>]*>/g, "").substring(0, 120)}
                ...
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
              <PostMeta
                readingTime={post.readingTime}
                createdAt={post._creationTime}
                authorName={post.authorName}
                authorAvatar={post.authorAvatar}
                showViews={false}
                showLikes={false}
              />
            </CardContent>

            <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
              <Link
                href={`/blog/${post._id}`}
                className={buttonVariants({ className: "flex-1" })}
              >
                Read Article
              </Link>
              {(post.likeCount ?? 0) > 0 && (
                <div className="flex items-center gap-1 ml-3 text-sm text-muted-foreground">
                  <Heart className="size-4 text-primary fill-primary" />
                  <span>{post.likeCount}</span>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {status === "LoadingMore" && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-52 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => loadMore(6)}
            variant="outline"
            size="lg"
            className="px-12 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Show More Articles
          </Button>
        </div>
      )}

      {status === "Exhausted" && results.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          You've reached the end of our stories.
        </div>
      )}

      {status === "Exhausted" && results.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl">📝</div>
          <h2 className="text-2xl font-bold">No articles yet</h2>
          <p className="text-muted-foreground">
            Be the first to share your story!
          </p>
          <Link
            href="/create"
            className={buttonVariants({ className: "gap-2" })}
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
}
