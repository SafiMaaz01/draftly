import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),

    authorId: v.optional(v.string()),
    authorName: v.optional(v.string()),

    imageStorageId: v.optional(v.id("_storage")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    readingTime: v.optional(v.number()),
    viewCount: v.optional(v.number()),
    likeCount: v.optional(v.number()),

    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  })
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_content", {
      searchField: "content",
    })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_author", ["authorId"])
    .index("by_published", ["published"])
    .index("by_featured_published", ["featured", "published"])
    .index("by_trending", ["published", "likeCount", "viewCount"])
    .index("by_author_published", ["authorId", "published"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    authorName: v.string(),
    content: v.string(),
  }).index("by_post", ["postId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]),

  bookmarks: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  userProfiles: defineTable({
    userId: v.string(),
    displayName: v.string(),
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
  }).index("by_user", ["userId"]),
});
