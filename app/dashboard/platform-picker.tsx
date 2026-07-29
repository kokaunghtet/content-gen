"use client";

import {
  PLATFORM_FIRST_OPTIONS,
  PLATFORM_LABELS,
  type Platform,
} from "@/lib/generation-prompts";

type Props = {
  onSelect: (platform: Platform) => void;
};

export default function PlatformPicker({ onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-text-secondary">
        Choose a platform
      </p>
      <div className="flex gap-4">
        {PLATFORM_FIRST_OPTIONS.map((platform) => (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            className="card p-6 flex-1 text-left hover:border-border-hover transition-colors cursor-pointer"
          >
            <span className="text-lg font-semibold">
              {PLATFORM_LABELS[platform]}
            </span>
            <p className="text-sm text-text-secondary mt-1">
              {platform === "facebook"
                ? "Posts, reels, and community content"
                : "Short-form video captions and trends"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
