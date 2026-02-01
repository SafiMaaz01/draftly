import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  image: z.instanceof(File).optional(),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  published: z.boolean(),
});
