import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * VelocitySkewWrapper
 * Kept as a zero-overhead pass-through container for compatibility.
 */
export function VelocitySkewWrapper({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

/**
 * ScrollShutterSection
 * Luxury Architectural Monograph Section Wrapper:
 * Uses self-drawing 1px architectural datum lines (scaleX: 0 -> 1) and
 * vertical Roman numeral chapter markers with serene vertical editorial rise.
 */
export function ScrollShutterSection({
  children,
  sectionCode = 'CHAPTER I // PHILOSOPHY',
  datumLabel = 'ARCHITECTURAL DATUM // ELEV +4.20M',
  coordinates = '35.0116° N · 55.6761° N',
  romanNumeral = 'I',
  isHero = false,
  className = '',
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 28%'],
  });

  const ruleScaleX = useTransform(scrollYProgress, [0, 0.85], isHero ? [1, 1] : [0, 1]);
  const spineScaleY = useTransform(scrollYProgress, [0, 1], isHero ? [1, 1] : [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], isHero ? [0, 0] : [28, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], isHero ? [1, 1] : [0, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Left Peripheral Vertical Roman Numeral Chapter Spine (Desktop) */}
      <div className="hidden xl:flex flex-col items-center pointer-events-none absolute left-5 top-12 bottom-12 z-20">
        <span className="font-serif italic text-xs text-bronze mb-3">{romanNumeral}</span>
        <div className="relative w-[1px] flex-1 bg-charcoal/10 overflow-hidden">
          <motion.div
            style={{ scaleY: spineScaleY, transformOrigin: 'top center' }}
            className="absolute inset-0 bg-bronze/60 will-change-transform"
          />
        </div>
        <span className="mt-3 text-[8px] font-mono uppercase tracking-[0.28em] text-taupe [writing-mode:vertical-rl] rotate-180">
          {sectionCode}
        </span>
      </div>

      {/* Top Architectural Datum Header & Self-Drawing 1px Rule */}
      <div className="pointer-events-none relative z-20 max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.26em] text-taupe py-2.5">
          <span className="flex items-center gap-2.5 text-bronze">
            <span className="font-serif italic text-xs">{romanNumeral}.</span>
            <span>{sectionCode}</span>
          </span>
          <span className="hidden sm:inline text-taupe/80">{datumLabel}</span>
          <span className="text-charcoal/70">{coordinates}</span>
        </div>
        <div className="relative h-[1px] w-full bg-charcoal/10 overflow-hidden">
          <motion.div
            style={{ scaleX: ruleScaleX, transformOrigin: 'left center' }}
            className="absolute inset-0 bg-bronze/80 will-change-transform"
          />
        </div>
      </div>

      {/* Editorial Section Body */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        className="relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ArchitecturalElevationDivider
 * Replaces scrolling ticker ribbons with quiet negative space (Ma // 間),
 * a self-drawing vertical center hairline (scaleY: 0 -> 1 on scroll) flanked by
 * Roman numeral chapter coordinates, and a horizontal 1px datum rule that
 * expands from the center outward (scaleX: 0 -> 1).
 */
export function ArchitecturalElevationDivider({
  chapter = 'CHAPTER I // PHILOSOPHY',
  elevation = 'ELEV +4.20M // 1:100 DATUM',
  kanji = '間 // MA — QUIET INTERVAL',
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 30%'],
  });

  const verticalScaleY = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const horizontalScaleX = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 py-14 md:py-20 bg-alabaster/70 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Top Kanji / Spatial Interval Caption */}
        <motion.span
          style={{ opacity: textOpacity }}
          className="text-[9px] font-mono uppercase tracking-[0.34em] text-bronze mb-4"
        >
          {kanji}
        </motion.span>

        {/* Self-Drawing Vertical Center Hairline + Flanked Chapter Coordinates */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 my-2">
          <motion.div
            style={{ opacity: textOpacity }}
            className="text-center md:text-right text-[10px] font-mono uppercase tracking-[0.26em] text-charcoal"
          >
            {chapter}
          </motion.div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative h-16 md:h-20 w-[1px] bg-charcoal/10 overflow-hidden">
              <motion.div
                style={{ scaleY: verticalScaleY, transformOrigin: 'top center' }}
                className="absolute inset-0 bg-bronze will-change-transform"
              />
            </div>
          </div>

          <motion.div
            style={{ opacity: textOpacity }}
            className="text-center md:text-left text-[10px] font-mono uppercase tracking-[0.26em] text-taupe"
          >
            {elevation}
          </motion.div>
        </div>

        {/* Center-Outward Self-Drawing Horizontal 1px Datum Rule */}
        <div className="relative w-full max-w-2xl h-[1px] bg-charcoal/10 mt-4 overflow-hidden">
          <motion.div
            style={{ scaleX: horizontalScaleX, transformOrigin: 'center center' }}
            className="absolute inset-0 bg-bronze/70 will-change-transform"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * ArchitecturalCurtainImage
 * Signature Awwwards luxury architecture reveal:
 * When the frame enters the viewport, a warm limestone/alabaster Paper Curtain Overlay
 * (bg-[#EAE6DF]) slides smoothly off the image over 1.1s ease [0.16, 1, 0.3, 1],
 * while the inner artwork simultaneously scales down from scale(1.16) to scale(1.0)
 * and shifts with subtle vertical scroll parallax (y: ['-6%', '6%']).
 */
export function ArchitecturalCurtainImage({
  children,
  className = '',
  curtainDirection = 'vertical', // 'vertical' (top) | 'horizontal' (right)
}) {
  const frameRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      {/* Inner Artwork: Scales down from 1.16 -> 1.0 on viewport entry + subtle scroll parallax */}
      <motion.div
        style={{ y: parallaxY }}
        className="w-full h-full will-change-transform"
      >
        <motion.div
          initial={{ scale: 1.16 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full will-change-transform"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Warm Limestone / Alabaster Paper Curtain Overlay (#EAE6DF) */}
      <motion.div
        initial={curtainDirection === 'vertical' ? { scaleY: 1 } : { scaleX: 1 }}
        whileInView={curtainDirection === 'vertical' ? { scaleY: 0 } : { scaleX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transformOrigin: curtainDirection === 'vertical' ? 'bottom center' : 'right center',
        }}
        className="pointer-events-none absolute inset-0 z-20 bg-[#EAE6DF] border-b border-bronze/40 will-change-transform"
      />
    </div>
  );
}
