import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateStructured } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/generation-prompts";
import { generateRequestSchema } from "@/lib/validation";
import { getSessionUserId } from "@/lib/dal";

const outputSchema = z.object({
  content: z.string(),
  hashtags: z.array(z.string()),
  cta: z.string(),
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = generateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { businessName, platform, emotion, audienceAge, prompt, style } = parsed.data;

  const system = buildSystemPrompt(platform, emotion, audienceAge, style);
  const userPrompt = `Business: ${businessName}\nGoal: ${prompt}`;

  try {
    const [first, second] = await Promise.all([
      generateStructured({ system, prompt: userPrompt, schema: outputSchema }),
      generateStructured({ system, prompt: userPrompt, schema: outputSchema }),
    ]);

    const results = await Promise.all(
      [first, second].map(async ({ output, model }) => {
        const hashtagsString = output.hashtags
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
          .join(" ");

        const generation = await prisma.contentGeneration.create({
          data: {
            userId,
            businessName,
            platform,
            emotion,
            audienceAge,
            prompt,
            generatedContent: output.content,
            hashtags: hashtagsString,
            style: style?.name ?? null,
          },
        });

        return {
          id: generation.id,
          content: output.content,
          hashtags: output.hashtags,
          cta: output.cta,
          model,
        };
      }),
    );

    return Response.json({ results });
  } catch (error) {
    console.error("Generation failed:", error);
    return Response.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 },
    );
  }
}
