"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export default function CommentSection(props:{preLoadedComments: Preloaded<typeof api.comments.getCommentsByPostId>}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const commentsData = usePreloadedQuery(props.preLoadedComments);
  const [isPending, startTransition] = useTransition();

  const addComment = useMutation(api.comments.addComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: params.postId,
      content: "",
    },
  });
  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await addComment(data);
        toast.success("Comment added successfully");
      } catch {
        toast.error("Failed to add comment");
      }
      form.reset();
    });
  }

  if (commentsData === undefined) {
    return <div className="text-center text-6xl font-extrabold py-20 text-primary">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{commentsData.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Posting comment...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>

        
        {commentsData?.length > 0 && <Separator/>}

        {commentsData?.length === 0 && <p className="text-center text-muted-foreground">No comments yet</p>}


        <section className="space-y-6">
          {commentsData?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}?w=100&h=100`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "numeric" }, 
                    )}, {new Date(comment._creationTime).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
