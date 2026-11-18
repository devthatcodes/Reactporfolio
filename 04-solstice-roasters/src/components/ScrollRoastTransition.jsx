import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export function VelocitySkewWrapper({ children }) {
  return <>{children}</>;
}

/**
 * ScrollPortalSection — Warm Analog Roastery Ledger Reveal
 * Uses purely GPU-composited y, scale, rotate, and opacity with a rotating
 * circular roastery wax-seal emblem in the ledger header.
 */
export function ScrollPortalSection({
  children,
  code = 'Chapter I · First Harvest',
  label = 'Cast-Iron Drum Roasting & Terroir Notes',
  tempRange = '94°C → 198.2°C',
  disableEntryClip = false,
}) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 36,
    stiffness: 240,
    mass: 0.35,
  });

  const y = useTransform(
    smoothProgress,
    [0, 0.2, 0.85, 1],
    disableEntryClip ? [0, 0, 0, -20] : [36, 0, 0, -20]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.2, 0.85, 1],
    disableEntryClip ? [1, 1, 1, 0.99] : [0.98, 1, 1, 0.99]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.88, 1],
    disableEntryClip ? [1, 1, 1, 0.8] : [0.25, 1, 1, 0.8]
  );

  const gaugeScaleX = useTransform(smoothProgress, [0.06, 0.82], [0, 1]);
  const sealRotate = useTransform(smoothProgress, [0, 1], [0, 220]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Warm Analog Roastery Ledger Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-umber/75 mb-2.5">
          <span className="inline-flex items-center gap-2.5">
            <motion.span
              style={{ rotate: sealRotate, willChange: 'transform' }}
              className="w-5 h-5 rounded-full border border-dashed border-terracotta flex items-center justify-center shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-terracotta" />
            </motion.span>
            <span className="text-terracotta font-serif italic tracking-wider normal-case text-sm">
              {code.replace(/\/\//g, '·')}
            </span>
            <span className="hidden sm:inline text-espresso/60">
              · {label.replace(/\/\//g, '·')}
            </span>
          </span>
          <span className="text-espresso/75 bg-cream-dark px-3 py-0.5 rounded-full border border-espresso/10 font-serif italic normal-case text-xs">
            Drum Profile {tempRange}
          </span>
        </div>
        <div className="h-[1.5px] w-full bg-espresso/10 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: gaugeScaleX, transformOrigin: '0% 50%', willChange: 'transform' }}
            className="h-full w-full bg-gradient-to-r from-sage via-terracotta to-espresso"
          />
        </div>
      </div>

      {/* Pure GPU Section Container */}
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
 * BotanicalVineDivider — Replaces all horizontal marquee ribbons!
 * Renders an Animated Hand-Drawn SVG Botanical Vine & Rotating Roastery Stamp Seal
 * where the curved botanical coffee stem draws itself via `pathLength: 0 -> 1` on scroll
 * paired with a rotating circular "SOLSTICE MICRO-LOT ROASTERY" wax-seal stamp.
 */
export function BotanicalVineDivider({
  chapter = 'Harvest Note',
  inscription = 'Hand-Harvested High-Altitude Arabica · Small-Batch Cast-Iron Drum',
}) {
  const dividerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ['start 92%', 'end 15%'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
  });

  const vinePathLength = useTransform(smoothScroll, [0.05, 0.75], [0, 1]);
  const leafScale = useTransform(smoothScroll, [0.2, 0.65], [0.4, 1]);
  const leafOpacity = useTransform(smoothScroll, [0.15, 0.55], [0, 1]);
  const sealRotate = useTransform(smoothScroll, [0, 1], [-80, 160]);

  return (
    <div
      ref={dividerRef}
      className="relative py-10 sm:py-14 overflow-hidden bg-cream-dark/55 border-y border-espresso/10 select-none z-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Top Editorial Caption */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-umber/65 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
          <span>{chapter}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
        </div>

        <div className="relative w-full flex items-center justify-center my-1">
          {/* Hand-Drawn SVG Botanical Coffee Vine (pathLength 0 -> 1 on scroll) */}
          <svg
            viewBox="0 0 960 110"
            fill="none"
            className="w-full h-20 sm:h-24 overflow-visible"
            aria-hidden="true"
          >
            {/* Left to Center Botanical Stem */}
            <motion.path
              d="M 20 62 C 145 18, 255 96, 395 54"
              stroke="#5E7461"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: vinePathLength }}
            />
            {/* Right to Center Botanical Stem */}
            <motion.path
              d="M 940 48 C 815 92, 705 14, 565 56"
              stroke="#5E7461"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: vinePathLength }}
            />

            {/* Secondary Terracotta Accent Tendrils */}
            <motion.path
              d="M 95 45 C 165 78, 285 24, 385 55"
              stroke="#C85A32"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              strokeOpacity="0.6"
              style={{ pathLength: vinePathLength }}
            />
            <motion.path
              d="M 865 65 C 795 32, 675 86, 575 55"
              stroke="#C85A32"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              strokeOpacity="0.6"
              style={{ pathLength: vinePathLength }}
            />

            {/* Botanical Leaves & Coffee Cherries along Left Stem */}
            <motion.g style={{ opacity: leafOpacity, scale: leafScale }}>
              <path
                d="M 150 42 C 135 22, 160 14, 174 30 C 164 42, 154 44, 150 42 Z"
                fill="#5E7461"
                fillOpacity="0.8"
              />
              <path
                d="M 265 68 C 252 88, 278 96, 290 78 C 280 68, 270 66, 265 68 Z"
                fill="#5E7461"
                fillOpacity="0.7"
              />
              <circle cx="182" cy="40" r="4.5" fill="#C85A32" />
              <circle cx="192" cy="45" r="3.5" fill="#A84623" />
              <circle cx="315" cy="58" r="4.5" fill="#C85A32" />
            </motion.g>

            {/* Botanical Leaves & Coffee Cherries along Right Stem */}
            <motion.g style={{ opacity: leafOpacity, scale: leafScale }}>
              <path
                d="M 810 68 C 825 88, 800 96, 786 80 C 796 68, 806 66, 810 68 Z"
                fill="#5E7461"
                fillOpacity="0.8"
              />
              <path
                d="M 695 42 C 708 22, 682 14, 670 32 C 680 42, 690 44, 695 42 Z"
                fill="#5E7461"
                fillOpacity="0.7"
              />
              <circle cx="778" cy="70" r="4.5" fill="#C85A32" />
              <circle cx="768" cy="65" r="3.5" fill="#A84623" />
              <circle cx="645" cy="52" r="4.5" fill="#C85A32" />
            </motion.g>
          </svg>

          {/* Center Rotating Roastery Wax-Seal Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cream border-2 border-terracotta/60 shadow-editorial flex items-center justify-center">
              <motion.svg
                viewBox="0 0 100 100"
                style={{ rotate: sealRotate, willChange: 'transform' }}
                className="w-full h-full p-1"
              >
                <defs>
                  <path
                    id="roastery-seal-ring"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#C85A32"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  fill="#1E1612"
                  fontSize="7.4"
                  fontWeight="600"
                  letterSpacing="2.3"
                  className="uppercase font-sans"
                >
                  <textPath href="#roastery-seal-ring" startOffset="0%">
                    SOLSTICE MICRO-LOT ROASTERY · PDX ·
                  </textPath>
                </text>
              </motion.svg>

              {/* Center Coffee Cherry & Sun Icon */}
              <div className="absolute w-10 h-10 rounded-full bg-terracotta/15 border border-terracotta/40 flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-terracotta" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hand-Stamped Editorial Inscription */}
        <p className="font-serif italic text-sm sm:text-base text-umber/80 text-center mt-2">
          {inscription}
        </p>
      </div>
    </div>
  );
}
