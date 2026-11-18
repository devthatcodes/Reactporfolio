import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * VelocitySkewWrapper
 * Applies real-time scroll-velocity 3D perspective tilt (rotateX) and inertia skew (skewY)
 * to foreground content as the user scrolls.
 */
export function VelocitySkewWrapper({ children }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 42,
    stiffness: 340,
    mass: 0.45,
  });

  const skewY = useTransform(smoothVelocity, [-2400, 0, 2400], [-4.5, 0, 4.5], {
    clamp: true,
  });
  const rotateX = useTransform(smoothVelocity, [-2400, 0, 2400], [5, 0, -5], {
    clamp: true,
  });
  const scale = useTransform(smoothVelocity, [-2400, 0, 2400], [0.985, 1, 0.985], {
    clamp: true,
  });

  return (
    <div style={{ perspective: '1600px' }}>
      <motion.div
        style={{
          skewY,
          rotateX,
          scale,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollPortalSection
 * Wraps each major section so scrolling continuously drives:
 * - Entry (0.0 -> 0.28): clipPath unmask, 3D scale/rotateX/y rise, opacity reveal
 * - Exit (0.75 -> 1.0): 3D recession into depth (scale, rotateX, y, opacity) as the next section enters
 * - Live thermal gauge bar across the top of the section header
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
    damping: 34,
    stiffness: 240,
    mass: 0.4,
  });

  const clipPath = useTransform(
    smoothProgress,
    [0, 0.24, 0.78, 1],
    disableEntryClip
      ? [
          'inset(0% 0% 0% 0% round 0px)',
          'inset(0% 0% 0% 0% round 0px)',
          'inset(0% 0% 0% 0% round 0px)',
          'inset(8% 4% 8% 4% round 24px)',
        ]
      : [
          'inset(14% 6% 14% 6% round 28px)',
          'inset(0% 0% 0% 0% round 0px)',
          'inset(0% 0% 0% 0% round 0px)',
          'inset(10% 4% 10% 4% round 24px)',
        ]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.26, 0.75, 1],
    disableEntryClip ? [1, 1, 1, 0.88] : [0.86, 1, 1, 0.88]
  );

  const rotateX = useTransform(
    smoothProgress,
    [0, 0.26, 0.75, 1],
    disableEntryClip ? [0, 0, 0, -14] : [16, 0, 0, -14]
  );

  const y = useTransform(
    smoothProgress,
    [0, 0.26, 0.75, 1],
    disableEntryClip ? [0, 0, 0, -90] : [100, 0, 0, -90]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.78, 1],
    disableEntryClip ? [1, 1, 1, 0.15] : [0.05, 1, 1, 0.15]
  );

  const gaugeScaleX = useTransform(smoothProgress, [0.08, 0.82], [0, 1]);
  const badgeY = useTransform(smoothProgress, [0, 0.5, 1], [36, 0, -36]);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ perspective: '1600px' }}
    >
      {/* Floating Foreground Scroll-Progress Telemetry Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <motion.div
          style={{ y: badgeY }}
          className="flex items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-umber/70 mb-1.5"
        >
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <span className="text-terracotta font-semibold">{code}</span>
            <span className="hidden sm:inline text-espresso/60">// {label}</span>
          </span>
          <span className="text-espresso/70 bg-cream-dark/90 px-2.5 py-0.5 rounded-full border border-espresso/10">
            ROAST CURVE {tempRange}
          </span>
        </motion.div>
        <div className="h-[2px] w-full bg-espresso/10 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: gaugeScaleX, transformOrigin: '0% 50%' }}
            className="h-full w-full bg-gradient-to-r from-sage via-terracotta to-espresso"
          />
        </div>
      </div>

      {/* 3D Scroll-Driven Foreground Portal Container */}
      <motion.div
        style={{
          clipPath,
          scale,
          rotateX,
          y,
          opacity,
          transformStyle: 'preserve-3d',
          willChange: 'transform, clip-path, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollSensoryMarquee
 * Giant scroll-scrubbed dual-direction kinetic typography divider between sections.
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

  const xLeft = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-26%', '10%']);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-1.5, 0, 1.5]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.08, 0.85]);

  return (
    <motion.div
      ref={marqueeRef}
      style={{ rotateZ }}
      className="relative py-7 sm:py-10 overflow-hidden border-y border-espresso/15 bg-espresso text-cream select-none z-20 shadow-editorial"
    >
      {/* Subtle diagonal terracotta sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(200, 90, 50, 0.38), transparent 70%)',
        }}
      />

      <div className="relative space-y-2">
        <motion.div
          style={{ x: xLeft }}
          className="whitespace-nowrap flex items-center gap-8 font-serif text-2xl sm:text-4xl lg:text-5xl tracking-tight text-cream/90"
        >
          <span>{topLine}</span>
          <span className="text-terracotta italic">{topLine}</span>
          <span>{topLine}</span>
        </motion.div>

        <motion.div
          style={{ x: xRight }}
          className="whitespace-nowrap flex items-center gap-8 font-mono text-xs sm:text-sm uppercase tracking-[0.28em] text-cream/60"
        >
          <span>{bottomLine}</span>
          <span className="text-sage">{bottomLine}</span>
          <span>{bottomLine}</span>
        </motion.div>
      </div>

      {/* Center Floating Telemetry Pill */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ scale: badgeScale }}
          className="px-4 py-1.5 rounded-full bg-terracotta text-cream text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] border border-cream/30 shadow-lg"
        >
          {badge}
        </motion.div>
      </div>
    </motion.div>
  );
}
