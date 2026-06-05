import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Record analytics for a post
export const recordAnalytics = mutation({
  args: {
    postId: v.id("scheduledPosts"),
    platform: v.string(),
    views: v.optional(v.number()),
    watchTime: v.optional(v.number()),
    ctr: v.optional(v.number()),
    engagement: v.optional(v.number()),
    shares: v.optional(v.number()),
    saves: v.optional(v.number()),
    comments: v.optional(v.number()),
  },
  returns: v.id("analytics"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      ...args,
      recordedAt: Date.now(),
    });
  },
});

// Get analytics summary
export const getAnalyticsSummary = query({
  args: {},
  returns: v.object({
    totalViews: v.number(),
    avgWatchTime: v.number(),
    avgCtr: v.number(),
    avgEngagement: v.number(),
    totalShares: v.number(),
    totalSaves: v.number(),
    totalComments: v.number(),
    byPlatform: v.record(v.string(), v.object({
      views: v.number(),
      engagement: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const analytics = await ctx.db.query("analytics").collect();
    
    if (analytics.length === 0) {
      return {
        totalViews: 0,
        avgWatchTime: 0,
        avgCtr: 0,
        avgEngagement: 0,
        totalShares: 0,
        totalSaves: 0,
        totalComments: 0,
        byPlatform: {},
      };
    }

    const totalViews = analytics.reduce((sum, a) => sum + (a.views ?? 0), 0);
    const avgWatchTime = analytics.reduce((sum, a) => sum + (a.watchTime ?? 0), 0) / analytics.length;
    const avgCtr = analytics.reduce((sum, a) => sum + (a.ctr ?? 0), 0) / analytics.length;
    const avgEngagement = analytics.reduce((sum, a) => sum + (a.engagement ?? 0), 0) / analytics.length;
    const totalShares = analytics.reduce((sum, a) => sum + (a.shares ?? 0), 0);
    const totalSaves = analytics.reduce((sum, a) => sum + (a.saves ?? 0), 0);
    const totalComments = analytics.reduce((sum, a) => sum + (a.comments ?? 0), 0);

    const byPlatform: Record<string, { views: number; engagement: number }> = {};
    for (const a of analytics) {
      if (!byPlatform[a.platform]) {
        byPlatform[a.platform] = { views: 0, engagement: 0 };
      }
      byPlatform[a.platform].views += a.views ?? 0;
      byPlatform[a.platform].engagement += a.engagement ?? 0;
    }

    return {
      totalViews,
      avgWatchTime: Math.round(avgWatchTime),
      avgCtr: Math.round(avgCtr * 10) / 10,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      totalShares,
      totalSaves,
      totalComments,
      byPlatform,
    };
  },
});

// Get top performing content
export const getTopPerforming = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      postId: v.optional(v.id("scheduledPosts")),
      title: v.string(),
      platform: v.string(),
      views: v.number(),
      watchTime: v.number(),
      engagement: v.number(),
      saves: v.number(),
      shares: v.number(),
      why: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const analytics = await ctx.db.query("analytics").order("desc").take(args.limit ?? 10);
    
    const results = [];
    
    for (const a of analytics) {
      if (!a.postId) continue;
      
      const post = await ctx.db.get(a.postId);
      if (!post) continue;
      
      const script = await ctx.db.get(post.scriptId);
      if (!script) continue;

      let why = "Strong performance";
      if ((a.engagement ?? 0) > 10) why = "High engagement rate";
      if ((a.saves ?? 0) > 1000) why = "High save rate = valuable content";
      if ((a.shares ?? 0) > 500) why = "Highly shareable";
      if ((a.watchTime ?? 0) > 45) why = "Great retention";

      results.push({
        postId: a.postId,
        title: script.title,
        platform: a.platform,
        views: a.views ?? 0,
        watchTime: a.watchTime ?? 0,
        engagement: a.engagement ?? 0,
        saves: a.saves ?? 0,
        shares: a.shares ?? 0,
        why,
      });
    }

    return results.sort((a, b) => b.views - a.views);
  },
});

// Generate recommendations based on analytics
export const getRecommendations = query({
  args: {},
  returns: v.object({
    doubleDown: v.array(v.string()),
    stopDoing: v.array(v.string()),
    opportunities: v.array(v.string()),
  }),
  handler: async (ctx) => {
    const analytics = await ctx.db.query("analytics").collect();
    
    if (analytics.length < 5) {
      return {
        doubleDown: [
          "Create content that answers specific questions",
          "Use strong hooks in the first 3 seconds",
          "Post consistently to build momentum",
        ],
        stopDoing: [
          "Generic content without clear value",
          "Posting without understanding your audience",
          "Copying trends without adding your twist",
        ],
        opportunities: [
          "Experiment with different content formats",
          "Build a content series for consistency",
          "Engage with comments within first hour",
        ],
      };
    }

    // Analyze patterns
    const highEngagement = analytics.filter((a) => (a.engagement ?? 0) > 10);
    const highSaves = analytics.filter((a) => (a.saves ?? 0) > 100);
    const lowCtr = analytics.filter((a) => (a.ctr ?? 0) < 5);

    const doubleDown: string[] = [];
    const stopDoing: string[] = [];
    const opportunities: string[] = [];

    if (highEngagement.length > analytics.length * 0.3) {
      doubleDown.push("Controversial takes backed by data");
    }
    if (highSaves.length > analytics.length * 0.2) {
      doubleDown.push("Educational content with frameworks");
    }
    if (lowCtr.length > analytics.length * 0.3) {
      stopDoing.push("Weak hooks that don't stop the scroll");
    }

    doubleDown.push(
      "Behind-the-scenes process content",
      "Storytelling with personal experiences"
    );

    stopDoing.push(
      "Long intros before getting to the point",
      "Generic motivational quotes without context"
    );

    opportunities.push(
      "Create save-worthy resource content",
      "Test video formats with text overlays",
      "Build a recognizable content series",
      "Collaborate with creators in your niche"
    );

    return { doubleDown, stopDoing, opportunities };
  },
});
