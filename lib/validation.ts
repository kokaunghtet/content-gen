import { z } from "zod";
import { PLATFORM_FIRST_OPTIONS } from "@/lib/generation-prompts";

export const generateRequestSchema = z.object({
  businessName: z.string().min(1).max(100),
  platform: z.enum(["facebook", "instagram", "tiktok"]),
  emotion: z.enum(["joy", "trust", "anticipation", "surprise", "sadness", "fear"]),
  audienceAge: z.enum(["gen_z", "millennial", "gen_x", "boomer"]),
  prompt: z.string().min(1).max(500),
  style: z
    .object({
      name: z.string(),
      description: z.string(),
      hook: z.string(),
      examplePrompt: z.string(),
    })
    .optional(),
});

export const styleRequestSchema = z.object({
  platform: z.enum(PLATFORM_FIRST_OPTIONS),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
