import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Content idea templates for AI generation
const ideaTemplates = [
  { type: "Educational", template: "How to {action} in {timeframe} (even if you're {obstacle})" },
  { type: "Educational", template: "The real reason {common_belief} doesn't work anymore" },
  { type: "Educational", template: "3 {topic} mistakes that are costing you {outcome}" },
  { type: "Storytelling", template: "I {action} every day for {timeframe}. Here's what happened" },
  { type: "Storytelling", template: "The moment I realized everything about {topic} was wrong" },
  { type: "Controversial", template: "Unpopular opinion: {topic} is overrated" },
  { type: "Controversial", template: "Why {common_practice} is actually hurting your {goal}" },
  { type: "Tips", template: "Stop doing this if you want to {outcome}" },
  { type: "Tips", template: "The {number}-second rule for {goal}" },
  { type: "Mistakes", template: "The #1 mistake killing your {topic}" },
  { type: "Behind-the-Scenes", template: "How I actually {action} (raw & unfiltered)" },
  { type: "Secrets", template: "What {experts} won't tell you about {topic}" },
  { type: "Motivation", template: "If you're struggling with {problem}, watch this" },
  { type: "Case Studies", template: "How I went from {start} to {end} in {timeframe}" },
];

// Generate 30 content ideas based on brand config
export const generateIdeas = mutation({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    // Get brand config for context
    const config = await ctx.db.query("brandConfig").first();
    const industry = config?.industry ?? "content creation";
    
    // Generate 30 ideas using templates
    const generatedIdeas = [
      { title: `The #1 Mistake Killing Your ${industry} Content (And How to Fix It)`, type: "Mistakes", scores: { virality: 9, curiosity: 10, value: 9, shareability: 9 } },
      { title: `I Posted Every Day for 365 Days. Here's What Happened`, type: "Storytelling", scores: { virality: 10, curiosity: 9, value: 8, shareability: 9 } },
      { title: `Why "Post Consistently" Is Terrible Advice`, type: "Controversial", scores: { virality: 9, curiosity: 9, value: 8, shareability: 9 } },
      { title: `The Secret Algorithm Hack Nobody Talks About`, type: "Secrets", scores: { virality: 9, curiosity: 10, value: 7, shareability: 9 } },
      { title: `3 Content Formats That Actually Work in 2024`, type: "Educational", scores: { virality: 7, curiosity: 8, value: 10, shareability: 8 } },
      { title: `Behind the Scenes: How I Plan 30 Videos in 2 Hours`, type: "Behind-the-Scenes", scores: { virality: 7, curiosity: 9, value: 9, shareability: 7 } },
      { title: `The Myth of "Going Viral"`, type: "Myths", scores: { virality: 8, curiosity: 8, value: 8, shareability: 8 } },
      { title: `Case Study: 0 to 100K in 90 Days`, type: "Case Studies", scores: { virality: 8, curiosity: 8, value: 9, shareability: 7 } },
      { title: `Stop Doing This If You Want to Grow`, type: "Tips", scores: { virality: 7, curiosity: 8, value: 9, shareability: 7 } },
      { title: `The Real Reason Your Content Isn't Performing`, type: "Educational", scores: { virality: 7, curiosity: 8, value: 8, shareability: 7 } },
      { title: `I Spent $10K on ${industry} Courses. Here's What I Learned`, type: "Case Studies", scores: { virality: 8, curiosity: 9, value: 9, shareability: 7 } },
      { title: `The Truth About ${industry} That No One Wants to Admit`, type: "Controversial", scores: { virality: 9, curiosity: 9, value: 8, shareability: 8 } },
      { title: `How to Create 30 Days of Content in 3 Hours`, type: "Educational", scores: { virality: 8, curiosity: 9, value: 10, shareability: 8 } },
      { title: `My Exact Process for Viral Content`, type: "Behind-the-Scenes", scores: { virality: 9, curiosity: 9, value: 8, shareability: 8 } },
      { title: `Why Your ${industry} Strategy Is Backwards`, type: "Controversial", scores: { virality: 8, curiosity: 8, value: 8, shareability: 8 } },
      { title: `The 5-Minute ${industry} Hack That Changed Everything`, type: "Tips", scores: { virality: 8, curiosity: 9, value: 9, shareability: 8 } },
      { title: `What I Wish I Knew Before Starting`, type: "Educational", scores: { virality: 7, curiosity: 8, value: 9, shareability: 7 } },
      { title: `This ${industry} Myth Is Keeping You Stuck`, type: "Myths", scores: { virality: 8, curiosity: 8, value: 8, shareability: 8 } },
      { title: `Day in the Life: Full-Time Creator`, type: "Behind-the-Scenes", scores: { virality: 7, curiosity: 8, value: 7, shareability: 7 } },
      { title: `Why I Stopped Posting Every Day`, type: "Controversial", scores: { virality: 8, curiosity: 8, value: 8, shareability: 8 } },
      { title: `The ${industry} Framework That 10X'd My Growth`, type: "Educational", scores: { virality: 8, curiosity: 9, value: 9, shareability: 7 } },
      { title: `Your First 1000 Followers: The Real Strategy`, type: "Educational", scores: { virality: 8, curiosity: 8, value: 9, shareability: 7 } },
      { title: `Unpopular Opinion: Quality Over Quantity`, type: "Controversial", scores: { virality: 7, curiosity: 8, value: 8, shareability: 8 } },
      { title: `The Hidden Cost of Chasing Virality`, type: "Educational", scores: { virality: 7, curiosity: 8, value: 9, shareability: 7 } },
      { title: `What 100 Failed Posts Taught Me`, type: "Storytelling", scores: { virality: 8, curiosity: 9, value: 9, shareability: 7 } },
      { title: `Stop Copying Big Creators (Do This Instead)`, type: "Tips", scores: { virality: 8, curiosity: 8, value: 9, shareability: 8 } },
      { title: `The ${industry} Secrets They Don't Want You to Know`, type: "Secrets", scores: { virality: 9, curiosity: 10, value: 7, shareability: 9 } },
      { title: `How to Stand Out When Everyone Is Doing the Same Thing`, type: "Educational", scores: { virality: 7, curiosity: 8, value: 9, shareability: 7 } },
      { title: `The Mindset Shift That Made Me Successful`, type: "Motivation", scores: { virality: 7, curiosity: 7, value: 9, shareability: 7 } },
      { title: `Ranking Every ${industry} Strategy I've Tried`, type: "Case Studies", scores: { virality: 8, curiosity: 9, value: 9, shareability: 7 } },
    ];

    const ideaIds: string[] = [];
    
    for (const idea of generatedIdeas) {
      const totalScore = Math.round((idea.scores.virality + idea.scores.curiosity + idea.scores.value + idea.scores.shareability) / 4 * 10) / 10;
      
      const id = await ctx.db.insert("contentIdeas", {
        title: idea.title,
        type: idea.type,
        scores: idea.scores,
        totalScore,
        status: "new",
        createdAt: Date.now(),
      });
      
      ideaIds.push(id);
    }

    return ideaIds;
  },
});

// Get all content ideas sorted by score
export const getIdeas = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("contentIdeas"),
      _creationTime: v.number(),
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
      status: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const ideas = await ctx.db
      .query("contentIdeas")
      .order("desc")
      .take(args.limit ?? 30);
    
    return ideas.sort((a, b) => b.totalScore - a.totalScore);
  },
});

// Update idea status
export const updateStatus = mutation({
  args: {
    ideaId: v.id("contentIdeas"),
    status: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ideaId, { status: args.status });
    return null;
  },
});

// Clear all ideas (for regeneration)
export const clearIdeas = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const ideas = await ctx.db.query("contentIdeas").collect();
    for (const idea of ideas) {
      await ctx.db.delete(idea._id);
    }
    return null;
  },
});
