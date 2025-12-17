import { v } from "convex/values";
import quoteAgent from "./agents";
import { populateMember } from "./roles";
import { action } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getQuoteFromDoc = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const { thread } = await quoteAgent.createThread(ctx);
    const result = await thread.generateText({ prompt: args.prompt });

    return result.text;
  },
});

export const update = mutation({
  args: {
    contractor: v.string(),
    contractorId: v.string(),
    contractee: v.string(),
    contracteeId: v.string(),
    contractType: v.string(),
    contractValue: v.number(),
    contractStart: v.number(),
    contractEnd: v.number(),
    expenses: v.number(),
    calculateExpensesTaxes: v.boolean(),
    quoteType: v.union(v.literal("bidBond"), v.literal("performanceBonds")),
    quoteBonds: v.array(
      v.object({
        name: v.string(),
        startDate: v.number(),
        endDate: v.number(),
        percentage: v.number(),
        insuredValue: v.number(),
        rate: v.number(),
        bondId: v.optional(v.id("bonds")),
      }),
    ),
    id: v.id("quotes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const quote = await ctx.db.get(args.id);
    if (!quote) return null;

    const member = await populateMember(ctx, userId, quote.workspaceId);
    if (!member) return null;

    await ctx.db.patch(args.id, {
      contractor: args.contractor,
      contractorId: args.contractorId,
      contractee: args.contractee,
      contracteeId: args.contracteeId,
      contractType: args.contractType,
      contractValue: args.contractValue,
      contractStart: args.contractStart,
      contractEnd: args.contractEnd,
      expenses: args.expenses,
      calculateExpensesTaxes: args.calculateExpensesTaxes,
      quoteType: args.quoteType,
    });

    const existingQuoteBonds = await ctx.db
      .query("quoteBonds")
      .withIndex("quoteId", (q) => q.eq("quoteId", args.id))
      .collect();

    for (const eqb of existingQuoteBonds) {
      await ctx.db.delete(eqb._id);
    }

    for (const qb of args.quoteBonds) {
      await ctx.db.insert("quoteBonds", {
        name: qb.name,
        startDate: qb.startDate,
        endDate: qb.endDate,
        percentage: qb.percentage,
        insuredValue: qb.insuredValue,
        rate: qb.rate,
        workspaceId: quote.workspaceId,
        quoteId: args.id,
        bondId: qb.bondId,
      });
    }

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("quotes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const quote = await ctx.db.get(args.id);
    if (!quote) return null;

    const quoteBonds = await await ctx.db
      .query("quoteBonds")
      .withIndex("quoteId", (q) => q.eq("quoteId", args.id))
      .collect();

    const member = await populateMember(ctx, userId, quote.workspaceId);
    if (!member) return null;

    for (const quoteBond of quoteBonds) {
      await ctx.db.delete(quoteBond._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const create = mutation({
  args: {
    contractor: v.string(),
    contractorId: v.string(),
    contractee: v.string(),
    contracteeId: v.string(),
    contractType: v.string(),
    contractValue: v.number(),
    contractStart: v.number(),
    contractEnd: v.number(),
    expenses: v.number(),
    calculateExpensesTaxes: v.boolean(),
    quoteType: v.union(v.literal("bidBond"), v.literal("performanceBonds")),
    quoteBonds: v.array(
      v.object({
        name: v.string(),
        startDate: v.number(),
        endDate: v.number(),
        percentage: v.number(),
        insuredValue: v.number(),
        rate: v.number(),
        bondId: v.optional(v.id("bonds")),
      }),
    ),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return null;

    const member = await populateMember(ctx, userId, args.workspaceId);
    if (!member) return null;

    const quoteId = await ctx.db.insert("quotes", {
      contractor: args.contractor,
      contractorId: args.contractorId,
      contractee: args.contractee,
      contracteeId: args.contracteeId,
      contractType: args.contractType,
      contractValue: args.contractValue,
      contractStart: args.contractStart,
      contractEnd: args.contractEnd,
      expenses: args.expenses,
      calculateExpensesTaxes: args.calculateExpensesTaxes,
      quoteType: args.quoteType,
      workspaceId: args.workspaceId,
    });

    for (const qb of args.quoteBonds) {
      await ctx.db.insert("quoteBonds", {
        name: qb.name,
        startDate: qb.startDate,
        endDate: qb.endDate,
        percentage: qb.percentage,
        insuredValue: qb.insuredValue,
        rate: qb.rate,
        workspaceId: args.workspaceId,
        quoteId: quoteId,
        bondId: qb.bondId,
      });
    }

    return quoteId;
  },
});

export const getByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
    month: v.string(), // "yyyy-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const member = await populateMember(ctx, userId, args.workspaceId);
    if (!member) return [];

    const [year, month] = args.month.split("-").map(Number);

    const monthStart = Date.UTC(year, month - 1, 1);
    const monthEnd = Date.UTC(year, month, 1);

    const quotes = await ctx.db
      .query("quotes")
      .withIndex("workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) =>
        q.and(
          q.gte(q.field("_creationTime"), monthStart),
          q.lt(q.field("_creationTime"), monthEnd),
        ),
      )
      .collect();

    return quotes;
  },
});

export const getById = query({
  args: {
    id: v.id("quotes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const quote = await ctx.db.get(args.id);
    if (!quote) return null;

    const quoteBonds = await ctx.db
      .query("quoteBonds")
      .withIndex("quoteId", (q) => q.eq("quoteId", args.id))
      .collect();

    const member = await populateMember(ctx, userId, quote.workspaceId);
    if (!member) return null;

    return { ...quote, quoteBonds };
  },
});
