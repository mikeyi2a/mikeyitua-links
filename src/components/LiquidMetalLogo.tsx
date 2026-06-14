"use client";

import { GemSmoke } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";

const DEFAULT_PALETTE = {
  colors: ["#8AD8F9", "#FFFFFF"],
  colorInner: "#00A2CF",
};

export function LiquidMetalLogo({ className = "h-[36px] w-[72px]" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <GemSmoke
      speed={shouldReduceMotion ? 0 : 1.45}
      size={0.67}
      outerDistortion={0.45}
      innerDistortion={0.83}
      outerGlow={0}
      innerGlow={1}
      offset={0}
      scale={1}
      angle={249}
      shape="diamond"
      image="/rewrites/paper-gem-logo.svg"
      frame={3692468.2559983064}
      colors={[...DEFAULT_PALETTE.colors]}
      colorInner={DEFAULT_PALETTE.colorInner}
      colorBack="#00000000"
      className={className}
    />
  );
}
