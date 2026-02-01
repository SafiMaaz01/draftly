import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const toggleBookmark = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("User not authenticated");
    }

    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", user._id),
      )
      .first();

    if (existingBookmark) {
      await ctx.db.delete(existingBookmark._id);
      return { bookmarked: false };
    } else {
      await ctx.db.insert("bookmarks", {
        postId: args.postId,
        userId: user._id,
      });
      return { bookmarked: true };
    }
  },
});

export const getBookmarkStatus = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return { bookmarked: false };
    }

    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", user._id),
      )
      .first();

    return { bookmarked: !!existingBookmark };
  },
});

export const getUserBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return [];
    }

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const posts = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);
        if (!post) return null;

        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
          bookmarkId: bookmark._id,
        };
      }),
    );

    return posts.filter((post) => post !== null);
  },
});
