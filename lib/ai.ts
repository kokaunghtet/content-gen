import { groq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import type { ZodType } from "zod";

const OPENROUTER_PRIMARY_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_FALLBACK_MODEL = "deepseek/deepseek-v4-flash";
const GROQ_PRIMARY_MODEL = "openai/gpt-oss-120b";
const GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateStructured<T>(params: {
  system: string;
  prompt: string;
  schema: ZodType<T>;
}): Promise<{ output: T; model: string }> {
  const { system, prompt: userPrompt, schema } = params;

  try {
    const { output } = await generateText({
      model: openrouter(OPENROUTER_PRIMARY_MODEL),
      system,
      prompt: userPrompt,
      output: Output.object({ schema }),
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(30000),
    });
    return { output, model: OPENROUTER_PRIMARY_MODEL };
  } catch (primaryError) {
    console.error("OpenRouter primary failed, trying fallback:", primaryError);
  }

  try {
    const { output } = await generateText({
      model: openrouter(OPENROUTER_FALLBACK_MODEL),
      system,
      prompt: userPrompt,
      output: Output.object({ schema }),
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(30000),
    });
    return { output, model: OPENROUTER_FALLBACK_MODEL };
  } catch (fallbackError) {
    console.error("OpenRouter fallback failed, trying Groq:", fallbackError);
  }

  try {
    const { output } = await generateText({
      model: groq(GROQ_PRIMARY_MODEL),
      system,
      prompt: userPrompt,
      output: Output.object({ schema }),
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(30000),
    });
    return { output, model: `groq/${GROQ_PRIMARY_MODEL}` };
  } catch (groqError) {
    console.error("Groq primary failed, trying fallback:", groqError);
  }

  const { output } = await generateText({
    model: groq(GROQ_FALLBACK_MODEL),
    system,
    prompt: userPrompt,
    output: Output.object({ schema }),
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(30000),
  });
  return { output, model: `groq/${GROQ_FALLBACK_MODEL}` };
}
