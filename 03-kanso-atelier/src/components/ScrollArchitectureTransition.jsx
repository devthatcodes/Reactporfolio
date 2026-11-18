import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * VelocitySkewWrapper
 * Kept as a zero-overhead pass-through container so any legacy imports
 * never trigger CPU/3D skew repaints during scroll.
 */
export function VelocitySkewWrapper({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

/**
 * ScrollShutterSection
 * Kanso Atelier signature architectural section transition:
 * - Zero clipPath or 3D perspective skew (eliminates main-thread repaint lag).
 * - Uses pure GPU-composited Horizontal Hairline Rule Expansion (scaleX: 0 -> 1)
 *   paired with a crisp Vertical Editorial Slide (y: 40 -> 0, opacity: 0 -> 1).
 */
export function ScrollShutterSection({
  children,
  sectionCode = '01 // SECTOR',
  datumLabel = 'ARCHITECTURAL DATUM // ELEV +4.20M',
  coordinates = '35.0116° N · 55.6761° N',
  isHero = false,
  className = '',
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 25%'],
  });

  // Pure GPU-composited transforms (scaleX, translateY, opacity)
  const ruleScaleX = useTransform(scrollYProgress, [0, 0.85], isHero ? [1, 1] : [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], isHero ? [0, 0] : [40, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], isHero ? [1, 1] : [0, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Top Architectural Datum Header & Expanding Horizontal Brass Hairline Rule */}
      <div className="pointer-events-none relative z-20 max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em] text-bronze/90 py-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-bronze rotate-45" />
            <span>{sectionCode}</span>
          </span>
          <span className="hidden sm:inline text-taupe">{datumLabel}</span>
          <span className="text-charcoal/70">{coordinates}</span>
        </div>
        <div className="relative h-[1px] w-full bg-charcoal/10 overflow-hidden">
          <motion.div
            style={{ scaleX: ruleScaleX, transformOrigin: 'left center' }}
            className="absolute inset-0 bg-bronze will-change-transform"
          />
        </div>
      </div>

      {/* Editorial Section Body (Pure GPU translateY + opacity) */}
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
 * ScrollArchitecturalMarquee
 * Lightweight scroll-linked horizontal datum ribbon using only GPU translateX (x) and scaleX.
 */
export function ScrollArchitecturalMarquee({
  primaryText = 'KANSO ATELIER · TIMBER · STONE · CHOREOGRAPHED DAYLIGHT · KYOTO 35.0116°N · COPENHAGEN 55.6761°N',
  secondaryText = 'SECTION A–A // 1:100 CAD DATUM // HINOKI CYPRESS // PETERSEN KOLUMBA BRICK // KURAMA GRANITE // MA SPATIAL STILLNESS',
  indexTag = 'DATUM // 01-02',
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ['4%', '-18%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-18%', '4%']);
  const rulerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 1, 0.25]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 py-5 md:py-6 bg-charcoal text-alabaster border-y border-bronze/40 overflow-hidden select-none"
    >
      {/* Top CAD Millimeter Ruler Ticks */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 mb-2 flex items-center justify-between text-[9px] font-mono tracking-[0.26em] text-bronze">
        <span>{indexTag}</span>
        <motion.div
          style={{ scaleX: rulerScale }}
          className="hidden sm:block h-[1px] flex-1 mx-6 bg-bronze/45 origin-center will-change-transform"
        />
        <span>MA // SPATIAL DATUM</span>
      </div>

      {/* Track 1: Large Editorial Serif Stream (GPU translateX) */}
      <div className="overflow-hidden whitespace-nowrap py-1">
        <motion.div
          style={{ x: xLeft }}
          className="inline-flex items-center gap-8 font-serif text-2xl sm:text-3xl tracking-tight text-alabaster/90 will-change-transform"
        >
          {[0, 1].map((i) => (
            <span key={i} className="inline-flex items-center gap-8">
              <span>{primaryText}</span>
              <span className="inline-block w-2 h-2 border border-bronze rotate-45" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* Track 2: Technical CAD Telemetry Stream (GPU translateX) */}
      <div className="overflow-hidden whitespace-nowrap pt-1 border-t border-alabaster/10 mt-1">
        <motion.div
          style={{ x: xRight }}
          className="inline-flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.28em] text-bronze/90 will-change-transform"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="inline-flex items-center gap-6">
              <span>{secondaryText}</span>
              <span className="text-alabaster/40">///</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
