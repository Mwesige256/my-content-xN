import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Save AI generated content
export const saveAIGeneration = mutation({
  args: {
    promptType: v.string(),
    prompt: v.string(),
    result: v.string(),
    model: v.string(),
  },
  returns: v.id("aiGeneratedContent"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiGeneratedContent", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get AI generation history
export const getAIGenerationHistory = query({
  args: {
    promptType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("aiGeneratedContent"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
      promptType: v.string(),
      prompt: v.string(),
      result: v.string(),
      model: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("aiGeneratedContent").order("desc");
    
    if (args.promptType) {
      const all = await query.take(args.limit || 50);
      return all.filter(item => item.promptType === args.promptType);
    }
    
    return await query.take(args.limit || 50);
  },
});
