"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function createPostAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );
    const uploadResponse = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });
    if (!uploadResponse.ok) {
      return { error: "Failed to upload image" };
    }
    const { storageId } = await uploadResponse.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        content: parsed.data.content,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return { error: "Failed to Create Post" };
  }
  updateTag("blog");
  return redirect("/blog");
}
