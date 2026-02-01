"use client";

import { RelatedPosts } from "@/components/web/RelatedPosts";
import { Id } from "@/convex/_generated/dataModel";

interface RelatedPostsWrapperProps {
  postId: Id<"posts">;
}

export function RelatedPostsWrapper({ postId }: RelatedPostsWrapperProps) {
  return <RelatedPosts currentPostId={postId} />;
}
