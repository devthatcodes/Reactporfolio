import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * NeuralCircuitConduit
 * Interactive SVG Neural Circuit Connector between sections.
 * Glowing cyan/violet data packets flow downward along branched circuit traces
 * while `useScroll` drives the SVG circuit fill path from top to bottom.
 */
export function NeuralCircuitConduit({
  code = 'BUS // 01 → 02',
  label = 'SYNAPTIC ROUTING CONDUIT',
  accent = '#22D3EE',
  secondary = '#8B5CF6',
}) {
  const conduitRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: conduitRef,
    offset: ['start 90%', 'end 30%'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const nodeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.15, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.15, 0.9, 1]);

  return (
    <div
      ref={conduitRef}
      className="relative mx-auto flex max-w-4xl flex-col items-center justify-center py-4 select-none"
    >
      {/* Top Micro Telemetry Pill */}
      <motion.div
        style={{ opacity: glowOpacity, scale: nodeScale }}
        className="z-10 flex items-center gap-2 rounded-full border border-[#27272A] bg-[#090D16]/95 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-zinc-400 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 8px ${accent}`,
          }}
        />
        <span className="text-zinc-200">{code}</span>
        <span className="hidden text-zinc-600 sm:inline">//</span>
        <span className="hidden text-cyan-300/80 sm:inline">{label}</span>
      </motion.div>

      {/* Branched SVG Neural Circuit Trace */}
      <div className="relative -my-1 h-28 w-full max-w-[360px]">
        <svg
          viewBox="0 0 360 112"
          fill="none"
          className="h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`circuit-grad-${code.replace(/\s+/g, '')}`}
              x1="180"
              y1="0"
              x2="180"
              y2="112"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={accent} />
              <stop offset="55%" stopColor={secondary} />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>

          {/* Base Unlit Circuit Tracks */}
          <path
            d="M 180 0 L 180 112"
            stroke="#1F1F26"
            strokeWidth="1.5"
          />
          <path
            d="M 180 22 L 104 46 L 104 78 L 180 98"
            stroke="#1F1F26"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M 180 22 L 256 46 L 256 78 L 180 98"
            stroke="#1F1F26"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />

          {/* Scroll-Driven Primary Center Trunk */}
          <motion.path
            d="M 180 0 L 180 112"
            stroke={`url(#circuit-grad-${code.replace(/\s+/g, '')})`}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength }}
          />

          {/* Scroll-Driven Left Synaptic Branch */}
          <motion.path
            d="M 180 22 L 104 46 L 104 78 L 180 98"
            stroke={accent}
            strokeWidth="1.4"
            strokeOpacity="0.7"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* Scroll-Driven Right Synaptic Branch */}
          <motion.path
            d="M 180 22 L 256 46 L 256 78 L 180 98"
            stroke={secondary}
            strokeWidth="1.4"
            strokeOpacity="0.7"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* Continuous High-Speed Data Packet Pulses (stroke-dashoffset / animateMotion) */}
          <circle r="2.5" fill={accent}>
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path="M 180 0 L 180 112"
            />
          </circle>
          <circle r="2" fill={secondary}>
            <animateMotion
              dur="2.3s"
              repeatCount="indefinite"
              path="M 180 22 L 104 46 L 104 78 L 180 98"
            />
          </circle>
          <circle r="2" fill={accent}>
            <animateMotion
              dur="2.3s"
              begin="0.9s"
              repeatCount="indefinite"
              path="M 180 22 L 256 46 L 256 78 L 180 98"
            />
          </circle>

          {/* Circuit Junction Nodes */}
          <circle cx="180" cy="22" r="3" fill="#09090B" stroke={accent} strokeWidth="1.5" />
          <circle cx="104" cy="62" r="2.5" fill="#09090B" stroke={accent} strokeWidth="1.5" />
          <circle cx="256" cy="62" r="2.5" fill="#09090B" stroke={secondary} strokeWidth="1.5" />
          <circle cx="180" cy="98" r="3" fill="#09090B" stroke={secondary} strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

/**
 * ScrollPortalSection
 * Wraps sections in a clean 3D Perspective Horizon Unfold (`opacity`, `y: [44, 0]`, `scale: [0.96, 1]`)
 * with a glowing top border edge that illuminates as the circuit beam reaches it.
 */
export function ScrollPortalSection({
  children,
  sectionCode = 'NODE // 01',
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

  // 3D Perspective Horizon Unfold on scroll entry
  const y = useTransform(
    scrollYProgress,
    [0, 0.22, 0.88, 1],
    [isFirst ? 0 : 44, 0, 0, -18]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.88, 1],
    [isFirst ? 1 : 0.96, 1, 1, 0.985]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.9, 1],
    [isFirst ? 1 : 0.22, 1, 1, 0.65]
  );

  // Glowing top horizon edge that illuminates as the circuit beam reaches the section
  const beamScaleX = useTransform(scrollYProgress, [0.02, 0.35], [0.08, 1]);
  const beamOpacity = useTransform(scrollYProgress, [0.02, 0.25, 0.9], [0.2, 1, 0.35]);

  if (stickySafe) {
    return (
      <div ref={sectionRef} className="relative">
        <div className="pointer-events-none mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
              <span className="text-zinc-200">{sectionCode}</span>
            </span>
            <span className="hidden text-zinc-500 sm:inline">
              NEURAL TOPOLOGY DECK // {sectionLabel}
            </span>
          </div>
          <div className="relative h-[1px] w-full overflow-hidden bg-[#18181D]">
            <motion.div
              style={{
                scaleX: beamScaleX,
                opacity: beamOpacity,
                transformOrigin: 'center',
                background: `linear-gradient(90deg, transparent, ${accentColor}, #8B5CF6, transparent)`,
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
        {!isFirst && (
          <div className="pointer-events-none relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
                <span className="text-zinc-300">{sectionCode}</span>
              </span>
              <span className="hidden text-zinc-500 sm:inline">
                HORIZON NODE // {sectionLabel}
              </span>
            </div>
            {/* Glowing Top Horizon Border Edge */}
            <div className="relative h-[1px] w-full overflow-hidden rounded-full bg-[#18181D]">
              <motion.div
                style={{
                  scaleX: beamScaleX,
                  opacity: beamOpacity,
                  transformOrigin: 'center',
                  background: `linear-gradient(90deg, transparent, ${accentColor}, #8B5CF6, transparent)`,
                }}
                className="h-full w-full will-change-transform"
              />
            </div>
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
}
