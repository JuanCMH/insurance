import { ConvexError, v } from "convex/values";
import { populateMember } from "./roles";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { bondErrors } from "./errors/bonds";

export const update = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    id: v.id("bonds"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError(bondErrors.unauthorized);

    const bond = await ctx.db.get(args.id);
    if (!bond) throw new ConvexError(bondErrors.notFound);

    const member = await populateMember(ctx, userId, bond.workspaceId);
    if (!member) throw new ConvexError(bondErrors.workspaceNotFound);

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("bonds"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError(bondErrors.unauthorized);

    const bond = await ctx.db.get(args.id);
    if (!bond) throw new ConvexError(bondErrors.notFound);

    const member = await populateMember(ctx, userId, bond.workspaceId);
    if (!member) throw new ConvexError(bondErrors.workspaceNotFound);

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError(bondErrors.unauthorized);

    const member = await populateMember(ctx, userId, args.workspaceId);
    if (!member) throw new ConvexError(bondErrors.workspaceNotFound);

    const bondId = await ctx.db.insert("bonds", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
    });

    return bondId;
  },
});

export const getByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const member = await populateMember(ctx, userId, args.workspaceId);
    if (!member) return [];

    const bonds = await ctx.db
      .query("bonds")
      .withIndex("workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return bonds;
  },
});
