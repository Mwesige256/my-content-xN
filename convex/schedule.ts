import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Schedule a post
export const schedulePost = mutation({
  args: {
    scriptId: v.id("scripts"),
    platform: v.string(),
    scheduledDate: v.number(),
    scheduledTime: v.string(),
  },
  returns: v.id("scheduledPosts"),
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("scheduledPosts", {
      ...args,
      status: "scheduled",
      createdAt: Date.now(),
    });

    // Update idea status to scheduled
    const script = await ctx.db.get(args.scriptId);
    if (script?.ideaId) {
      await ctx.db.patch(script.ideaId, { status: "scheduled" });
    }

    return postId;
  },
});

// Get scheduled posts by date range
export const getScheduledPosts = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("scheduledPosts"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
      scriptId: v.id("scripts"),
      platform: v.string(),
      scheduledDate: v.number(),
      scheduledTime: v.string(),
      status: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("scheduledPosts").order("desc");
    
    if (args.startDate && args.endDate) {
      // Filter by date range if provided
      const posts = await query.take(100);
      return posts.filter(
        (p) => p.scheduledDate >= args.startDate! && p.scheduledDate <= args.endDate!
      );
    }
    
    return await query.take(50);
  },
});

// Update post status
export const updatePostStatus = mutation({
  args: {
    postId: v.id("scheduledPosts"),
    status: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, { status: args.status });
    return null;
  },
});

// Delete scheduled post
export const deletePost = mutation({
  args: {
    postId: v.id("scheduledPosts"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
    return null;
  },
});

// Get posting statistics
export const getPostingStats = query({
  args: {},
  returns: v.object({
    totalScheduled: v.number(),
    totalPosted: v.number(),
    totalDraft: v.number(),
    byPlatform: v.record(v.string(), v.number()),
  }),
  handler: async (ctx) => {
    const posts = await ctx.db.query("scheduledPosts").collect();
    
    const stats = {
      totalScheduled: posts.filter((p) => p.status === "scheduled").length,
      totalPosted: posts.filter((p) => p.status === "posted").length,
      totalDraft: posts.filter((p) => p.status === "draft").length,
      byPlatform: {} as Record<string, number>,
    };

    for (const post of posts) {
      stats.byPlatform[post.platform] = (stats.byPlatform[post.platform] ?? 0) + 1;
    }

    return stats;
  },
});
