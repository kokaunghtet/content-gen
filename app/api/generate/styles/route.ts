import { z } from "zod";
import { generateStructured } from "@/lib/ai";
import { buildStyleSuggestionPrompt } from "@/lib/generation-prompts";
import { styleRequestSchema } from "@/lib/validation";
import { getSessionUserId } from "@/lib/dal";

const styleSchema = z.object({
  styles: z
    .object({
      name: z.string(),
      description: z.string(),
      hook: z.string(),
      examplePrompt: z.string(),
    })
    .array()
    .length(3),
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = styleRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { platform } = parsed.data;
  const system = buildStyleSuggestionPrompt(platform);

  try {
    const { output, model } = await generateStructured({
      system,
      prompt: "Suggest 3 trending content styles for this platform.",
      schema: styleSchema,
    });

    return Response.json({ styles: output.styles, model });
  } catch (error) {
    console.error("Style suggestion failed:", error);
    return Response.json(
      { error: "Failed to generate style suggestions. Please try again." },
      { status: 500 },
    );
  }
}
