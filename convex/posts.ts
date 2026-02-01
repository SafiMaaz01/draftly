import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

/* ---------------- HELPERS ---------------- */

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

function generateExcerpt(content: string, max = 160): string {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length <= max
    ? plainText
    : plainText.substring(0, max).trim() + "...";
}

async function resolvePosts(ctx: any, posts: Doc<"posts">[]) {
  return Promise.all(
    posts.map(async (post) => {
      const profile = post.authorId
        ? await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q: any) => q.eq("userId", post.authorId))
            .unique()
        : null;

      let authorAvatar = profile?.avatarUrl;
      if (profile?.imageStorageId) {
        authorAvatar =
          (await ctx.storage.getUrl(profile.imageStorageId)) ?? undefined;
      }

      return {
        ...post,
        excerpt: (post.excerpt ?? "").replace(/<[^>]*>/g, ""),
        readingTime: post.readingTime ?? 0,
        viewCount: post.viewCount ?? 0,
        likeCount: post.likeCount ?? 0,
        featured: post.featured ?? false,
        published: post.published ?? false,
        imageUrl: post.imageStorageId
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null,
        authorAvatar,
      };
    }),
  );
}

/* ---------------- CREATE ---------------- */

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      excerpt: generateExcerpt(args.content),

      authorId: user._id,
      authorName: user.name,

      imageStorageId: args.imageStorageId,
      category: args.category,
      tags: args.tags,

      readingTime: calculateReadingTime(args.content),
      viewCount: 0,
      likeCount: 0,

      featured: args.featured ?? false,
      published: args.published ?? false,
    });
  },
});

/* ---------------- READ ---------------- */

export const getFeaturedPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_featured_published", (q) =>
        q.eq("featured", true).eq("published", true),
      )
      .order("desc")
      .take(args.limit ?? 3);

    return resolvePosts(ctx, posts);
  },
});

export const getTrendingPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_trending", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 5);

    return resolvePosts(ctx, posts);
  },
});

export const getLatestPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 6);

    return resolvePosts(ctx, posts);
  },
});

export const getPostsPaginated = query({
  args: {
    paginationOpts: v.any(),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    // Note: Filtering by array elements (tags) in query filters is limited in Convex.
    // If tag is provided, we might still need to filter on the result page or use a search index.
    const result = await query.order("desc").paginate(args.paginationOpts);

    let page = result.page;
    if (args.tag) {
      page = page.filter((p) => p.tags?.includes(args.tag!));
    }

    return {
      ...result,
      page: await resolvePosts(ctx, page),
    };
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return resolvePosts(ctx, posts);
  },
});

export const getPostsByAuthor = query({
  args: {
    authorId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author_published", (q) =>
        q.eq("authorId", args.authorId).eq("published", true),
      )
      .order("desc")
      .take(args.limit ?? 100);
    return resolvePosts(ctx, posts);
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");
    return (await resolvePosts(ctx, [post]))[0];
  },
});

export const searchPosts = query({
  args: { term: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(args.limit ?? 10);

    if (posts.length < (args.limit ?? 10)) {
      const contentPosts = await ctx.db
        .query("posts")
        .withSearchIndex("search_content", (q) =>
          q.search("content", args.term),
        )
        .take((args.limit ?? 10) - posts.length);
      posts.push(...contentPosts);
    }

    // Filter unique and published
    const uniquePosts = Array.from(new Set(posts.map((p) => p._id)))
      .map((id) => posts.find((p) => p._id === id)!)
      .filter((p) => p.published);

    return resolvePosts(ctx, uniquePosts);
  },
});

export const getRelatedPosts = query({
  args: {
    postId: v.id("posts"),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true));

    if (args.category) {
      const categoryPosts = await ctx.db
        .query("posts")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .filter((q) => q.eq(q.field("published"), true))
        .take((args.limit ?? 3) + 1);

      const related = categoryPosts
        .filter((p) => p._id !== args.postId)
        .slice(0, args.limit ?? 3);

      return resolvePosts(ctx, related);
    }

    const posts = await query.order("desc").take((args.limit ?? 3) + 1);
    const filtered = posts
      .filter((p) => p._id !== args.postId)
      .slice(0, args.limit ?? 3);
    return resolvePosts(ctx, filtered);
  },
});

/* ---------------- UPDATE ---------------- */

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");
    if (post.authorId !== user._id) throw new ConvexError("Unauthorized");

    const patch: any = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.content !== undefined) {
      patch.content = args.content;
      patch.excerpt = generateExcerpt(args.content);
      patch.readingTime = calculateReadingTime(args.content);
    }
    if (args.imageStorageId !== undefined)
      patch.imageStorageId = args.imageStorageId;
    if (args.category !== undefined) patch.category = args.category;
    if (args.tags !== undefined) patch.tags = args.tags;
    if (args.featured !== undefined) patch.featured = args.featured;
    if (args.published !== undefined) patch.published = args.published;

    await ctx.db.patch(args.postId, patch);
    return true;
  },
});

/* ---------------- DELETE ---------------- */

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");
    if (post.authorId !== user._id) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.postId);
    return true;
  },
});

/* ---------------- METRICS ---------------- */

export const incrementViewCount = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");

    await ctx.db.patch(args.postId, {
      viewCount: (post.viewCount ?? 0) + 1,
    });
  },
});

/* ---------------- DASHBOARD ---------------- */

export const getUserDashboardStats = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .collect();

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalViews = posts.reduce((sum, p) => sum + (p.viewCount ?? 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);

    return {
      postCount: posts.length,
      publishedCount: posts.filter((p) => p.published).length,
      draftCount: posts.filter((p) => !p.published).length,
      totalViews,
      totalLikes,
      bookmarkCount: bookmarks.length,
    };
  },
});

export const getMyPosts = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect();

    return resolvePosts(ctx, posts);
  },
});

/* ---------------- STORAGE ---------------- */

export const generateImageUploadUrl = mutation({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});
