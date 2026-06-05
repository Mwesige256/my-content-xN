import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Generate script from an idea
export const generateScript = mutation({
  args: {
    ideaId: v.id("contentIdeas"),
  },
  returns: v.union(v.id("scripts"), v.null()),
  handler: async (ctx, args) => {
    const idea = await ctx.db.get(args.ideaId);
    if (!idea) return null;

    const config = await ctx.db.query("brandConfig").first();
    const industry = config?.industry ?? "content creation";

    // Generate script based on idea title and type
    const scriptData = generateScriptFromIdea(idea.title, idea.type, industry);

    const scriptId = await ctx.db.insert("scripts", {
      ideaId: args.ideaId,
      title: idea.title,
      ...scriptData,
      platformVersions: {
        tiktok: {
          duration: "15-60 sec",
          adaptedHook: scriptData.hook,
          adaptedScript: scriptData.script.slice(0, 200),
        },
        youtube: {
          duration: "30-60 sec",
          adaptedHook: scriptData.hook,
          adaptedScript: scriptData.script,
        },
        instagram: {
          duration: "Engaging",
          adaptedHook: scriptData.hook + " ✨",
          adaptedScript: scriptData.script,
        },
        linkedin: {
          duration: "Professional",
          adaptedHook: `Insight: ${scriptData.hook}`,
          adaptedScript: scriptData.script + "\n\nWhat's your experience with this?",
        },
        x: {
          duration: "Thread",
          adaptedHook: scriptData.hook,
          adaptedScript: `1/ ${scriptData.script.slice(0, 280)}\n\n2/ Here's the deeper insight...`,
        },
      },
      createdAt: Date.now(),
    });

    // Update idea status
    await ctx.db.patch(args.ideaId, { status: "script_generated" });

    return scriptId;
  },
});

// Get all scripts
export const getScripts = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("scripts"),
      _creationTime: v.number(),
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
  ),
  handler: async (ctx) => {
    return await ctx.db.query("scripts").order("desc").take(50);
  },
});

// Get script by ID
export const getScriptById = query({
  args: { scriptId: v.id("scripts") },
  returns: v.union(
    v.object({
      _id: v.id("scripts"),
      _creationTime: v.number(),
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scriptId);
  },
});

// Get script by idea ID
export const getScriptByIdea = query({
  args: { ideaId: v.id("contentIdeas") },
  returns: v.union(
    v.object({
      _id: v.id("scripts"),
      _creationTime: v.number(),
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scripts")
      .withIndex("by_idea", (q) => q.eq("ideaId", args.ideaId))
      .first();
  },
});

// Helper function to generate script content
function generateScriptFromIdea(title: string, type: string, industry: string) {
  const hooks: Record<string, string[]> = {
    Mistakes: [
      "The #1 mistake killing your content isn't what you think...",
      "Stop doing this immediately if you want to grow...",
      "This one mistake is costing you thousands of views...",
    ],
    Storytelling: [
      "I can't believe I'm sharing this...",
      "This changed everything for me...",
      "Let me tell you what happened...",
    ],
    Controversial: [
      "Unpopular opinion: everything you've been told is wrong...",
      "I'm about to get cancelled for saying this...",
      "The advice you keep hearing is terrible...",
    ],
    Educational: [
      "Here's what nobody tells you about...",
      "The truth about going viral...",
      "Let me save you 6 months of trial and error...",
    ],
    Tips: [
      "Try this instead...",
      "Here's a hack that actually works...",
      "The 30-second fix you need...",
    ],
    Secrets: [
      "What the top 1% won't tell you...",
      "The algorithm hack they don't want you to know...",
      "Insider secrets revealed...",
    ],
    default: [
      "This is going to change how you think about content...",
      "Pay attention to this...",
      "Let me show you something...",
    ],
  };

  const bodies: Record<string, string[]> = {
    Mistakes: [
      `Everyone thinks the algorithm is the problem. It's not. The real issue? You're creating content for yourself, not your audience.\n\nHere's the fix: Before you post, ask "What transformation does this create for my viewer?" If you can't answer in 10 seconds, don't post it.`,
      `You've been taught to focus on metrics. Views. Likes. Followers.\n\nBut here's what actually matters: connection. One person who truly resonates with your message is worth more than 10,000 passive scrollers.`,
    ],
    default: [
      `The landscape has changed. What worked last year won't work today.\n\nThe creators winning right now understand one thing: value first, always. Not value in exchange for attention. Value with no strings attached.\n\nThat's the difference.`,
    ],
  };

  const ctas: Record<string, string[]> = {
    Mistakes: [
      "Drop a 🔥 if you're ready to create for your audience, not yourself.",
      "Comment 'FIX' and I'll send you my content audit checklist.",
    ],
    default: [
      "Follow for more unfiltered creator truth.",
      "Save this for your next content planning session.",
      "Share this with someone who needs to hear it.",
    ],
  };

  const randomHook = (hooks[type] ?? hooks.default)[Math.floor(Math.random() * (hooks[type]?.length ?? hooks.default.length))];
  const randomBody = (bodies[type] ?? bodies.default)[Math.floor(Math.random() * (bodies[type]?.length ?? bodies.default.length))];
  const randomCta = (ctas[type] ?? ctas.default)[Math.floor(Math.random() * (ctas[type]?.length ?? ctas.default.length))];

  return {
    hook: randomHook,
    script: randomBody,
    caption: `Stop making this mistake. 🛑\n\n${randomBody.slice(0, 150)}...\n\nThe full breakdown is worth your time.`,
    cta: randomCta,
    hashtags: "#ContentStrategy #CreatorTips #SocialMediaMarketing #ContentCreation #GrowYourAudience",
    videoPrompt: `Close-up shot of confident creator looking directly at camera, warm studio lighting, modern minimalist background with subtle ${industry} elements, cinematic 4K quality, shallow depth of field, professional color grading`,
    imagePrompt: `Dramatic split-screen composition: left side showing frustrated creator with dim lighting and chaotic background, right side showing same creator confident and successful with bright lighting and organized workspace, high contrast, modern aesthetic`,
    voiceover: randomHook + " " + randomBody.slice(0, 200),
    broll: [
      "Creator at desk working",
      "Phone screen showing analytics",
      "Whiteboard with content strategy",
      "Creator speaking to camera",
      "Success/achievement moment",
    ],
    thumbnail: title.slice(0, 40).toUpperCase(),
  };
}
