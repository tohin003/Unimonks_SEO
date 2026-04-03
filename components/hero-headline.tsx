"use client";

import { useEffect, useEffectEvent, useState } from "react";

const heroSignals = [
  {
    word: "clarity.",
    label: "Know what matters",
    note: "A guided path for GT, English, domains, and admissions.",
  },
  {
    word: "consistency.",
    label: "Build a calm rhythm",
    note: "A routine students can actually sustain through the full CUET cycle.",
  },
  {
    word: "confidence.",
    label: "Move with control",
    note: "From mocks to counseling, every next step stays visible.",
  },
] as const;

export function HeroHeadline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSignal = heroSignals[activeIndex];

  const advanceSignal = useEffectEvent(() => {
    setActiveIndex((current) => (current + 1) % heroSignals.length);
  });

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      advanceSignal();
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  return (
    <div
      className="mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h1 className="font-headline text-5xl leading-[0.95] text-primary md:text-7xl">
        <span className="block">
          CUET coaching in Munirka that turns pressure into
        </span>
        <span className="hero-word-window mt-4 block md:mt-5">
          <span key={activeSignal.word} className="hero-word">
            {activeSignal.word}
          </span>
        </span>
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        {heroSignals.map((signal, index) => (
          <button
            key={signal.word}
            type="button"
            aria-pressed={index === activeIndex}
            data-active={index === activeIndex ? "true" : "false"}
            className="hero-signal"
            onClick={() => {
              setIsPaused(true);
              setActiveIndex(index);
            }}
            onMouseEnter={() => {
              setIsPaused(true);
              setActiveIndex(index);
            }}
            onFocus={() => {
              setIsPaused(true);
              setActiveIndex(index);
            }}
            onBlur={() => setIsPaused(false)}
          >
            <span className="hero-signal-label">{signal.word}</span>
            <span className="hero-signal-note">{signal.label}</span>
          </button>
        ))}
      </div>

      <div className="hero-signal-copy mt-4">
        <p key={activeSignal.note} className="hero-signal-text">
          {activeSignal.note}
        </p>
      </div>
    </div>
  );
}
