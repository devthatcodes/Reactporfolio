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
 * Applies real-time scroll-velocity 3D tilt, skewY, and vertical tension
 * to foreground content — giving the entire page Active Theory inertia physics.
 */
export function VelocitySkewWrapper({ children }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 38,
    stiffness: 320,
    mass: 0.5,
  });

  const skewY = useTransform(smoothVelocity, [-2400, 0, 2400], [-4.2, 0, 4.2]);
  const rotateX = useTransform(smoothVelocity, [-2400, 0, 2400], [5.5, 0, -5.5]);
  const scaleY = useTransform(smoothVelocity, [-2400, 0, 2400], [1.025, 1, 1.025]);

  return (
    <motion.div
      style={{
        skewY,
        rotateX,
        scaleY,
        transformPerspective: 1600,
        transformOrigin: 'center center',
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps a major foreground section with scroll-linked 3D entry/exit choreography:
 * - Unclips from a cybernetic rounded aperture on entry
 * - Rises from 3D Z-space (scale + rotateX + y)
 * - Recedes into 3D depth as the next section scrolls over it
 */
export function ScrollSectionPortal({
  children,
  sectionNumber = '01',
  sectionTag = 'PORTAL SECTOR',
  accent = '#C8FF32',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 34,
    stiffness: 240,
    mass: 0.4,
  });

  // Entry (0 -> 0.24) and Exit (0.76 -> 1.0)
  const scale = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [0.84, 1, 1, 0.87]);
  const rotateX = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [18, 0, 0, -15]);
  const y = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [110, 0, 0, -95]);
  const opacity = useTransform(smoothProgress, [0, 0.16, 0.82, 1], [0.05, 1, 1, 0.12]);

  // Dynamic clip-path aperture that opens as you scroll into the section
  const insetY = useTransform(smoothProgress, [0, 0.22, 0.82, 1], [12, 0, 0, 8]);
  const insetX = useTransform(smoothProgress, [0, 0.22, 0.82, 1], [5, 0, 0, 4]);
  const radius = useTransform(smoothProgress, [0, 0.22, 0.82, 1], [32, 0, 0, 24]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

  // Top laser scanline progress bar linked to section scroll
  const beamWidth = useTransform(smoothProgress, [0.05, 0.5, 0.95], ['0%', '100%', '100%']);

  return (
    <div ref={ref} className="relative" style={{ perspective: '1600px' }}>
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          opacity,
          clipPath,
          transformStyle: 'preserve-3d',
        }}
        className="relative will-change-transform"
      >
        {/* Scroll-Scrubbed Section Gate Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.26em] text-ivory/45 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
              />
              <span>
                SECTOR {sectionNumber} // {sectionTag}
              </span>
            </div>
            <span>SCROLL TELEMETRY // ACTIVE</span>
          </div>
          <div className="w-full h-[1px] bg-ivory/10 relative overflow-hidden">
            <motion.div
              style={{ width: beamWidth, backgroundColor: accent }}
              className="h-full shadow-[0_0_12px_#C8FF32]"
            />
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scroll-scrubbed dual-direction kinetic typography & portal aperture divider
 * between foreground sections.
 */
export function ScrollKineticRibbon({
  topText = 'ACTIVE PORTAL STREAM // 60FPS WEBGL CHOREOGRAPHY //',
  bottomText = 'VESPERA DIGITAL LAB // SUB-SECOND EDGE ARCHITECTURE //',
  accent = '#C8FF32',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ['8%', '-22%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-22%', '8%']);
  const rotateReticle = useTransform(scrollYProgress, [0, 1], [0, 270]);
  const scaleGate = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.15, 0.7]);

  return (
    <div
      ref={ref}
      className="relative py-10 sm:py-14 overflow-hidden select-none border-y border-ivory/10 bg-obsidian/55 backdrop-blur-sm"
    >
      {/* Top Scroll-Linked Kinetic Line */}
      <motion.div
        style={{ x: xLeft }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform mb-3"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tighter uppercase text-ivory/15">
              {topText}
            </span>
            <motion.span
              style={{ rotate: rotateReticle, scale: scaleGate, borderColor: accent }}
              className="w-5 h-5 border-2 inline-block shrink-0"
            />
          </div>
        ))}
      </motion.div>

      {/* Bottom Opposite Scroll-Linked Kinetic Line */}
      <motion.div
        style={{ x: xRight }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span
              className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em]"
              style={{ color: accent }}
            >
              {bottomText}
            </span>
            <span className="w-2 h-2 rounded-full bg-ivory/30 inline-block" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
