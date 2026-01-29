import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
  return {
    title: post.title,
    description: post.content,
    category: "Post",
    authors: [{ name: "MD SAFI MAAZ" }],
    creator: "MD SAFI MAAZ",
    publisher: "MD SAFI MAAZ",
    robots: "index, follow",
    keywords: ["post", "blog", "articles", "insights", "draftly"],
  };
}
// Static metadata
// export const metadata: Metadata = {
//     title: "Post",
//     description: "Read our latest articles and insights",
//     category: "Post",
//     authors: [{ name: "MD SAFI MAAZ" }],
//     creator: "MD SAFI MAAZ",
//     publisher: "MD SAFI MAAZ",
//     robots: "index, follow",
//     keywords: ["post", "blog", "articles", "insights", "draftly"],
// }

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const token = await getToken();
  const [post, preLoadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId: postId }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div className="text-center text-6xl font-extrabold py-20 text-red-500">
        Post not found
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1571369985388-ddb4b4e86bd2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by-1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          fill
          alt={post.title}
          className="rounded-t-lg object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-muted-foreground">
            Posted on{" "}
            {new Date(post._creationTime).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
      </div>
      <Separator className="my-8" />
      <p className="text-lg leading-relaxe text-foreground/90 whitespace-pre-wrap">
        {post.content}
      </p>
      <Separator className="my-8" />
      <CommentSection preLoadedComments={preLoadedComments} />
    </div>
  );
}
