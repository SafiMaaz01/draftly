"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Heart, Bookmark, Share2, Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PostActionsProps {
  postId: Id<"posts">;
  postTitle: string;
  showLabels?: boolean;
}

export function PostActions({
  postId,
  postTitle,
  showLabels = false,
}: PostActionsProps) {
  const [isPendingLike, startTransitionLike] = useTransition();
  const [isPendingBookmark, startTransitionBookmark] = useTransition();
  const [copied, setCopied] = useState(false);

  const likeStatus = useQuery(api.likes.getLikeStatus, { postId });
  const bookmarkStatus = useQuery(api.bookmarks.getBookmarkStatus, { postId });

  const toggleLike = useMutation(api.likes.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

  const handleLike = () => {
    startTransitionLike(async () => {
      try {
        const result = await toggleLike({ postId });
        toast.success(result.liked ? "Post liked!" : "Like removed");
      } catch {
        toast.error("Please login to like posts");
      }
    });
  };

  const handleBookmark = () => {
    startTransitionBookmark(async () => {
      try {
        const result = await toggleBookmark({ postId });
        toast.success(
          result.bookmarked ? "Post bookmarked!" : "Bookmark removed",
        );
      } catch {
        toast.error("Please login to bookmark posts");
      }
    });
  };

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/blog/${postId}`;
    const text = `Check out "${postTitle}" on Draftly`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={likeStatus?.liked ? "default" : "outline"}
        size={showLabels ? "default" : "icon"}
        onClick={handleLike}
        disabled={isPendingLike}
        className="transition-all duration-300 hover:scale-105"
      >
        <Heart
          className={`size-4 ${likeStatus?.liked ? "fill-current" : ""} ${isPendingLike ? "animate-pulse" : ""}`}
        />
        {showLabels && <span className="ml-1">{likeStatus?.count ?? 0}</span>}
      </Button>

      <Button
        variant={bookmarkStatus?.bookmarked ? "default" : "outline"}
        size="icon"
        onClick={handleBookmark}
        disabled={isPendingBookmark}
        className="transition-all duration-300 hover:scale-105"
      >
        <Bookmark
          className={`size-4 ${bookmarkStatus?.bookmarked ? "fill-current" : ""} ${isPendingBookmark ? "animate-pulse" : ""}`}
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="transition-all duration-300 hover:scale-105"
          >
            <Share2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleShare("twitter")}
            className="cursor-pointer"
          >
            <svg
              className="size-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleShare("linkedin")}
            className="cursor-pointer"
          >
            <svg
              className="size-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleShare("facebook")}
            className="cursor-pointer"
          >
            <svg
              className="size-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleShare("copy")}
            className="cursor-pointer"
          >
            {copied ? (
              <Check className="size-4 mr-2 text-green-500" />
            ) : (
              <Copy className="size-4 mr-2" />
            )}
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
