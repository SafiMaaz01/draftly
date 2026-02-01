"use client";

import { PostActions } from "@/components/web/PostActions";
import { Id } from "@/convex/_generated/dataModel";

interface PostActionsWrapperProps {
  postId: Id<"posts">;
  postTitle: string;
}

export function PostActionsWrapper({
  postId,
  postTitle,
}: PostActionsWrapperProps) {
  return <PostActions postId={postId} postTitle={postTitle} showLabels />;
}
