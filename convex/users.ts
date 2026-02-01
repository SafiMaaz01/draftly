import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return null;

    let avatarUrl = profile.avatarUrl;
    if (profile.imageStorageId) {
      avatarUrl =
        (await ctx.storage.getUrl(profile.imageStorageId)) ?? undefined;
    }

    return {
      ...profile,
      avatarUrl,
    };
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    socialLinks: v.optional(
      v.object({
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        website: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        displayName: args.displayName ?? profile.displayName,
        bio: args.bio ?? profile.bio,
        avatarUrl: args.avatarUrl ?? profile.avatarUrl,
        imageStorageId: args.imageStorageId ?? profile.imageStorageId,
        socialLinks: args.socialLinks ?? profile.socialLinks,
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: user._id,
        displayName: args.displayName ?? user.name ?? "Anonymous",
        bio: args.bio,
        avatarUrl: args.avatarUrl,
        imageStorageId: args.imageStorageId,
        socialLinks: args.socialLinks,
      });
    }
  },
});

export const deleteUserAccount = mutation({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 1. Delete user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // 2. Delete all posts by this user
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .collect();
    for (const post of posts) {
      await ctx.db.delete(post._id);
    }

    // 3. Delete all comments by this user
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 4. Delete all likes by this user
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // 5. Delete all bookmarks by this user
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // Note: Better Auth user deletion should be handled via the auth client
    // but we clean up the app data here.
    return true;
  },
});
