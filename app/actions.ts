"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function createPostAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const token = await getToken();
    let storageId: any = undefined;

    if (parsed.data.image) {
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
      const data = await uploadResponse.json();
      storageId = data.storageId;
    }

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        content: parsed.data.content,
        imageStorageId: storageId,
        category: parsed.data.category,
        tags: parsed.data.tags,
        published: parsed.data.published,
      },
      { token },
    );
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to Create Post" };
  }
  revalidatePath("/blog");
  revalidatePath("/");
  return redirect("/blog");
}

export async function updatePostAction(
  postId: string,
  values: z.infer<typeof postSchema>,
) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const token = await getToken();
    let storageId: any = undefined;

    if (parsed.data.image) {
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
      const data = await uploadResponse.json();
      storageId = data.storageId;
    }

    await fetchMutation(
      api.posts.updatePost,
      {
        postId: postId as any,
        title: parsed.data.title,
        content: parsed.data.content,
        imageStorageId: storageId,
        category: parsed.data.category,
        tags: parsed.data.tags,
        published: parsed.data.published,
      },
      { token },
    );
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to Update Post" };
  }
  revalidatePath("/blog");
  revalidatePath(`/blog/${postId}`);
  revalidatePath("/");
  return redirect(`/blog/${postId}`);
}

export async function deletePostAction(postId: string) {
  try {
    const token = await getToken();
    await fetchMutation(
      api.posts.deletePost,
      {
        postId: postId as any,
      },
      { token },
    );
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to Delete Post" };
  }
  revalidatePath("/blog");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return redirect("/blog");
}
