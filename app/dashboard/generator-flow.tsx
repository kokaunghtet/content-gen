"use client";

import { useState } from "react";
import type { Platform, ContentStyle } from "@/lib/generation-prompts";
import PlatformPicker from "./platform-picker";
import StyleSuggestions from "./style-suggestions";
import GeneratorForm from "./generator-form";

type Step = "platform" | "styles" | "form";

export default function GeneratorFlow() {
  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [style, setStyle] = useState<ContentStyle | undefined>(undefined);

  function handlePlatformSelect(selected: Platform) {
    setPlatform(selected);
    setStep("styles");
  }

  function handleSelectStyle(selected: ContentStyle) {
    setStyle(selected);
    setStep("form");
  }

  function handleSkip() {
    setStep("form");
  }

  if (step === "platform") {
    return <PlatformPicker onSelect={handlePlatformSelect} />;
  }

  if (step === "styles" && platform) {
    return (
      <StyleSuggestions
        platform={platform}
        onSelectStyle={handleSelectStyle}
        onSkip={handleSkip}
      />
    );
  }

  return (
    <GeneratorForm
      initialPlatform={platform ?? undefined}
      style={style}
    />
  );
}
