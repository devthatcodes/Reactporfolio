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
 * Applies real-time scroll-velocity 3D perspective tilt (rotateX),
 * velocity skew (skewY clamped to [-4.5deg, 4.5deg]), and subtle vertical scale stretch
 * to foreground content as the user scrolls up/down.
 */
export function VelocitySkewWrapper({ children }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 38,
    stiffness: 340,
    mass: 0.4,
  });

  const skewY = useTransform(smoothVelocity, [-2600, 0, 2600], [-4.5, 0, 4.5], {
    clamp: true,
  });
  const rotateX = useTransform(smoothVelocity, [-2600, 0, 2600], [5, 0, -5], {
    clamp: true,
  });
  const scaleY = useTransform(
    smoothVelocity,
    [-2600, 0, 2600],
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
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollPortalSection
 * Wraps major foreground sections so scrolling drives:
 * - On Scroll Entry (0.0 -> 0.28): Unmasks via dynamic clipPath
 *   (inset(14% 6% 14% 6% round 28px) -> inset(0% 0% 0% 0% round 0px)),
 *   3D camera fly-in (scale: 0.86 -> 1, rotateX: 16deg -> 0deg, y: 100 -> 0, opacity: 0 -> 1),
 *   and sweeps a glowing cybernetic scanline across the top edge.
 * - On Scroll Exit (0.75 -> 1.0): Recedes into 3D depth
 *   (scale: 1 -> 0.88, rotateX: 0deg -> -14deg, y: 0 -> -90, opacity: 1 -> 0.15).
 */
export function ScrollPortalSection({
  children,
  sectionCode = 'PORTAL // 01',
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.3,
  });

  // Entry (0.0 -> 0.28) and Exit (0.75 -> 1.0)
  const scale = useTransform(
    smoothProgress,
    [0, 0.28, 0.75, 1],
    [isFirst ? 1 : 0.86, 1, 1, 0.88]
  );
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.28, 0.75, 1],
    [isFirst ? 0 : 16, 0, 0, -14]
  );
  const y = useTransform(
    smoothProgress,
    [0, 0.28, 0.75, 1],
    [isFirst ? 0 : 100, 0, 0, -90]
  );
  const opacity = useTransform(
    smoothProgress,
    [0, 0.22, 0.78, 1],
    [isFirst ? 1 : 0, 1, 1, 0.15]
  );

  // Dynamic clipPath inset unmasking
  const insetTopBottom = useTransform(
    smoothProgress,
    [0, 0.28, 0.76, 1],
    [isFirst ? 0 : 14, 0, 0, 10]
  );
  const insetLeftRight = useTransform(
    smoothProgress,
    [0, 0.28, 0.76, 1],
    [isFirst ? 0 : 6, 0, 0, 5]
  );
  const borderRadius = useTransform(
    smoothProgress,
    [0, 0.28, 0.76, 1],
    [isFirst ? 0 : 28, 0, 0, 24]
  );

  const clipPath = useMotionTemplate`inset(${insetTopBottom}% ${insetLeftRight}% ${insetTopBottom}% ${insetLeftRight}% round ${borderRadius}px)`;

  // Scanline laser sweep across section header on entry
  const scanlineX = useTransform(smoothProgress, [0.02, 0.35], ['-20%', '120%']);
  const scanlineOpacity = useTransform(
    smoothProgress,
    [0.02, 0.16, 0.35],
    [0, 1, 0]
  );

  // Foreground depth frame glow
  const frameGlowOpacity = useTransform(
    smoothProgress,
    [0.05, 0.22, 0.32, 0.75, 0.92],
    [0.85, 0.45, 0, 0, 0.65]
  );

  if (stickySafe) {
    return (
      <div ref={sectionRef} className="relative">
        {/* Top Cybernetic Scanline Header Bar */}
        <div className="pointer-events-none sticky top-16 z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-px w-full overflow-hidden bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent">
            <motion.div
              style={{ left: scanlineX, opacity: scanlineOpacity }}
              className="absolute top-0 h-full w-48 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22D3EE]"
            />
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      style={{ perspective: '1600px' }}
      className="relative"
    >
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          opacity,
          clipPath,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top',
        }}
        className="relative will-change-transform"
      >
        {/* Top Cybernetic Scanline Unmask Sweep */}
        <div className="pointer-events-none relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
              />
              <span className="text-zinc-400">{sectionCode}</span>
            </span>
            <span className="hidden sm:inline text-zinc-500">
              3D PORTAL STAGE // {sectionLabel}
            </span>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#27272A]/60">
            <motion.div
              style={{ left: scanlineX, opacity: scanlineOpacity }}
              className="absolute -top-1 h-3 w-56 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[1px]"
            />
          </div>
        </div>

        {/* Dynamic 3D Portal Frame Border Overlay during entry/exit transition */}
        <motion.div
          style={{ opacity: frameGlowOpacity }}
          className="pointer-events-none absolute inset-x-4 inset-y-2 z-20 rounded-3xl border border-cyan-400/30 shadow-[inset_0_0_50px_rgba(34,211,238,0.08)] sm:inset-x-8"
        />

        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollKineticBanner
 * Giant scroll-scrubbed dual-direction kinetic typography divider between sections.
 * Moves left/right in opposite directions mapped to scrollYProgress with glowing progress bars
 * and rotating geometric crosshairs.
 */
