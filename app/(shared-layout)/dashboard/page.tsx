"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useMutation } from "convex/react";

import { ProfileSettings } from "@/components/web/ProfileSettings";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "settings">(
    "overview",
  );
  const stats = useQuery(api.posts.getUserDashboardStats);
  const myPosts = useQuery(api.posts.getMyPosts);
  const deletePost = useMutation(api.posts.deletePost);

  const handleDelete = async (postId: any) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost({ postId });
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  if (!stats || !myPosts) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your content and view your performance.
          </p>
        </div>
        <Link href="/create" className={buttonVariants({ className: "gap-2" })}>
          <Plus className="size-4" />
          New Article
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "overview"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LayoutDashboard className="size-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "posts"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <FileText className="size-4" />
          My Posts
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "settings"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Settings className="size-4" />
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Articles"
                value={stats.postCount}
                description={`${stats.publishedCount} Published, ${stats.draftCount} Drafts`}
                icon={FileText}
                trend="+0%"
              />
              <StatCard
                title="Total Views"
                value={stats.totalViews}
                description="Views across all posts"
                icon={Eye}
                trend="+0%"
              />
              <StatCard
                title="Total Likes"
                value={stats.totalLikes}
                description="Likes from readers"
                icon={Heart}
                trend="+0%"
              />
              <StatCard
                title="Bookmarks"
                value={stats.bookmarkCount}
                description="Saved by users"
                icon={TrendingUp}
                trend="+0%"
              />
            </div>

            {/* Recent Posts Mini List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>
                  Your top performing articles this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myPosts.slice(0, 5).map((post) => (
                    <div
                      key={post._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <Link
                          href={`/blog/${post._id}`}
                          className="font-bold hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {post.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="size-3" />
                            {post.likeCount || 0}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post._id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "shrink-0",
                        )}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  ))}
                  {myPosts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No posts found. Start writing to see stats here!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Content Management</h2>
            <div className="grid gap-4">
              {myPosts.map((post) => (
                <Card
                  key={post._id}
                  className="overflow-hidden border-border/50 hover:border-primary/30 transition-all group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                      {/* Status Indicator */}
                      <div className="flex sm:flex-col items-center gap-2 sm:gap-1 text-[10px] font-bold uppercase tracking-widest min-w-[80px]">
                        {post.published ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {format(
                              new Date(post._creationTime),
                              "MMM d, yyyy",
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {post.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1 text-primary/80 font-medium">
                            {post.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/blog/edit/${post._id}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "gap-2",
                          })}
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/blog/${post._id}`}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="size-4" />
                                View Live
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(post._id)}
                            >
                              <Trash2 className="size-4" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {myPosts.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50 space-y-4">
                  <div className="text-5xl">✍️</div>
                  <h3 className="font-bold text-xl">No articles found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You haven&apos;t created any articles yet. Ready to share
                    your thoughts?
                  </p>
                  <Link
                    href="/create"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Start Writing
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            <ProfileSettings />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, trend }: any) {
  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1 rounded">
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
