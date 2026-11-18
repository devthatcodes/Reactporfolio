import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

/**
 * VelocitySkewWrapper
 * Applies real-time scroll-velocity inertia skew (skewY clamped to [-4deg, 4deg]),
 * subtle 3D pitch (rotateX), and vertical tension to foreground architectural elements.
 */
export function VelocitySkewWrapper({ children, className = '', intensity = 1 }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 42,
    stiffness: 340,
    mass: 0.4,
  });

  const skewY = useTransform(
    smoothVelocity,
    [-2400, 0, 2400],
    [-4 * intensity, 0, 4 * intensity],
    { clamp: true }
  );

  const rotateX = useTransform(
    smoothVelocity,
    [-2400, 0, 2400],
    [3.5 * intensity, 0, -3.5 * intensity],
    { clamp: true }
  );

  const scaleY = useTransform(
    smoothVelocity,
    [-2400, 0, 2400],
    [1.018, 1, 1.018],
    { clamp: true }
  );

  return (
    <motion.div
      style={{
        skewY,
        rotateX,
        scaleY,
        transformPerspective: 1600,
        transformOrigin: 'center center',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollShutterSection
 * Wraps major architectural sections using useScroll({ target: ref, offset: ['start end', 'end start'] }).
 * - On Scroll Entry (0.0 -> 0.28): Unmasks via an architectural louver/aperture clipPath
 *   (inset(14% 7% 14% 7% round 20px) -> inset(0% 0% 0% 0% round 0px)), rises from 3D perspective
 *   (scale: 0.87 -> 1, rotateX: 15deg -> 0deg, y: 100 -> 0, opacity: 0 -> 1), and draws animated CAD dimension lines.
 * - On Scroll Exit (0.75 -> 1.0): Folds back into 3D depth (scale: 1 -> 0.89, rotateX: 0deg -> -12deg,
 *   y: 0 -> -85, opacity: 1 -> 0.15), creating a tactile architectural sheet-stacking camera transition.
 */
export function ScrollShutterSection({
  children,
  sectionCode = '01 // SECTOR',
  datumLabel = 'CAD SHUTTER // ELEV +4.20M',
  coordinates = '35.0116° N · 55.6761° N',
  isHero = false,
  className = '',
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
  });

  // Entry (0.0 -> 0.28) and Exit (0.75 -> 1.0) keyframes
  const insetTopBottom = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [0, 0, 0, 10] : [14, 0, 0, 9]
  );
  const insetLeftRight = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [0, 0, 0, 5] : [7, 0, 0, 5]
  );
  const insetRadius = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [0, 0, 0, 16] : [20, 0, 0, 14]
  );

  const clipPath = useMotionTemplate`inset(${insetTopBottom}% ${insetLeftRight}% ${insetTopBottom}% ${insetLeftRight}% round ${insetRadius}px)`;

  const scale = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [1, 1, 1, 0.89] : [0.87, 1, 1, 0.89]
  );

  const rotateX = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [0, 0, 0, -12] : [15, 0, 0, -12]
  );

  const y = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.28, 0.75, 1.0],
    isHero ? [0, 0, 0, -85] : [100, 0, 0, -85]
  );

  const opacity = useTransform(
    smoothProgress,
    isHero ? [0.0, 0.5, 0.75, 1.0] : [0.0, 0.22, 0.28, 0.75, 1.0],
    isHero ? [1, 1, 1, 0.15] : [0, 0.88, 1, 1, 0.15]
  );

  // Animated CAD dimension lines across section border
  const cadLineScaleX = useTransform(
    smoothProgress,
    [0.04, 0.28, 0.75, 0.96],
    [0, 1, 1, 0.2]
  );

  const cadReadoutOpacity = useTransform(
    smoothProgress,
    [0.05, 0.2, 0.8, 0.95],
    [0, 1, 1, 0]
  );

  const shutterBladeProgress = useTransform(
    smoothProgress,
    [0.0, 0.26],
    ['42%', '0%']
  );

  return (
    <div
      ref={ref}
      className={`relative [perspective:1800px] ${className}`}
    >
      {/* Top Animated CAD Dimension Header Rule */}
      <motion.div
        style={{ opacity: cadReadoutOpacity }}
        className="pointer-events-none relative z-30 max-w-[1360px] mx-auto px-6 md:px-12"
      >
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em] text-bronze/90 py-1.5">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-bronze rotate-45" />
            <span>{sectionCode}</span>
          </span>
          <span className="hidden sm:inline text-taupe">{datumLabel}</span>
          <span className="text-charcoal/70">{coordinates}</span>
        </div>
        <div className="relative h-[1px] w-full bg-charcoal/10 overflow-hidden">
          <motion.div
            style={{ scaleX: cadLineScaleX, transformOrigin: 'left center' }}
            className="absolute inset-0 bg-bronze"
          />
        </div>
      </motion.div>

      {/* 3D Architectural Shutter Viewport */}
      <motion.div
        style={{
          clipPath,
          scale,
          rotateX,
          y,
          opacity,
          transformPerspective: 1800,
          transformStyle: 'preserve-3d',
        }}
        className="relative will-change-transform origin-center"
      >
        {/* Architectural Louver Blades that part on scroll entry */}
        {!isHero && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            <motion.div
              style={{ height: shutterBladeProgress }}
              className="absolute top-0 left-0 right-0 bg-charcoal/10 backdrop-blur-[2px] border-b border-bronze/40"
            />
            <motion.div
              style={{ height: shutterBladeProgress }}
              className="absolute bottom-0 left-0 right-0 bg-charcoal/10 backdrop-blur-[2px] border-t border-bronze/40"
            />
          </div>
        )}

        {/* Corner CAD Registration Ticks */}
        <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t border-l border-bronze/60 z-30" />
        <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t border-r border-bronze/60 z-30" />
        <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b border-l border-bronze/60 z-30" />
        <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b border-r border-bronze/60 z-30" />

        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollArchitecturalMarquee
 * Between sections, renders a scroll-scrubbed dual-direction kinetic architectural
 * typography & CAD datum divider (x mapped to scrollYProgress sliding in opposite directions).
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

  const xLeft = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-28%', '8%']);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-0.8, 0, 0.8]);
  const rulerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  return (
    <motion.div
      ref={containerRef}
      style={{ rotateZ }}
      className="relative z-20 py-5 md:py-7 bg-charcoal text-alabaster border-y border-bronze/40 overflow-hidden select-none"
    >
      {/* Top CAD Millimeter Ruler Ticks */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 mb-2 flex items-center justify-between text-[9px] font-mono tracking-[0.26em] text-bronze">
        <span>{indexTag}</span>
        <motion.div
          style={{ scaleX: rulerScale }}
          className="hidden sm:block h-[1px] flex-1 mx-6 bg-bronze/45 origin-center"
        />
        <span>SCROLL-LINKED SPATIAL DATUM</span>
      </div>

      {/* Track 1: Large Editorial Serif Kinetic Stream (Slides Left) */}
      <div className="overflow-hidden whitespace-nowrap py-1">
        <motion.div
          style={{ x: xLeft }}
          className="inline-flex items-center gap-8 font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-alabaster/90 will-change-transform"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="inline-flex items-center gap-8">
              <span>{primaryText}</span>
              <span className="inline-block w-2.5 h-2.5 border border-bronze rotate-45" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* Track 2: Technical CAD Telemetry Stream (Slides Right) */}
      <div className="overflow-hidden whitespace-nowrap pt-1 border-t border-alabaster/10 mt-1">
        <motion.div
          style={{ x: xRight }}
          className="inline-flex items-center gap-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-bronze/90 will-change-transform"
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="inline-flex items-center gap-6">
              <span>{secondaryText}</span>
              <span className="text-alabaster/40">///</span>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
