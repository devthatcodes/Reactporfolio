import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * VelocitySkewWrapper
 * Kept as a lightweight pass-through for export compatibility (no 3D skew/perspective).
 */
export function VelocitySkewWrapper({ children }) {
  return <>{children}</>;
}

/**
 * ScrollPortalSection — "Botanical Arc Reveal & Rotating Seal Header"
 * Zero clip-path and zero filter:blur! Uses purely GPU-composited y, scale, rotate, and opacity
 * with a rotating circular roastery seal emblem in the telemetry header.
 */
export function ScrollPortalSection({
  children,
  code = 'PORTAL // 01',
  label = 'THERMAL ROAST TELEMETRY',
  tempRange = '165°C → 204.5°C',
  disableEntryClip = false,
}) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 38,
    stiffness: 260,
    mass: 0.35,
  });

  const y = useTransform(
    smoothProgress,
    [0, 0.22, 0.82, 1],
    disableEntryClip ? [0, 0, 0, -28] : [48, 0, 0, -28]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.22, 0.82, 1],
    disableEntryClip ? [1, 1, 1, 0.985] : [0.97, 1, 1, 0.985]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, 0.16, 0.85, 1],
    disableEntryClip ? [1, 1, 1, 0.65] : [0.15, 1, 1, 0.65]
  );

  const gaugeScaleX = useTransform(smoothProgress, [0.06, 0.82], [0, 1]);
  const sealRotate = useTransform(smoothProgress, [0, 1], [0, 240]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Botanical Arc Telemetry Header & Rotating Seal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-umber/75 mb-2">
          <span className="inline-flex items-center gap-2.5">
            <motion.span
              style={{ rotate: sealRotate, willChange: 'transform' }}
              className="w-5 h-5 rounded-full border border-dashed border-terracotta flex items-center justify-center shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-terracotta" />
            </motion.span>
            <span className="text-terracotta font-semibold">{code}</span>
            <span className="hidden sm:inline text-espresso/60">// {label}</span>
          </span>
          <span className="text-espresso/75 bg-cream-dark px-2.5 py-0.5 rounded-full border border-espresso/10">
            ROAST CURVE {tempRange}
          </span>
        </div>
        <div className="h-[2px] w-full bg-espresso/10 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: gaugeScaleX, transformOrigin: '0% 50%', willChange: 'transform' }}
            className="h-full w-full bg-gradient-to-r from-sage via-terracotta to-espresso"
          />
        </div>
      </div>

      {/* Pure GPU Section Container (Zero clip-path, Zero 3D perspective skew) */}
      <motion.div
        style={{
          y,
          scale,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollSensoryMarquee — "Botanical Arc Reveal & Rotating Seal Divider"
 * Smooth scroll-linked horizontal marquee paired with a central Rotating Botanical Roastery Seal Emblem.
 */
export function ScrollSensoryMarquee({
  topLine = 'FIRST CRACK 196.4°C • EXOTHERMIC ESTER RELEASE • HIGH-ALTITUDE MICRO-LOTS •',
  bottomLine = 'TERROIR TELEMETRY • 2,150M ELEVATION • CAST-IRON DRUM ROASTING • DIRECT HARVEST •',
  badge = 'SCROLL TELEMETRY // ACTIVE',
}) {
  const marqueeRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ['start end', 'end start'],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ['4%', '-22%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-20%', '6%']);
  const sealRotate = useTransform(scrollYProgress, [0, 1], [-90, 180]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.92]);

  return (
    <div
      ref={marqueeRef}
      className="relative py-8 sm:py-11 overflow-hidden border-y border-espresso/15 bg-espresso text-cream select-none z-20"
    >
      {/* Subtle Botanical Arc SVG Curve across Divider */}
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 w-full h-7 text-terracotta/25"
        aria-hidden="true"
      >
        <path
          d="M0 75 Q720 5 1440 75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
      </svg>

      <div className="relative space-y-2">
        <motion.div
          style={{ x: xLeft, willChange: 'transform' }}
          className="whitespace-nowrap flex items-center gap-8 font-serif text-2xl sm:text-4xl lg:text-5xl tracking-tight text-cream/90"
        >
          <span>{topLine}</span>
          <span className="text-terracotta italic">{topLine}</span>
          <span>{topLine}</span>
        </motion.div>

        <motion.div
          style={{ x: xRight, willChange: 'transform' }}
          className="whitespace-nowrap flex items-center gap-8 font-mono text-xs sm:text-sm uppercase tracking-[0.28em] text-cream/60"
        >
          <span>{bottomLine}</span>
          <span className="text-sage">{bottomLine}</span>
          <span>{bottomLine}</span>
        </motion.div>
      </div>

      {/* Center Rotating Botanical Roastery Seal Emblem */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ scale: badgeScale, willChange: 'transform' }}
          className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-espresso text-cream text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] border-2 border-terracotta shadow-lg"
        >
          <motion.span
            style={{ rotate: sealRotate, willChange: 'transform' }}
            className="w-6 h-6 rounded-full bg-terracotta/20 border border-dashed border-terracotta flex items-center justify-center"
          >
            <span className="w-2 h-2 rounded-full bg-terracotta" />
          </motion.span>
          <span>{badge}</span>
        </motion.div>
      </div>
    </div>
  );
}
