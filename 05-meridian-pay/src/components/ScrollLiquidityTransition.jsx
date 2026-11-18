import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CURRENCY_HUBS = [
  { code: 'USD', hub: 'NEW YORK · FEDWIRE', rate: '1.0000', x: '10%' },
  { code: 'EUR', hub: 'FRANKFURT · TARGET2', rate: '0.9214', x: '30%' },
  { code: 'GBP', hub: 'LONDON · CHAPS RTGS', rate: '0.7865', x: '50%' },
  { code: 'JPY', hub: 'TOKYO · BOJ ZENGIN', rate: '151.42', x: '70%' },
  { code: 'SGD', hub: 'SINGAPORE · MAS MEPS+', rate: '1.3418', x: '90%' },
];

/**
 * ScrollPortalSection — Meridian Zero-Lag "Ledger Unfold Reveal"
 * Uses strictly GPU-composited properties (translateY, scale, opacity, scaleX)
 * for locked 60/120fps scrolling.
 */
export function ScrollPortalSection({
  children,
  sectionIndex = '01',
  portalLabel = 'INSTITUTIONAL LIQUIDITY GATE',
  accentColor = '#10B981',
  isFirst = false,
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.94', 'start 0.22'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [isFirst ? 0 : 32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.985, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.2, 1]);
  const ledgerRuleScaleX = useTransform(scrollYProgress, [0, 1], [isFirst ? 1 : 0.08, 1]);

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* Side Institutional Ledger Index Tab (Desktop) */}
      <div className="pointer-events-none hidden 2xl:flex flex-col items-start gap-1.5 absolute left-5 top-16 z-20 select-none">
        <div className="px-2.5 py-1 rounded-md bg-[#050B18] border border-white/10">
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
            className="h-[1px] w-full opacity-75"
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
 * ScrollLiquidityBridge — Live SVG Multi-Currency Settlement Bridge
 * Renders USD -> EUR -> GBP -> JPY -> SGD central bank clearing nodes where
 * glowing emerald liquidity pulses travel along curved SVG bezier arcs as you scroll.
 */
export function ScrollLiquidityBridge({
  corridorTag = 'MULTI-CURRENCY RTGS SETTLEMENT BRIDGE',
  volumeLabel = '$48.2B DAILY ATOMIC CLEARING',
  accent = '#10B981',
}) {
  const bridgeRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bridgeRef,
    offset: ['start end', 'end start'],
  });

  const pulseProgress1 = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pulseProgress2 = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const packetTranslateX = useTransform(scrollYProgress, [0, 1], ['6%', '92%']);

  return (
    <div
      ref={bridgeRef}
      className="relative py-8 sm:py-10 overflow-hidden border-y border-white/10 bg-[#040915]/95 select-none z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <span className="uppercase tracking-[0.2em] text-white/90 font-semibold">
              {corridorTag}
            </span>
          </div>
          <div className="text-cyan-400 uppercase tracking-widest font-semibold">
            {volumeLabel}
          </div>
        </div>

        {/* Curved SVG Bezier Multi-Currency Settlement Arcs */}
        <div className="relative h-24 sm:h-28 w-full">
          <svg
            viewBox="0 0 1000 110"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="meridianBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Base Structural Bezier Corridors */}
            <path
              d="M 100 78 Q 200 18 300 78 Q 400 18 500 78 Q 600 18 700 78 Q 800 18 900 78"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 100 78 C 260 6, 740 6, 900 78"
              fill="none"
              stroke="rgba(6,182,212,0.14)"
              strokeWidth="1"
            />

            {/* Scroll-Driven Glowing Emerald Liquidity Pulse Arc */}
            <motion.path
              d="M 100 78 Q 200 18 300 78 Q 400 18 500 78 Q 600 18 700 78 Q 800 18 900 78"
              fill="none"
              stroke="url(#meridianBridgeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: pulseProgress1 }}
            />

            {/* Long-Haul Direct Cross-Border Express Arc */}
            <motion.path
              d="M 100 78 C 260 6, 740 6, 900 78"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.75"
              strokeLinecap="round"
              style={{ pathLength: pulseProgress2, opacity: 0.7 }}
            />

            {/* Node Anchor Dots */}
            {[100, 300, 500, 700, 900].map((cx, i) => (
              <g key={cx}>
                <circle
                  cx={cx}
                  cy="78"
                  r="6"
                  fill="#030712"
                  stroke={i % 2 === 0 ? '#10B981' : '#06B6D4'}
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy="78"
                  r="2.5"
                  fill={i % 2 === 0 ? '#10B981' : '#06B6D4'}
                />
              </g>
            ))}
          </svg>

          {/* Scroll-Scrubbed Liquidity Tranche Packet Indicator */}
          <motion.div
            style={{ left: packetTranslateX, willChange: 'left' }}
            className="pointer-events-none absolute top-2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 text-[10px] font-mono font-bold text-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.3)] whitespace-nowrap"
          >
            ATOMIC TRANCHE · T+0
          </motion.div>

          {/* 5 Currency Hub Readouts */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            {CURRENCY_HUBS.map((node, i) => (
              <div key={node.code} className="text-center">
                <div className="inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-white">
                  <span>{node.code}</span>
                  {i < CURRENCY_HUBS.length - 1 && (
                    <span className="text-[#10B981] text-[10px] ml-1">→</span>
                  )}
                </div>
                <div className="hidden sm:block text-[10px] font-mono text-slate-400 truncate">
                  {node.hub}
                </div>
                <div className="text-[10px] font-mono text-[#10B981] tabular-nums">
                  {node.rate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
