import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

//Create a new task with the given title and description
export const createPost = mutation({
    args: {
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);  
        if (!user) {
            throw new ConvexError("User not authenticated");
        }    
        const blogArticle = await ctx.db.insert("posts", {
            title: args.title,
            content: args.content,
            authorId: user._id,
        });
        return blogArticle;
    },
});

export const getPosts = query({
    args:{},
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").collect();
        return posts;
    },
});