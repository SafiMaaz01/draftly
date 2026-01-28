import z from "zod";
import { Id } from "@/convex/_generated/dataModel";

export const commentSchema = z.object({
  postId: z.custom<Id<"posts">>(),
  content: z
    .string()
    .min(3, "Comment must be at least 3 characters long")
    .max(1000, "Comment must be at most 1000 characters long"),
});
