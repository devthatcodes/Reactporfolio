import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollPortalSection — Meridian Zero-Lag "Ledger Unfold Reveal"
 * Uses strictly GPU-composited properties (translateY, scale, opacity, scaleX)
 * with zero clip-path, zero 3D skew, and zero blur repaints for locked 60/120fps scrolling.
 */
export function ScrollPortalSection({
  children,
  sectionIndex = '01',
  portalLabel = 'QUANTUM LIQUIDITY GATE',
  accentColor = '#10B981',
  isFirst = false,
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.94', 'start 0.22'],
  });

  // Pure GPU-composited Ledger Unfold Reveal: y [40 -> 0], scale [0.97 -> 1], opacity [0.15 -> 1]
  const y = useTransform(scrollYProgress, [0, 1], [isFirst ? 0 : 40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.15, 1]);
  const ledgerRuleScaleX = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.08, 1]);

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* Side Institutional Ledger Index Tab (Desktop) */}
      <div className="pointer-events-none hidden 2xl:flex flex-col items-start gap-1.5 absolute left-5 top-16 z-20 select-none">
        <div className="px-2.5 py-1 rounded-md bg-[#050B18] border border-[#10B981]/35">
          <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#10B981]">
            LEDGER // {sectionIndex}
          </div>
          <div className="text-[10px] font-mono text-slate-300 font-semibold">
            {portalLabel}
          </div>
        </div>
      </div>

      {/* Top Precision GPU scaleX Ledger Seam Line */}
      {!isFirst && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{
              scaleX: ledgerRuleScaleX,
              transformOrigin: 'left center',
              willChange: 'transform',
              background: `linear-gradient(90deg, ${accentColor}, #06B6D4, transparent)`,
            }}
            className="h-[2px] w-full opacity-75"
          />
        </div>
      )}

      <motion.div
        style={{
          y,
          scale,
          opacity,
          willChange: 'transform, opacity',
        }}
        className="relative w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollQuantumTicker — High-Speed GPU translateX Institutional FX Ticker Strip
 * Scrubs horizontally via pure GPU translate3d without blur or layout thrashing.
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

  const xLeft = useTransform(scrollYProgress, [0, 1], ['4%', '-18%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-18%', '4%']);

  return (
    <div
      ref={tickerRef}
      className="relative py-6 sm:py-8 overflow-hidden border-y border-white/10 bg-[#040915] select-none z-20"
    >
      <div className="space-y-2">
        {/* Track 1: Primary Institutional Settlement Headline Scrubbing Left */}
        <motion.div
          style={{ x: xLeft, willChange: 'transform' }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {[0, 1, 2].map((rep) => (
            <div key={rep} className="flex items-center gap-8">
              <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase text-white/90">
                {primaryText}
              </span>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest border"
                style={{
                  color: accent,
                  borderColor: `${accent}66`,
                  backgroundColor: `${accent}15`,
                }}
              >
                FX LEDGER RAIL // LOCKED
              </span>
            </div>
          ))}
        </motion.div>

        {/* Track 2: Live FX Rate Telemetry Strip Scrubbing Right */}
        <motion.div
          style={{ x: xRight, willChange: 'transform' }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {[0, 1, 2, 3].map((rep) => (
            <div key={rep} className="flex items-center gap-6">
              <span className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-cyan-400/90">
                {secondaryText}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
