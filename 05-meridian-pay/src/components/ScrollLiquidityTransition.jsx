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
 * Applies real-time scroll-velocity 3D perspective tilt (rotateX) and velocity skew (skewY)
 * to the foreground content as the user scrolls, giving the page a physical Active Theory camera-rig feel.
 */
export function VelocitySkewWrapper({ children }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 38,
    stiffness: 340,
    mass: 0.4,
  });

  const skewY = useTransform(smoothVelocity, [-2400, 0, 2400], [-4.5, 0, 4.5], {
    clamp: true,
  });
  const rotateX = useTransform(smoothVelocity, [-2400, 0, 2400], [3.2, 0, -3.2], {
    clamp: true,
  });
  const scale = useTransform(smoothVelocity, [-2400, 0, 2400], [0.985, 1, 0.985], {
    clamp: true,
  });

  return (
    <div style={{ perspective: '1600px' }} className="w-full">
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
 * Wraps each major section so scrolling drives a 3D camera fly-through transition:
 * - Entry (0.0 -> 0.28): Unmasks via dynamic clipPath, rises from 3D depth (scale 0.86 -> 1, rotateX 16deg -> 0deg, y 100 -> 0),
 *   and sweeps a quantum emerald laser bar across the section header.
 * - Exit (0.75 -> 1.0): Recedes into 3D space (scale 1 -> 0.88, rotateX 0deg -> -14deg, y 0 -> -90, opacity 1 -> 0.15)
 *   as the next section scrolls up over it.
 */
export function ScrollPortalSection({
  children,
  sectionIndex = '01',
  portalLabel = 'QUANTUM LIQUIDITY GATE',
  accentColor = '#10B981',
  isFirst = false,
  isTallTunnel = false,
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.35,
  });

  // Entry & exit keyframes adapted for first section and tall sticky tunnel section
  const entryEnd = isFirst ? 0.01 : isTallTunnel ? 0.14 : 0.28;
  const exitStart = isTallTunnel ? 0.88 : 0.75;

  const scale = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 1 : 0.86, 1, 1, 0.88]
  );

  const rotateX = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 0 : 16, 0, 0, -14]
  );

  const y = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 0 : 100, 0, 0, -90]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, isFirst ? 0.01 : entryEnd * 0.85, exitStart, 1],
    [isFirst ? 1 : 0.08, 1, 1, 0.15]
  );

  // Dynamic Clip-Path portal aperture unmasking
  const clipInsetY = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 0 : 14, 0, 0, 8]
  );
  const clipInsetX = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 0 : 6, 0, 0, 4]
  );
  const clipRadius = useTransform(
    smoothProgress,
    [0, entryEnd, exitStart, 1],
    [isFirst ? 0 : 28, 0, 0, 24]
  );

  const clipPath = useMotionTemplate`inset(${clipInsetY}% ${clipInsetX}% ${clipInsetY}% ${clipInsetX}% round ${clipRadius}px)`;

  // Quantum laser scanbar sweep across the section on scroll entry
  const laserX = useTransform(smoothProgress, [0, entryEnd * 1.15], ['-25%', '115%']);
  const laserOpacity = useTransform(
    smoothProgress,
    [0, entryEnd * 0.4, entryEnd * 1.15],
    [0, 1, 0]
  );

  // Multi-layer foreground parallax telemetry rails on left/right edges
  const parallaxFastY = useTransform(smoothProgress, [0, 1], [140, -140]);
  const parallaxReverseY = useTransform(smoothProgress, [0, 1], [-90, 90]);

  return (
    <div
      ref={sectionRef}
      style={{ perspective: '1600px' }}
      className="relative w-full"
    >
      {/* Floating Foreground Parallax Telemetry Markers (moves at 2x scroll speed) */}
      <motion.div
        style={{ y: parallaxFastY }}
        className="pointer-events-none hidden xl:flex flex-col items-start gap-1.5 absolute left-5 top-1/3 z-30 select-none"
      >
        <div className="px-2.5 py-1 rounded-md bg-[#030712]/90 border border-[#10B981]/35 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#10B981]">
            PORTAL // {sectionIndex}
          </div>
          <div className="text-[10px] font-mono text-slate-300 font-semibold">
            {portalLabel}
          </div>
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-[#10B981]/60 to-transparent ml-3" />
      </motion.div>

      <motion.div
        style={{ y: parallaxReverseY }}
        className="pointer-events-none hidden xl:flex flex-col items-end gap-1.5 absolute right-5 top-1/2 z-30 select-none"
      >
        <div className="px-2.5 py-1 rounded-md bg-[#030712]/90 border border-cyan-400/30 backdrop-blur-md">
          <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-400">
            Z-DEPTH VECTOR // LOCKED
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{
          scale,
          rotateX,
          y,
          opacity,
          clipPath: isTallTunnel ? undefined : clipPath,
          transformOrigin: 'center top',
          transformStyle: 'preserve-3d',
          willChange: 'transform, clip-path, opacity',
        }}
        className="relative w-full"
      >
        {/* Top Quantum Laser Scanline Sweep on Section Entry */}
        <motion.div
          style={{ opacity: laserOpacity }}
          className="pointer-events-none absolute top-0 inset-x-0 h-[3px] z-40 overflow-hidden"
        >
          <motion.div
            style={{
              left: laserX,
              background: `linear-gradient(90deg, transparent, ${accentColor}, #06B6D4, transparent)`,
            }}
            className="absolute top-0 w-1/2 h-full shadow-[0_0_25px_#10B981]"
          />
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollQuantumTicker
 * Giant scroll-scrubbed dual-direction kinetic typography & live FX corridor divider
 * between sections. Physically scrubs left/right in 3D space as the user scrolls.
 */
export function ScrollQuantumTicker({
  primaryText = 'ATOMIC SETTLEMENT // ZERO CORRESPONDENT HOPS // 38MS FINALITY',
  secondaryText = 'JPY ⇄ GBP 0.005194 · USD ⇄ EUR 0.9214 · USDC ⇄ SEPA 1.0000 · T-BILL REPO 4.85% APY',
  accent = '#10B981',
}) {
  const tickerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: tickerRef,
    offset: ['start end', 'end start'],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-28%', '8%']);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-1.4, 0, 1.4]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);

  return (
    <div
      ref={tickerRef}
      style={{ perspective: '1200px' }}
      className="relative py-8 sm:py-11 overflow-hidden border-y border-white/10 bg-[#030712]/85 backdrop-blur-xl select-none z-20"
    >
      {/* Center Radial Quantum Glow */}
      <motion.div
        style={{ scale: glowScale }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[520px] h-20 rounded-full blur-3xl opacity-25"
          style={{ background: accent }}
        />
      </motion.div>

      <motion.div style={{ rotateZ }} className="space-y-2.5">
        {/* Track 1: Giant Kinetic Outline & Solid Headline Scrubbing Left */}
        <motion.div
          style={{ x: xLeft }}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform"
        >
          {[0, 1, 2].map((rep) => (
            <div key={rep} className="flex items-center gap-8">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-white/90">
                {primaryText}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border"
                style={{
                  color: accent,
                  borderColor: `${accent}66`,
                  backgroundColor: `${accent}18`,
                }}
              >
                SCROLL-LOCKED // 3D RAIL
              </span>
            </div>
          ))}
        </motion.div>

        {/* Track 2: Monospace Telemetry Stream Scrubbing Right */}
        <motion.div
          style={{ x: xRight }}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform"
        >
          {[0, 1, 2, 3].map((rep) => (
            <div key={rep} className="flex items-center gap-6">
              <span className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-cyan-400/90">
                {secondaryText}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
