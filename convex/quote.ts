import quoteAgent from "./agents";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const getQuoteFromDoc = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const { threadId, thread } = await quoteAgent.createThread(ctx);
    const result = await thread.generateText({ prompt: args.prompt });

    return result.text;
  },
});
