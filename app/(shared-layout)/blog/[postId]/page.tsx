import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft, User, Calendar, Edit, Eye } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryBadge, TagBadge } from "@/components/web/CategoryBadge";
import { PostMeta } from "@/components/web/PostMeta";
import { PostActionsWrapper } from "./PostActionsWrapper";
import { RelatedPostsWrapper } from "./RelatedPostsWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return {
      title: "Post not found",
      description: "Post not found",
    };
  }
  const description =
    post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160);
  const ogImage = post.imageUrl ? [post.imageUrl] : undefined;

  return {
    title: post.title,
    description,
    category: post.category || "blog",
    authors: [{ name: post.authorName || "Draftly Author" }],
    creator: post.authorName || "Draftly",
    publisher: "Draftly",
    robots: { index: true, follow: true },
    keywords: [
      "post",
      "blog",
      "articles",
      "draftly",
      ...(post.tags || []),
      post.category || "",
    ].filter(Boolean),
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: ogImage,
      siteName: "Draftly",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImage,
    },
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent postId={postId} />
    </Suspense>
  );
}

async function PostContent({ postId }: { postId: Id<"posts"> }) {
  const token = await getToken();
  const [post, preLoadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-destructive">Post not found</h1>
        <p className="text-muted-foreground">
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/blog" className={buttonVariants()}>
          Browse Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in duration-500">
      {/* Back button */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Link
          href="/blog"
          className={buttonVariants({
            variant: "ghost",
            className: "gap-2 -ml-2",
          })}
        >
          <ArrowLeft className="size-4" />
          Back to articles
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
          }
          fill
          alt={post.title}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

        {/* Category Badge on Image */}
        {post.category && (
          <div className="absolute top-6 left-6">
            <CategoryBadge category={post.category} size="lg" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 p-6 md:p-12 space-y-8 glass">
          {/* Title and Meta */}
          <header className="space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              {post.title}
            </h1>

            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-border/50">
              <Link
                href={`/user/${post.authorId}`}
                className="group flex items-center gap-4"
              >
                <Avatar className="size-12 ring-2 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={
                      post.authorAvatar ||
                      `https://avatar.vercel.sh/${post.authorName || post.authorId}?w=80&h=80`
                    }
                    alt={post.authorName || "Author"}
                  />
                  <AvatarFallback>
                    <User className="size-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg group-hover:text-primary transition-colors">
                    {post.authorName || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {format(new Date(post._creationTime), "MMM d, yyyy")}
                  </p>
                </div>
              </Link>

              <div className="flex flex-col items-end gap-2">
                <PostMeta
                  readingTime={post.readingTime}
                  viewCount={post.viewCount}
                  likeCount={post.likeCount}
                  createdAt={post._creationTime}
                />

                {userId === post.authorId && (
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/blog/edit/${post._id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "gap-2",
                      })}
                    >
                      <Edit className="size-4" />
                      Edit Post
                    </Link>
                    {!post.published && (
                      <Badge variant="secondary" className="animate-pulse">
                        Draft
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Presence Indicator */}
            {userId && <PostPresence roomId={post._id} userId={userId} />}
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Post Actions */}
          <div className="flex items-center justify-between py-2">
            <PostActionsWrapper postId={post._id} postTitle={post.title} />

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                {post.viewCount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold px-4">Continue Reading</h2>
          <RelatedPostsWrapper postId={post._id} />
        </div>

        {/* Comments Section */}
        <div className="mt-16 bg-card rounded-3xl border border-border/50 p-6 md:p-12 shadow-xl glass">
          <CommentSection preLoadedComments={preLoadedComments} />
        </div>
      </div>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="animate-pulse space-y-8 py-12">
      <div className="max-w-4xl mx-auto px-4 h-6 w-32 bg-muted rounded" />
      <div className="h-[400px] w-full bg-muted" />
      <div className="max-w-4xl mx-auto px-4 space-y-8 -mt-32 relative z-10">
        <div className="bg-card rounded-3xl p-12 space-y-6 shadow-xl">
          <div className="h-12 w-3/4 bg-muted rounded" />
          <div className="flex justify-between items-center border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-muted rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
