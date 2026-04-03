"use client";

import { useEffect, useRef } from "react";

type DockSnapshot = {
  docCenter: number;
  x: number;
  y: number;
  width: number;
  height: number;
  open: number;
  scale: number;
  yaw: number;
  pitch: number;
  roll: number;
  lift: number;
};

const pageLayerClasses = [
  "ambient-book-page ambient-book-page-1",
  "ambient-book-page ambient-book-page-2",
  "ambient-book-page ambient-book-page-3",
  "ambient-book-page ambient-book-page-4",
  "ambient-book-page ambient-book-page-5",
  "ambient-book-page ambient-book-page-6",
] as const;

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function smoothstep(amount: number) {
  return amount * amount * (3 - 2 * amount);
}

function buildFallbackDock(isCompact: boolean): DockSnapshot {
  if (isCompact) {
    return {
      docCenter: window.scrollY + window.innerHeight * 0.3,
      x: window.innerWidth * 0.78,
      y: window.innerHeight * 0.28,
      width: 150,
      height: 220,
      open: 74,
      scale: 0.92,
      yaw: -18,
      pitch: 16,
      roll: -6,
      lift: 0,
    };
  }

  return {
    docCenter: window.scrollY + window.innerHeight * 0.3,
    x: window.innerWidth * 0.77,
    y: window.innerHeight * 0.32,
    width: 220,
    height: 320,
    open: 62,
    scale: 1,
    yaw: -24,
    pitch: 18,
    roll: -8,
    lift: 0,
  };
}

function readDockSnapshots(): DockSnapshot[] {
  const isCompact = window.innerWidth < 1024;
  const dockNodes =
    document.querySelectorAll<HTMLElement>("[data-book-dock]");

  const docks = Array.from(dockNodes)
    .flatMap((node) => {
      const rect = node.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        return [];
      }

      return [
        {
          docCenter: window.scrollY + rect.top + rect.height / 2,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          open: readNumber(node.dataset.bookOpen, isCompact ? 74 : 62),
          scale: readNumber(node.dataset.bookScale, isCompact ? 0.92 : 1),
          yaw: readNumber(node.dataset.bookYaw, isCompact ? -18 : -24),
          pitch: readNumber(node.dataset.bookPitch, 18),
          roll: readNumber(node.dataset.bookRoll, -8),
          lift: readNumber(node.dataset.bookLift, 0),
        },
      ];
    })
    .sort((left, right) => left.docCenter - right.docCenter);

  return docks.length > 0 ? docks : [buildFallbackDock(isCompact)];
}

function resolveDockState(docks: DockSnapshot[]) {
  if (docks.length === 1) {
    return {
      fromDock: docks[0],
      toDock: docks[0],
      amount: 0,
    };
  }

  const traveler = window.scrollY + window.innerHeight * 0.48;
  const nextIndex = docks.findIndex((dock) => dock.docCenter >= traveler);

  if (nextIndex <= 0) {
    return {
      fromDock: docks[0],
      toDock: docks[1] ?? docks[0],
      amount: 0,
    };
  }

  if (nextIndex === -1) {
    return {
      fromDock: docks[docks.length - 2] ?? docks[0],
      toDock: docks[docks.length - 1],
      amount: 1,
    };
  }

  const fromDock = docks[nextIndex - 1];
  const toDock = docks[nextIndex];
  const distance = Math.max(toDock.docCenter - fromDock.docCenter, 1);

  return {
    fromDock,
    toDock,
    amount: Math.min(Math.max((traveler - fromDock.docCenter) / distance, 0), 1),
  };
}

