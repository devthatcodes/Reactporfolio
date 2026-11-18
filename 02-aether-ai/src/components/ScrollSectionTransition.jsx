import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollPortalSection
 * Lightweight 120fps GPU-composited Slide-Up & Scale-In Deck Reveal:
 * - Uses ONLY y ([50, 0]), scale ([0.96, 1]), and opacity ([0.2, 1]) on scroll entry.
 * - Zero clip-path, zero blur filters, zero 3D perspective repaints.
 * - Includes a horizontal Neural Data Stream top bar driven by pure scaleX / translateX.
 */
export function ScrollPortalSection({
  children,
  sectionCode = 'BLADE // 01',
  sectionLabel = 'TELEMETRY',
  accentColor = '#22D3EE',
  stickySafe = false,
  isFirst = false,
}) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Pure GPU-composited Slide-Up & Scale-In Deck Reveal
  const y = useTransform(
    scrollYProgress,
    [0, 0.24, 0.85, 1],
    [isFirst ? 0 : 50, 0, 0, -24]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.24, 0.85, 1],
    [isFirst ? 1 : 0.96, 1, 1, 0.98]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.88, 1],
    [isFirst ? 1 : 0.2, 1, 1, 0.5]
  );

  // Horizontal scanline progress bar driven directly by MotionValue scaleX
  const barScaleX = useTransform(scrollYProgress, [0.02, 0.45], [0, 1]);

  if (stickySafe) {
    return (
      <div ref={sectionRef} className="relative">
        <div className="pointer-events-none mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span>{sectionCode}</span>
            </span>
            <span className="hidden sm:inline text-zinc-500">
              STICKY HARDWARE BLADE STACK // {sectionLabel}
            </span>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden bg-[#18181D]">
            <motion.div
              style={{
                scaleX: barScaleX,
                transformOrigin: 'left center',
                backgroundColor: accentColor,
              }}
              className="h-full w-full will-change-transform"
            />
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative">
      <motion.div
        style={{ y, scale, opacity }}
        className="relative will-change-transform"
      >
        {/* Top Neural Data Stream Header */}
        <div className="pointer-events-none relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-zinc-300">{sectionCode}</span>
            </span>
            <span className="hidden sm:inline text-zinc-500">
              NEURAL BLADE DECK // {sectionLabel}
            </span>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#18181D]">
            <motion.div
              style={{
                scaleX: barScaleX,
                transformOrigin: 'left center',
                backgroundColor: accentColor,
              }}
              className="h-full w-full will-change-transform"
            />
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollKineticBanner
 * Lightweight Horizontal Neural Data Stream Divider between sections.
 * Uses pure GPU translateX and scaleX progress bar (zero blur, zero 3D tilt, zero setState).
 */
export function ScrollKineticBanner({
  primaryText = 'AUTONOMOUS NEURAL FABRIC // ZERO-COPY TENSOR STREAMING // SUB-4MS FAILOVER',
  secondaryText = 'SEMANTIC VECTOR CACHE // OPENTELEMETRY NATIVE // CRYPTOGRAPHIC ENCLAVE',
  code = 'STREAM // DATA BUS',
  accent = '#22D3EE',
}) {
  const bannerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  });

  // Pure GPU translateX and scaleX MotionValues
  const xLeft = useTransform(scrollYProgress, [0, 1], ['4%', '-18%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-18%', '4%']);
  const progressScaleX = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <div
      ref={bannerRef}
      className="relative overflow-hidden border-y border-[#27272A]/80 bg-[#090D16]/95 py-5 select-none"
    >
      {/* Top HUD Metadata & GPU scaleX Progress Bar */}
      <div className="mx-auto mb-2.5 flex max-w-7xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-sm"
            style={{ backgroundColor: accent }}
          />
          <span className="text-cyan-300">{code}</span>
        </div>

        <div className="hidden h-1 w-56 overflow-hidden rounded-full bg-[#18181D] sm:block">
          <motion.div
            style={{
              scaleX: progressScaleX,
              transformOrigin: 'left center',
            }}
            className="h-full w-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399] will-change-transform"
          />
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <span>NEURAL DATA STREAM // 120FPS SYNC</span>
        </div>
      </div>

      {/* Dual-Direction Horizontal Mono Telemetry Tracks */}
      <div className="space-y-1">
        <motion.div
          style={{ x: xLeft }}
          className="flex whitespace-nowrap font-extrabold tracking-tight text-xl sm:text-3xl lg:text-4xl will-change-transform"
        >
          {[0, 1].map((idx) => (
            <span
              key={idx}
              className="mx-4 bg-gradient-to-r from-[#FAFAFA] via-cyan-200 to-zinc-500 bg-clip-text text-transparent"
            >
              {primaryText} <span className="mx-3 text-cyan-400">•</span>
            </span>
          ))}
        </motion.div>

        <motion.div
          style={{ x: xRight }}
          className="flex whitespace-nowrap font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-zinc-500 will-change-transform"
        >
          {[0, 1, 2].map((idx) => (
            <span key={idx} className="mx-4 flex items-center gap-3">
              <span className="text-violet-400">[BLADE_BUS]</span>
              <span>{secondaryText}</span>
              <span className="text-cyan-400">///</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
