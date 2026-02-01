"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  Clock,
  Zap,
} from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { PostMeta } from "./PostMeta";
import { motion } from "framer-motion";

function EmptyHeroContent() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 -z-10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 left-10 size-72 bg-primary/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1.1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute bottom-10 right-10 size-96 bg-primary/5 rounded-full blur-3xl -z-10"
      />

      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Sparkles className="size-4" />
          Welcome to Draftly
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text"
        >
          Your Space for <span className="text-primary">Ideas</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Discover insightful articles, share your thoughts, and join a
          community of passionate writers and readers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/blog"
            className={buttonVariants({
              size: "lg",
              className:
                "gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all",
            })}
          >
            <BookOpen className="size-4" />
            Explore Articles
          </Link>
          <Link
            href="/create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "gap-2 hover:bg-primary/5",
            })}
          >
            Start Writing
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function HeroSection({
  showFeatured = true,
}: {
  showFeatured?: boolean;
}) {
  const featuredPosts = useQuery(
    api.posts.getFeaturedPosts,
    showFeatured ? { limit: 1 } : "skip",
  );

  if (!showFeatured) {
    return <EmptyHeroContent forGuests />;
  }

  if (!featuredPosts) {
    return <HeroSkeleton />;
  }

  const mainPost = featuredPosts[0];

  if (!mainPost) {
    return <EmptyHeroContent />;
  }

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 -z-10" />
      <div className="absolute top-20 left-10 size-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 size-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="size-4 animate-bounce" />
            Featured Article
          </div>

          {mainPost.category && (
            <CategoryBadge category={mainPost.category} size="lg" />
          )}

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            <Link
              href={`/blog/${mainPost._id}`}
              className="hover:text-primary transition-colors duration-300 decoration-primary/30 underline-offset-8 hover:underline"
            >
              {mainPost.title}
            </Link>
          </h1>

          <p className="text-lg text-muted-foreground line-clamp-3">
            {mainPost.excerpt || "No excerpt available for this amazing story."}
          </p>

          <PostMeta
            readingTime={mainPost.readingTime}
            viewCount={mainPost.viewCount}
            likeCount={mainPost.likeCount}
            createdAt={mainPost._creationTime}
            authorName={mainPost.authorName}
            authorAvatar={mainPost.authorAvatar}
          />

          <div className="flex gap-4 pt-2">
            <Link
              href={`/blog/${mainPost._id}`}
              className={buttonVariants({
                size: "lg",
                className: "gap-2 shadow-lg shadow-primary/20",
              })}
            >
              Read Article
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/blog"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View All Posts
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, rotateY: 5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <Link href={`/blog/${mainPost._id}`} className="block group">
            <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 group-hover:ring-primary/50 transition-all duration-500">
              <Image
                src={
                  mainPost.imageUrl ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
                }
                fill
                alt={mainPost.title}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                    <Clock className="size-5" />
                  </div>
                  <span className="font-medium">
                    {mainPost.readingTime || 5} min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-6">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Skeleton className="aspect-16/10 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

export function TrendingSidebar() {
  const trendingPosts = useQuery(api.posts.getTrendingPosts, { limit: 5 });

  if (!trendingPosts) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-5 text-primary" />
          <h3 className="text-lg font-bold">Trending Now</h3>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-16 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="size-5 text-primary" />
        <h3 className="text-lg font-bold">Trending Now</h3>
      </div>

      {trendingPosts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/blog/${post._id}`}
            className="group flex gap-3 p-3 -m-3 rounded-xl hover:bg-primary/5 transition-all"
          >
            <span className="text-3xl font-black text-primary/10 group-hover:text-primary transition-colors w-8 shrink-0 flex items-center justify-center">
              {index + 1}
            </span>

            <div className="relative size-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
              <Image
                src={
                  post.imageUrl ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200"
                }
                fill
                alt={post.title}
                className="object-cover transition-transform duration-300 group-hover:scale-125"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">
                {post.authorName} • {post.category || "General"} •{" "}
                {post.readingTime || 3} min
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function RecentPostsGrid() {
  const recentPosts = useQuery(api.posts.getLatestPosts, { limit: 6 });

  if (!recentPosts) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recentPosts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
            <Link href={`/blog/${post._id}`}>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"
                  }
                  fill
                  alt={post.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-500" />
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} size="sm" />
                  </div>
                )}
              </div>
            </Link>

            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
              <Link href={`/blog/${post._id}`}>
                <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
              </Link>

              <p className="text-muted-foreground text-sm line-clamp-3">
                {post.excerpt ||
                  "Dive into this interesting read and discover more about " +
                    post.category +
                    "."}
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                <PostMeta
                  readingTime={post.readingTime}
                  createdAt={post._creationTime}
                  authorName={post.authorName}
                  authorAvatar={post.authorAvatar}
                  showViews={false}
                  showLikes={false}
                />
                <ArrowRight className="size-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
