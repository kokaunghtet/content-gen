"use client";

import { useState, useEffect } from "react";
import {
  PLATFORM_LABELS,
  type Platform,
  type ContentStyle,
} from "@/lib/generation-prompts";

type Props = {
  platform: Platform;
  onSelectStyle: (style: ContentStyle) => void;
  onSkip: () => void;
};

export default function StyleSuggestions({
  platform,
  onSelectStyle,
  onSkip,
}: Props) {
  const [styles, setStyles] = useState<ContentStyle[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const res = await fetch("/api/generate/styles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load styles.");
        }
        setStyles(data.styles);
        setModel(data.model);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load styles.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStyles();
  }, [platform]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-text-secondary">
        Trending styles for {PLATFORM_LABELS[platform]}
      </p>

      {loading && (
        <div className="card p-6 text-sm text-text-secondary">
          Finding trending styles…
        </div>
      )}

      {error && (
        <p className="text-sm text-error border border-error/20 bg-error-bg px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {styles.map((style) => (
            <button
              key={style.name}
              onClick={() => onSelectStyle(style)}
              className="card p-5 text-left hover:border-border-hover transition-colors cursor-pointer"
            >
              <p className="font-medium">{style.name}</p>
              <p className="text-sm text-text-secondary mt-1">
                {style.description}
              </p>
              <p className="text-xs text-text-muted mt-2">
                Hook: {style.hook}
              </p>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onSkip}
        className="btn-secondary self-start text-xs"
        type="button"
      >
        Skip, write my own
      </button>

      {model && (
        <p className="text-xs text-text-muted font-mono">
          Generated with: {model}
        </p>
      )}
    </div>
  );
}
