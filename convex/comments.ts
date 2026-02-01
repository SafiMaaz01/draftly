import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", comment.authorId))
          .unique();

        let authorAvatar = profile?.avatarUrl;
        if (profile?.imageStorageId) {
          authorAvatar =
            (await ctx.storage.getUrl(profile.imageStorageId)) ?? undefined;
        }

        return {
          ...comment,
          authorAvatar,
        };
      }),
    );
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("User not authenticated");
    }
    return await ctx.db.insert("comments", {
      postId: args.postId,
      content: args.content,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