export function LandingPageAmbient() {
  const ambientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ambientRef.current;

    if (!node) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId = 0;

    const updateMotion = () => {
      animationFrameId = 0;

      const isCompact = window.innerWidth < 1024;
      const scrollMax = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(window.scrollY / scrollMax, 1);
      const wave = Math.sin(progress * Math.PI * 3.6);
      const sway = Math.cos(progress * Math.PI * 2.8);
      const docks = readDockSnapshots();
      const { fromDock, toDock, amount } = resolveDockState(docks);
      const easedAmount = smoothstep(amount);

      const x = lerp(fromDock.x, toDock.x, easedAmount);
      const y = lerp(fromDock.y, toDock.y, easedAmount);
      const width = lerp(fromDock.width, toDock.width, easedAmount);
      const height = lerp(fromDock.height, toDock.height, easedAmount);
      const open = lerp(fromDock.open, toDock.open, easedAmount);
      const scale = lerp(fromDock.scale, toDock.scale, easedAmount);
      const yaw = lerp(fromDock.yaw, toDock.yaw, easedAmount);
      const pitch = lerp(fromDock.pitch, toDock.pitch, easedAmount);
      const roll = lerp(fromDock.roll, toDock.roll, easedAmount);
      const lift = lerp(fromDock.lift, toDock.lift, easedAmount);
      const travelArc = Math.sin(easedAmount * Math.PI) * (isCompact ? 8 : 20);
      const widthFit = width * (isCompact ? 0.88 : 0.98);
      const heightFit = height * (isCompact ? 0.74 : 0.82);
      const fitWidth = Math.min(widthFit, heightFit);
      const minWidth = isCompact ? 126 : 150;
      const maxWidth = isCompact ? 220 : 390;
      const bookWidth = Math.max(
        minWidth,
        Math.min(fitWidth * scale, maxWidth),
      );
      const sizeProgress = Math.min(
        Math.max((bookWidth - minWidth) / Math.max(maxWidth - minWidth, 1), 0),
        1,
      );
      const sceneScale = isCompact
        ? 0.92 + sizeProgress * 0.12
        : 0.88 + sizeProgress * 0.24;

      node.style.setProperty("--landing-progress", progress.toFixed(4));
      node.style.setProperty("--landing-drift-y", `${window.scrollY * -0.1}px`);
      node.style.setProperty("--landing-drift-x", `${wave * 18}px`);
      node.style.setProperty("--landing-sway", `${sway * 16}px`);
      node.style.setProperty("--landing-glow-shift", `${wave * 34}px`);
      node.style.setProperty("--landing-book-width", `${bookWidth.toFixed(2)}px`);
      node.style.setProperty("--landing-book-x", `${x}px`);
      node.style.setProperty(
        "--landing-book-y",
        `${y - travelArc + sway * (isCompact ? 5 : 9)}px`,
      );
      node.style.setProperty("--landing-book-open", `${open}deg`);
      node.style.setProperty("--landing-book-scale", sceneScale.toFixed(3));
      node.style.setProperty("--landing-book-yaw", `${yaw + wave * 4}deg`);
      node.style.setProperty("--landing-book-pitch", `${pitch + sway * 1.5}deg`);
      node.style.setProperty("--landing-book-roll", `${roll + wave * 1.2}deg`);
      node.style.setProperty("--landing-book-lift", `${lift + sway * 8}px`);
      node.style.setProperty(
        "--landing-book-page-fan",
        `${(6 + open * 0.12).toFixed(2)}deg`,
      );
    };

    const requestUpdate = () => {
      if (mediaQuery.matches || animationFrameId) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateMotion);
    };

    const handleMotionPreference = () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }

      updateMotion();
    };

    updateMotion();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mediaQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaQuery.removeEventListener("change", handleMotionPreference);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div ref={ambientRef} aria-hidden="true" className="landing-ambient">
      <div className="landing-ambient-veil" />
      <div className="landing-ambient-blur landing-ambient-blur-blue" />
      <div className="landing-ambient-blur landing-ambient-blur-peach" />
      <div className="landing-ambient-blur landing-ambient-blur-ivory" />
      <div className="landing-ambient-lines" />
      <div className="landing-ambient-glow landing-ambient-glow-left" />
      <div className="landing-ambient-glow landing-ambient-glow-right" />

      <div className="ambient-book-scene">
        <div className="ambient-book-halo" />
        <div className="ambient-book-shadow" />
        <div className="ambient-book-stage">
          <div className="ambient-book-orbit">
            <div className="ambient-book-model">
              <div className="ambient-book-back" />
              <div className="ambient-book-spine" />
              <div className="ambient-book-pages">
                {pageLayerClasses.map((className) => (
                  <span key={className} className={className} />
                ))}
              </div>
              <div className="ambient-book-front-hinge">
                <div className="ambient-book-front">
                  <div className="ambient-book-front-copy">
                    <span className="ambient-book-kicker">UNIMONKS</span>
                    <h3 className="ambient-book-title">CUET Success Book</h3>
                    <p className="ambient-book-subtitle">
                      Preparation, mock review, and admissions clarity.
                    </p>
                    <span className="ambient-book-thread" />
                    <span className="ambient-book-chip">
                      Munirka, New Delhi
                    </span>
                  </div>
                </div>
                <div className="ambient-book-front-inner">
                  <div className="ambient-book-front-inner-copy">
                    <span className="ambient-book-inner-kicker">
                      Study notes
                    </span>
                    <span className="ambient-book-inner-line" />
                    <span className="ambient-book-inner-line ambient-book-inner-line-short" />
                    <span className="ambient-book-inner-line" />
                    <span className="ambient-book-inner-card" />
                  </div>
                </div>
              </div>
              <div className="ambient-book-edge" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
