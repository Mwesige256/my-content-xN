import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Add item to favorites
export const addFavorite = mutation({
  args: {
    itemType: v.string(), // 'idea' or 'script'
    itemId: v.string(),
    title: v.string(),
    note: v.optional(v.string()),
  },
  returns: v.id("favorites"),
  handler: async (ctx, args) => {
    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Remove item from favorites
export const removeFavorite = mutation({
  args: {
    favoriteId: v.id("favorites"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.favoriteId);
    return null;
  },
});

// Remove favorite by item ID
export const removeFavoriteByItemId = mutation({
  args: {
    itemId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }
    return null;
  },
});

// Get all favorites
export const getFavorites = query({
  args: {
    itemType: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("favorites"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
      itemType: v.string(),
      itemId: v.string(),
      title: v.string(),
      note: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("favorites").order("desc");

    if (args.itemType) {
      // We need to filter by itemType
      const all = await query.take(100);
      return all.filter((f) => f.itemType === args.itemType);
    }

    return await query.take(50);
  },
});

// Check if item is favorited
export const isFavorited = query({
  args: {
    itemId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    return !!favorite;
  },
});

// Get favorite count
export const getFavoriteCount = query({
  args: {},
  returns: v.object({
    total: v.number(),
    ideas: v.number(),
    scripts: v.number(),
  }),
  handler: async (ctx) => {
    const favorites = await ctx.db.query("favorites").collect();

    return {
      total: favorites.length,
      ideas: favorites.filter((f) => f.itemType === "idea").length,
      scripts: favorites.filter((f) => f.itemType === "script").length,
    };
  },
});

// Update favorite note
export const updateNote = mutation({
  args: {
    favoriteId: v.id("favorites"),
    note: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.favoriteId, { note: args.note });
    return null;
  },
});
