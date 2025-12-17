import { encodingForModel } from "js-tiktoken";

export const MAX_TOKENS = 30000;

/**
 * Calculates the number of tokens in a text string using js-tiktoken.
 * Uses 'gpt-4o' encoding (cl100k_base) as a standard reference.
 */
export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  try {
    const enc = encodingForModel("gpt-4o");
    return enc.encode(text).length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback to rough estimation if tokenizer fails
    return Math.ceil(text.length / 4);
  }
};