export function ScrollKineticBanner({
  primaryText = 'AUTONOMOUS NEURAL FABRIC // ZERO-COPY TENSOR STREAMING // SUB-4MS FAILOVER',
  secondaryText = 'SEMANTIC VECTOR CACHE // OPENTELEMETRY NATIVE // CRYPTOGRAPHIC ENCLAVE',
  code = 'TRANSITION // KINETIC STREAM',
  accent = '#22D3EE',
}) {
  const bannerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.25,
  });

  const xLeft = useTransform(smoothProgress, [0, 1], ['8%', '-28%']);
  const xRight = useTransform(smoothProgress, [0, 1], ['-28%', '8%']);
  const rotateCrosshair = useTransform(smoothProgress, [0, 1], [0, 270]);
  const progressWidth = useTransform(smoothProgress, [0.1, 0.9], ['0%', '100%']);
  const tiltBanner = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -10]);
  const bannerScale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1.02, 0.94]);

  return (
    <div
      ref={bannerRef}
      style={{ perspective: '1200px' }}
      className="relative overflow-hidden border-y border-[#27272A]/80 bg-[#09090B]/85 py-7 backdrop-blur-md select-none"
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${accent}22, transparent 70%)`,
        }}
      />

      {/* Top HUD Metadata & Scroll Progress Bar */}
      <div className="mx-auto mb-3 flex max-w-7xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <motion.div
            style={{ rotate: rotateCrosshair }}
            className="flex h-4 w-4 items-center justify-center rounded border border-cyan-400/50 text-cyan-300"
          >
            <span className="block h-1.5 w-1.5 bg-cyan-400" />
          </motion.div>
          <span className="text-cyan-300">{code}</span>
        </div>

        <div className="hidden w-48 overflow-hidden rounded-full bg-[#18181D] h-1 sm:block">
          <motion.div
            style={{ width: progressWidth }}
            className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399]"
          />
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <span>Z-AXIS SCRUB ACTIVE</span>
          <motion.span
            style={{ rotate: rotateCrosshair }}
            className="inline-block text-cyan-400"
          >
            ✦
          </motion.span>
        </div>
      </div>

      {/* Dual-Direction 3D Kinetic Typography Tracks */}
      <motion.div
        style={{
          rotateX: tiltBanner,
          scale: bannerScale,
          transformStyle: 'preserve-3d',
        }}
        className="space-y-1.5"
      >
        {/* Track 1: Moves Left */}
        <motion.div
          style={{ x: xLeft }}
          className="flex whitespace-nowrap font-extrabold tracking-tight text-2xl sm:text-4xl lg:text-5xl"
        >
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className="mx-4 bg-gradient-to-r from-[#FAFAFA] via-cyan-200 to-zinc-500 bg-clip-text text-transparent opacity-90"
            >
              {primaryText} <span className="text-cyan-400 mx-3">•</span>
            </span>
          ))}
        </motion.div>

        {/* Track 2: Moves Right (Outline / Cybernetic Monospace) */}
        <motion.div
          style={{ x: xRight }}
          className="flex whitespace-nowrap font-mono text-sm sm:text-base tracking-[0.25em] uppercase text-zinc-500"
        >
          {[0, 1, 2, 3].map((idx) => (
            <span key={idx} className="mx-4 flex items-center gap-3">
              <span className="text-violet-400/90">[STREAMLOCK]</span>
              <span>{secondaryText}</span>
              <span className="text-cyan-400">///</span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
