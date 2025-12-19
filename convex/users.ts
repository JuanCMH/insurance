import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userErrors } from "./errors/users";

export const updateImage = mutation({
  args: {
    newImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError(userErrors.unauthorized);

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError(userErrors.notFound);

    const oldImageId = user.mainImage;

    if (oldImageId) ctx.storage.delete(oldImageId);

    await ctx.db.patch(userId, {
      mainImage: args.newImageId,
    });

    return userId;
  },
});

export const updateName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError(userErrors.unauthorized);

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError(userErrors.notFound);

    await ctx.db.patch(userId, {
      name: args.name,
    });

    return userId;
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const { image, ...rest } = user;

    const userImage = user.mainImage
      ? await ctx.storage.getUrl(user.mainImage)
      : null;

    return {
      ...rest,
      userImage: userImage || image,
    };
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;

    const { image, ...rest } = user;

    const userImage = user.mainImage
      ? await ctx.storage.getUrl(user.mainImage)
      : null;

    return {
      ...rest,
      userImage: userImage || image,
    };
  },
});
