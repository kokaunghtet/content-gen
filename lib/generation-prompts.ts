export const PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export const EMOTIONS = [
  "joy",
  "trust",
  "anticipation",
  "surprise",
  "sadness",
  "fear",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export const EMOTION_LABELS: Record<Emotion, string> = {
  joy: "Joy",
  trust: "Trust",
  anticipation: "Anticipation",
  surprise: "Surprise",
  sadness: "Sadness",
  fear: "Fear",
};

export const AGE_GROUPS = ["gen_z", "millennial", "gen_x", "boomer"] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  gen_z: "Gen Z (13-28)",
  millennial: "Millennial (29-44)",
  gen_x: "Gen X (45-60)",
  boomer: "Boomer (61+)",
};

export const PLATFORM_FIRST_OPTIONS: Platform[] = ["facebook", "tiktok"];

export type ContentStyle = {
  name: string;
  description: string;
  hook: string;
  examplePrompt: string;
};

const PLATFORM_GUIDELINES: Record<Platform, string> = {
  facebook:
    "Facebook post: 1-3 short paragraphs, conversational tone, up to 2-3 relevant hashtags, end with a clear call to action inviting comments or shares.",
  instagram:
    "Instagram caption: punchy opening line, emoji-friendly, 5-10 relevant hashtags, end with a call to action driving likes/saves/follows.",
  tiktok:
    "TikTok caption: short, energetic, trend-aware, 3-6 hashtags including at least one broad/trending one, end with a call to action to watch/engage/follow.",
};

const AGE_GROUP_GUIDELINES: Record<AgeGroup, string> = {
  gen_z:
    "Target audience is Gen Z (ages 13-28). Use casual, meme-aware language. Short sentences, trending slang, visual-first storytelling. Avoid corporate jargon.",
  millennial:
    "Target audience is Millennials (ages 29-44). Use relatable, conversational language. Balance humor with value. Reference shared life experiences (career, parenting, side hustles).",
  gen_x:
    "Target audience is Gen X (ages 45-60). Use straightforward, no-nonsense language. Emphasize value, reliability, and independence. Avoid excessive emojis or slang.",
  boomer:
    "Target audience is Boomers (ages 61+). Use warm, respectful language. Be clear and direct. Emphasize trust, quality, and personal connection. Avoid overly casual slang. Do not exceed over 100 characters.",
};

export function buildSystemPrompt(
  platform: Platform,
  emotion: Emotion,
  audienceAge: AgeGroup,
  style?: ContentStyle,
): string {
  const parts = [
    "You are a social media copywriter generating two distinct post variations for a small business.",
    PLATFORM_GUIDELINES[platform],
    `Write with a ${emotion} emotional tone.`,
    AGE_GROUP_GUIDELINES[audienceAge],
    "The two variations must differ in structure, wording, or angle — do not produce near-duplicates.",
  ];

  if (style) {
    parts.push(
      `Use this trending content angle: "${style.name}" — ${style.description}. The hook should be: ${style.hook}.`,
    );
  }

  parts.push(
    "Return content, hashtags, and a call to action as separate structured fields — do not repeat the call to action inside the content field.",
  );

  return parts.join(" ");
}

export function buildStyleSuggestionPrompt(platform: Platform): string {
  return [
    `You are a social media strategist specializing in ${PLATFORM_LABELS[platform]} content trends.`,
    `Based on ${PLATFORM_GUIDELINES[platform]}`,
    "Suggest exactly 3 trending content styles that are currently performing well on this platform.",
    "Each style should have a short catchy name, a brief description of the format/angle, a sample hook (opening line), and an examplePrompt — a short, generic 'what's the post about' prompt (like a user would type into a prompt box) that would trigger this style's hook, written as a topic/scenario a small business could adapt, not tied to any specific business.",
    "Styles should be diverse and represent different content approaches (e.g. educational, emotional, viral format).",
    "Return exactly 3 styles as an array.",
  ].join(" ");
}
