"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// AI Model configurations
const MODELS = {
  llama: "meta-llama/llama-3.1-70b-instruct",
  llamaFast: "meta-llama/llama-3.1-8b-instruct",
};

// Generate faceless video script with AI
export const generateFacelessScript = action({
  args: {
    topic: v.string(),
    platform: v.string(),
    duration: v.optional(v.string()),
    style: v.optional(v.string()),
  },
  returns: v.object({
    title: v.string(),
    hook: v.string(),
    script: v.string(),
    caption: v.string(),
    cta: v.string(),
    hashtags: v.string(),
    visualDirections: v.string(),
    voiceoverStyle: v.string(),
    brollSuggestions: v.array(v.string()),
    avatarType: v.string(),
  }),
  handler: async (ctx, args) => {
    // For demo purposes, return mock data since we don't have API key set up
    // In production, this would call OpenRouter API
    
    const mockScript = generateMockFacelessScript(args.topic, args.platform, args.style);
    return mockScript;
    
    /* 
    // Real implementation would be:
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELS.llama,
        messages: [...],
        temperature: 0.8,
        max_tokens: 2500,
      }),
    });
    
    const data = await response.json();
    return parseFacelessScript(data.choices[0].message.content);
    */
  },
});

// Generate AI image prompt for thumbnails
export const generateThumbnailPrompt = action({
  args: {
    title: v.string(),
    style: v.optional(v.string()),
  },
  returns: v.object({
    prompt: v.string(),
    negativePrompt: v.optional(v.string()),
    style: v.string(),
  }),
  handler: async (ctx, args) => {
    return {
      prompt: `High-contrast thumbnail for "${args.title}" - bold text, eye-catching colors, no faces, viral-style composition, 4K, professional lighting`,
      negativePrompt: "real people, faces, blurry, low quality, text too small",
      style: args.style || "bold-text",
    };
  },
});

// Helper function to generate mock content for demo
function generateMockFacelessScript(topic: string, platform: string, style?: string) {
  const styleText = style || "educational";
  
  return {
    title: `The Truth About ${topic} That Nobody Talks About`,
    hook: `Stop what you're doing. This changes everything about ${topic}...`,
    script: `Let me tell you something that took me years to learn about ${topic}. 

Everyone tells you to focus on the obvious things. But the real secret? It's what happens behind the scenes.

First, you need to understand that ${topic} isn't just about what you see on the surface. There's a whole system that successful people use that they never talk about.

Here's the framework: Start with the foundation. Build consistency. Then scale what works. Most people skip step one and wonder why they fail.

The key insight? ${topic} rewards those who think long-term, not those looking for quick wins. I've seen too many people quit right before the breakthrough.

So here's my challenge to you: Apply this for 30 days. Document your progress. And watch what happens.`,
    caption: `The real talk about ${topic} that most "gurus" won't tell you 👇

Save this for later. Your future self will thank you.

What's your biggest struggle with ${topic}? Let me know in the comments 👇`,
    cta: "Follow for more unfiltered truth bombs about growth",
    hashtags: "#ContentCreator #GrowthMindset #SuccessTips #EntrepreneurLife #FacelessContent",
    visualDirections: `Scene 1: Bold text overlay with topic title on dark background
Scene 2: Stock footage of someone working/productive environment  
Scene 3: Animated graphics showing the framework/steps
Scene 4: Text animations emphasizing key points
Scene 5: Call-to-action screen with follow button animation

Use high-contrast colors (black background with white/neon text). Fast cuts between scenes. No real faces shown.`,
    voiceoverStyle: `Tone: Conversational, confident, slightly mysterious
Pacing: Medium-fast with strategic pauses on key points
Energy: High engagement but not hype-y
Style: Like sharing a secret with a friend
Emphasis: Slight emphasis on "truth," "secret," "behind the scenes"`,
    brollSuggestions: [
      "Person typing on laptop from behind/overhead",
      "Abstract animated graphics showing growth/charts",
      "Time-lapse of city/buildings (represents progress)",
      "Close-ups of coffee, desk setup, creative tools",
      "Dark aesthetic shots with colored lighting",
      "Text animations and motion graphics",
    ],
    avatarType: "Text-overlay only with AI-generated voiceover (no avatar visible)",
  };
}
