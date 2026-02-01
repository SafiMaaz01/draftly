"use client";

import { Clock, Eye, Heart, Calendar, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostMetaProps {
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  createdAt: number;
  showViews?: boolean;
  showLikes?: boolean;
  authorName?: string;
  authorAvatar?: string;
}

export function PostMeta({
  readingTime,
  viewCount,
  likeCount,
  createdAt,
  showViews = true,
  showLikes = true,
  authorName,
  authorAvatar,
}: PostMetaProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {authorName && (
        <div className="flex items-center gap-2">
          <Avatar className="size-6 border border-border/50">
            <AvatarImage
              src={
                authorAvatar ||
                `https://avatar.vercel.sh/${authorName}?w=48&h=48`
              }
              alt={authorName}
            />
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/80">{authorName}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 translate-y-[0.5px]">
        <Calendar className="size-3.5" />
        <span>{formattedDate}</span>
      </div>

      {readingTime && (
        <div className="flex items-center gap-1">
          <Clock className="size-3.5" />
          <span>{readingTime} min read</span>
        </div>
      )}

      {showViews && viewCount !== undefined && viewCount > 0 && (
        <div className="flex items-center gap-1">
          <Eye className="size-3.5" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>
      )}

      {showLikes && likeCount !== undefined && likeCount > 0 && (
        <div className="flex items-center gap-1">
          <Heart className="size-3.5" />
          <span>{likeCount.toLocaleString()} likes</span>
        </div>
      )}
    </div>
  );
}
