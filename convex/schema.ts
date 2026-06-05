import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Brand configuration table
  brandConfig: defineTable({
    userId: v.optional(v.string()),
    brandName: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    mission: v.string(),
    tones: v.array(v.string()),
    platforms: v.array(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Content ideas table
  contentIdeas: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    type: v.string(),
    scores: v.object({
      virality: v.number(),
      curiosity: v.number(),
      value: v.number(),
      shareability: v.number(),
    }),
    totalScore: v.number(),
    status: v.optional(v.string()), // 'new', 'script_generated', 'scheduled', 'posted'
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_score", ["userId", "totalScore"]),

  // Scripts table
  scripts: defineTable({
    userId: v.optional(v.string()),
    ideaId: v.optional(v.id("contentIdeas")),
    title: v.string(),
    hook: v.string(),
    script: v.string(),
    caption: v.string(),
    cta: v.string(),
    hashtags: v.string(),
    videoPrompt: v.optional(v.string()),
    imagePrompt: v.optional(v.string()),
    voiceover: v.optional(v.string()),
    broll: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
    platformVersions: v.optional(v.record(v.string(), v.object({
      duration: v.string(),
      adaptedHook: v.string(),
      adaptedScript: v.string(),
    }))),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_idea", ["ideaId"]),

  // Posting schedule table
  scheduledPosts: defineTable({
    userId: v.optional(v.string()),
    scriptId: v.id("scripts"),
    platform: v.string(),
    scheduledDate: v.number(), // timestamp
    scheduledTime: v.string(), // e.g., "08:00"
    status: v.string(), // 'scheduled', 'posted', 'draft'
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "scheduledDate"]),

  // Analytics data table
  analytics: defineTable({
    userId: v.optional(v.string()),
    postId: v.optional(v.id("scheduledPosts")),
    platform: v.string(),
    views: v.optional(v.number()),
    watchTime: v.optional(v.number()), // in seconds
    ctr: v.optional(v.number()), // click-through rate %
    engagement: v.optional(v.number()), // engagement rate %
    shares: v.optional(v.number()),
    saves: v.optional(v.number()),
    comments: v.optional(v.number()),
    recordedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"]),

  // Favorites/Saved items
  favorites: defineTable({
    userId: v.optional(v.string()),
    itemType: v.string(), // 'idea' or 'script'
    itemId: v.string(), // ideaId or scriptId
    title: v.string(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "itemType"]),

  // AI Generated Content Cache
  aiGeneratedContent: defineTable({
    userId: v.optional(v.string()),
    promptType: v.string(), // 'script', 'hook', 'caption', 'image_prompt', 'voiceover'
    prompt: v.string(),
    result: v.string(),
    model: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "promptType"]),
});
