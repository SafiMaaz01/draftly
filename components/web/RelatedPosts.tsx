"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { PostMeta } from "./PostMeta";

interface RelatedPostsProps {
  currentPostId: Id<"posts">;
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const relatedPosts = useQuery(api.posts.getRelatedPosts, {
    postId: currentPostId,
    limit: 3,
  });

  if (!relatedPosts) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h3 className="text-xl font-bold">You Might Also Like</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h3 className="text-xl font-bold">You Might Also Like</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <Card
            key={post._id}
            className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/blog/${post._id}`}>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"
                  }
                  fill
                  alt={post.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {post.category && (
                  <div className="absolute top-2 left-2">
                    <CategoryBadge category={post.category} size="sm" />
                  </div>
                )}
              </div>
            </Link>

            <CardContent className="p-4 space-y-2">
              <Link href={`/blog/${post._id}`}>
                <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
              </Link>

              <PostMeta
                readingTime={post.readingTime}
                createdAt={post._creationTime}
                showViews={false}
                showLikes={false}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
