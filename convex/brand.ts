import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get brand configuration for current user
export const getConfig = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("brandConfig"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
      brandName: v.string(),
      industry: v.string(),
      targetAudience: v.string(),
      mission: v.string(),
      tones: v.array(v.string()),
      platforms: v.array(v.string()),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    // For now, return the first config (anonymous mode)
    const config = await ctx.db.query("brandConfig").first();
    return config ?? null;
  },
});

// Save or update brand configuration
export const saveConfig = mutation({
  args: {
    brandName: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    mission: v.string(),
    tones: v.array(v.string()),
    platforms: v.array(v.string()),
  },
  returns: v.id("brandConfig"),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("brandConfig").first();
    
    const configData = {
      ...args,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, configData);
      return existing._id;
    } else {
      return await ctx.db.insert("brandConfig", configData);
    }
  },
});
