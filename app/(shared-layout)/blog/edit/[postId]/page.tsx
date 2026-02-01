import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/web/PostForm";
import { updatePostAction } from "@/app/actions";
import { z } from "zod";
import { postSchema } from "@/app/schemas/blog";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

interface EditPostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const token = await getToken();
  if (!token) {
    return { title: "Edit Article" };
  }
  const post = await fetchQuery(
    api.posts.getPostById,
    { postId: postId as Id<"posts"> },
    { token },
  );
  if (!post) {
    return { title: "Edit Article" };
  }
  return {
    title: `Edit: ${post.title}`,
    description: `Edit your article: ${post.title}`,
    robots: { index: false, follow: true },
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;
  const token = await getToken();

  if (!token) {
    return redirect("/auth/login");
  }

  const post = await fetchQuery(
    api.posts.getPostById,
    { postId: postId as any },
    { token },
  );
  const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });

  if (!post) {
    return notFound();
  }

  if (!user || post.authorId !== user._id) {
    return redirect("/blog"); // Or show unauthorized
  }

  async function handleUpdate(values: z.infer<typeof postSchema>) {
    "use server";
    await updatePostAction(postId, values);
  }

  return (
    <div className="py-8 animate-in fade-in duration-500">
      <header className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="size-4" />
          Refine Your Story
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Edit Article
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Make adjustments to your article and keep it up to date.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <PostForm
          initialData={post}
          onSubmit={handleUpdate}
          isPending={false}
        />
      </div>
    </div>
  );
}
