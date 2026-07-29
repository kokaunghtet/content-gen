"use client";

import { useState, type FormEvent } from "react";
import {
  PLATFORMS,
  PLATFORM_LABELS,
  EMOTIONS,
  EMOTION_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  type Platform,
  type Emotion,
  type AgeGroup,
  type ContentStyle,
} from "@/lib/generation-prompts";

type GenerationResult = {
  id: string;
  content: string;
  hashtags: string[];
  cta: string;
  model: string;
};

type FormState = {
  businessName: string;
  platform: Platform;
  emotion: Emotion;
  audienceAge: AgeGroup;
  prompt: string;
};

type Props = {
  initialPlatform?: Platform;
  style?: ContentStyle;
};

const defaultForm: FormState = {
  businessName: "",
  platform: "instagram",
  emotion: "joy",
  audienceAge: "millennial",
  prompt: "",
};

export default function GeneratorForm({ initialPlatform, style }: Props) {
  const [form, setForm] = useState<FormState>({
    ...defaultForm,
    platform: initialPlatform ?? defaultForm.platform,
    prompt: style?.examplePrompt ?? defaultForm.prompt,
  });
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function runGeneration(payload: FormState) {
    setLoading(true);
    setError(null);
    setCopied(false);
    setSelected(null);
    try {
      const body = { ...payload };
      if (style) {
        (body as Record<string, unknown>).style = style;
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runGeneration(form);
  }

  function handleRegenerate() {
    if (!loading) runGeneration(form);
  }

  function handleCopy(result: GenerationResult) {
    const fullText = `${result.content}\n\n${result.hashtags.join(" ")}\n\n${result.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleChoose(index: number) {
    setSelected(index);
    setCopied(false);
  }

  const platformLocked = !!initialPlatform;
  const chosen = selected !== null ? results[selected] : null;

  return (
    <div className="flex flex-col gap-8">
      {style && (
        <div className="hashtag self-start">
          Style: {style.name}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="businessName" className="form-label">
            Business name
          </label>
          <input
            id="businessName"
            required
            maxLength={100}
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="form-input"
            placeholder="e.g. Aroma Coffee Roasters"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="platform" className="form-label">
              Platform
            </label>
            <select
              id="platform"
              value={form.platform}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value as Platform })
              }
              disabled={platformLocked}
              className="form-input"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emotion" className="form-label">
              Emotion
            </label>
            <select
              id="emotion"
              value={form.emotion}
              onChange={(e) =>
                setForm({ ...form, emotion: e.target.value as Emotion })
              }
              className="form-input"
            >
              {EMOTIONS.map((em) => (
                <option key={em} value={em}>
                  {EMOTION_LABELS[em]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="audienceAge" className="form-label">
            Target audience
          </label>
          <select
            id="audienceAge"
            value={form.audienceAge}
            onChange={(e) =>
              setForm({ ...form, audienceAge: e.target.value as AgeGroup })
            }
            className="form-input"
          >
            {AGE_GROUPS.map((ag) => (
              <option key={ag} value={ag}>
                {AGE_GROUP_LABELS[ag]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="prompt" className="form-label">
            What&apos;s the post about?
          </label>
          <textarea
            id="prompt"
            required
            maxLength={500}
            rows={3}
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            className="form-input resize-none"
            placeholder="e.g. Announcing our new seasonal pumpkin spice latte, available this week only"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary self-start">
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-error border border-error/20 bg-error-bg px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-medium text-text-secondary">
            Pick a version
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r, i) => {
              const isSelected = selected === i;
              return (
                <div
                  key={r.id}
                  className={`card p-6 flex flex-col gap-4 ${
                    isSelected ? "card-selected" : ""
                  }`}
                >
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Option {i + 1}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {r.content}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {r.hashtags.map((tag) => (
                      <span key={tag} className="hashtag">
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm font-medium">{r.cta}</p>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
                    <button
                      onClick={() => handleChoose(i)}
                      className={isSelected ? "btn-primary text-xs px-4 py-2" : "btn-secondary text-xs px-4 py-2"}
                      type="button"
                    >
                      {isSelected ? "Selected" : "Choose"}
                    </button>
                    <p className="text-xs text-text-muted font-mono">
                      {r.model}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {chosen && (
              <button
                onClick={() => handleCopy(chosen)}
                className="btn-secondary"
                type="button"
              >
                {copied ? "Copied!" : "Copy selected"}
              </button>
            )}
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="btn-secondary"
              type="button"
            >
              {loading ? "Generating…" : "Regenerate"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
