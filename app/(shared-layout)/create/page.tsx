"use client";

import { Sparkles } from "lucide-react";
import { createPostAction } from "@/app/actions";
import { PostForm } from "@/components/web/PostForm";
import { z } from "zod";
import { postSchema } from "@/app/schemas/blog";
import { useTransition } from "react";
import { toast } from "sonner";

export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();

  async function handleCreate(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
      const result = await createPostAction(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Article created successfully!");
      }
    });
  }

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="size-4" />
          Share Your Ideas
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Create New Article
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Write something amazing and inspire others with your thoughts and
          ideas.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <PostForm onSubmit={handleCreate} isPending={isPending} />
      </div>
    </div>
  );
}
