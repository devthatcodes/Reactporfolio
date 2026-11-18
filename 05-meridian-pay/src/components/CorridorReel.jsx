import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe2,
  X,
  Play,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const CORRIDORS = [
  {
    id: 'tyo-ldn',
    index: '01',
    code: 'CORRIDOR // TYO-LDN-01',
    title: 'TOKYO–LONDON INSTANT FX BRIDGE',
    subtitle: 'ZENGIN ⇄ CHAPS ATOMIC LIQUIDITY ENGINE',
    pair: 'JPY ⇄ GBP',
    latency: '38ms',
    volume: '$14.8B / MO',
    spread: '0.01% FLAT',
    accent: '#10B981',
    secondary: '#06B6D4',
    nodes: ['BOJ-ZENGIN-TYO', 'SGX-CLEARING-SIN', 'LCH-QUANTUM-LDN', 'BOE-RTGS-LDN'],
    summary:
      'Eliminates 48-hour correspondent Nostro/Vostro pre-funding between Tokyo and London through an atomic dual-pool liquidity bridge with real-time ISO-20022 cryptographic finality.',
    metrics: [
      { label: 'Settlement Finality', value: '38.4 ms' },
      { label: 'Correspondent Hop Count', value: '0 Hops (Direct)' },
      { label: 'Capital Freed from Nostro', value: '$185M / Entity' },
    ],
    isoPayload: `{
  "msg_id": "MRDN-TYOLDN-2026-99481A",
  "corridor": "JPY_GBP_ATOMIC_BRIDGE",
  "settlement_rail": "ZENGIN_CHAPS_DIRECT",
  "fx_rate_locked": 0.005194,
  "spread_bps": 1.0,
  "zk_quorum_proof": "0x9f8c...44e1a0b"
}`,
  },
  {
    id: 'autonomous-sweep',
    index: '02',
    code: 'CORRIDOR // NYC-ZRH-02',
    title: 'AUTONOMOUS MULTI-ENTITY SWEEP',
    subtitle: 'ZERO-IDLE CASH OVERNIGHT U.S. T-BILL REPO ENGINE',
    pair: 'USD ⇄ EUR ⇄ CHF',
    latency: '112ms',
    volume: '$22.4B / MO',
    spread: '4.85% APY',
    accent: '#06B6D4',
    secondary: '#3B82F6',
    nodes: ['OPERATING-SUB-42', 'ZURICH-CONSOLIDATOR', 'FEDWIRE-NYC', 'BLACKROCK-T-BILL-VAULT'],
    summary:
      'Continuously monitors 42+ global subsidiary bank accounts and autonomously sweeps idle operating liquidity at 16:00 EST into SIPC-insured U.S. Treasury repositories with instant T+0 recall.',
    metrics: [
      { label: 'Net Yield Uplift', value: '+485 bps APY' },
      { label: 'Subsidiary Entities Synced', value: '42 Global Entities' },
      { label: 'Recall Liquidity Window', value: 'Instant T+0' },
    ],
    isoPayload: `{
  "msg_id": "MRDN-SWEEP-2026-77310C",
  "corridor": "MULTI_ENTITY_TBILL_REPO",
  "entities_swept": 42,
  "annualized_yield": "4.85%",
  "custodian": "TIER1_US_TREASURY_VAULT",
  "zk_quorum_proof": "0x4a2d...89c3f12"
}`,
  },
  {
    id: 'programmable-mint',
    index: '03',
    code: 'CORRIDOR // SIN-FRA-03',
    title: 'PROGRAMMABLE TREASURY MINT',
    subtitle: '24/7/365 ON-CHAIN & FIAT HYBRID LIQUIDITY POOL',
    pair: 'USDC ⇄ EURC ⇄ SEPA',
    latency: '19ms',
    volume: '$8.9B / MO',
    spread: '0.005% SWAP',
    accent: '#3B82F6',
    secondary: '#10B981',
    nodes: ['TREASURY-API-WEBHOOK', 'MERIDIAN-MINT-CORE', 'EUROSYSTEM-TARGET2', 'SEPA-INSTANT-FRA'],
    summary:
      'Bridges weekend and holiday bank closures by minting programmable institutional settlement tokens backed 1:1 by central bank reserves, settling directly into SEPA Instant.',
    metrics: [
      { label: 'Uptime Availability', value: '24 / 7 / 365' },
      { label: 'Smart Routing Slippage', value: '< 0.005%' },
      { label: 'ERP Reconciliation', value: 'Real-Time NetSuite' },
    ],
    isoPayload: `{
  "msg_id": "MRDN-MINT-2026-55109E",
  "corridor": "HYBRID_TOKENIZED_SEPA",
  "collateral_ratio": "100.00%_TIER1_CASH",
  "rail_target": "SEPA_INSTANT_RT1",
  "settlement_ms": 19,
  "zk_quorum_proof": "0x7c1e...30b9d44"
}`,
  },
  {
    id: 'sovereign-rail',
    index: '04',
    code: 'CORRIDOR // GLOBAL-ZK-04',
    title: 'SOVEREIGN ZERO-LATENCY RAIL',
    subtitle: 'FIPS 140-3 HSM & ZERO-KNOWLEDGE COMPLIANCE MESH',
    pair: '140+ CURRENCIES',
    latency: '42ms',
    volume: '$31.6B / MO',
    spread: 'ZERO WIRE FEE',
    accent: '#10B981',
    secondary: '#8B5CF6',
    nodes: ['HSM-ENCLAVE-01', 'ZK-AML-VERIFIER', 'MPC-QUORUM-SIGNER', 'GLOBAL-RTGS-MESH'],
    summary:
      'Enforces cryptographic multi-party CFO approval quorums and automated OFAC/AML zero-knowledge proofs before dispatching sub-second payouts across 140+ local payment rails.',
    metrics: [
      { label: 'Cryptographic Standard', value: 'FIPS 140-3 Level 4' },
      { label: 'Local Rails Integrated', value: '140+ Currencies' },
      { label: 'Audit Trail Integrity', value: 'Immutable ZK-Proof' },
    ],
    isoPayload: `{
  "msg_id": "MRDN-SOV-2026-11904Z",
  "corridor": "GLOBAL_RTGS_ZK_MESH",
  "mpc_quorum": "3_OF_3_HARDWARE_KEYS",
  "compliance_check": "ZK_AML_PASSED_4ms",
  "currencies_enabled": 142,
  "zk_quorum_proof": "0x1d8a...f72c901"
}`,
  },
];

/**
 * CorridorLedgerCard — Individual Right-Column Settlement Corridor Card
 * Smoothly slides in via pure GPU translateX, scale, and opacity as it enters the viewport.
 */
function CorridorLedgerCard({ corridor, idx, isFocused, onFocus, onOpenPortal }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.95', 'start 0.35'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  return (
    <motion.article
      ref={cardRef}
      id={`corridor-card-${corridor.id}`}
      style={{ x, scale, opacity, willChange: 'transform, opacity' }}
      onMouseEnter={() => {
        soundEngine.playHover(1 + idx * 0.06);
        onFocus(idx);
      }}
      onClick={() => onOpenPortal(corridor, idx)}
      data-cursor="LAUNCH VAULT PORTAL"
      className={`relative rounded-3xl p-6 sm:p-8 border transition-colors cursor-pointer overflow-hidden group ${
        isFocused
          ? 'bg-[#081121] border-[#10B981]/70 shadow-[0_20px_50px_rgba(0,0,0,0.65)]'
          : 'bg-[#060C18] border-white/10 hover:border-[#10B981]/45'
      }`}
    >
      {/* Subtle SVG Corridor Vector Topology */}
      <svg
        className="absolute right-0 top-0 w-72 h-52 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        viewBox="0 0 320 220"
        fill="none"
      >
        <circle
          cx="230"
          cy="95"
          r="76"
          stroke={corridor.accent}
          strokeWidth="1"
          strokeDasharray="5 5"
        />
        <path
          d="M 10 190 Q 140 40 280 95"
          stroke={corridor.accent}
          strokeWidth="2"
        />
        <circle cx="10" cy="190" r="4" fill={corridor.accent} />
        <circle cx="145" cy="105" r="4" fill={corridor.secondary} />
        <circle cx="280" cy="95" r="6" fill={corridor.accent} />
      </svg>

      {/* Top Corridor Index & Pair Pill */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="px-2.5 py-1 rounded-md font-mono text-xs font-bold"
            style={{
              backgroundColor: `${corridor.accent}20`,
              color: corridor.accent,
            }}
          >
            {corridor.index} // LEDGER
          </span>
          <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
            {corridor.code}
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-xs font-mono text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>{corridor.pair}</span>
        </div>
      </div>

      {/* Corridor Title & Summary */}
      <div className="relative z-10">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-1.5">
          {corridor.subtitle}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#10B981] transition-colors">
          {corridor.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-300 mt-2.5 leading-relaxed">
          {corridor.summary}
        </p>

        {/* 4-Hop Node Pill Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {corridor.nodes.map((node, i) => (
            <span
              key={node}
              className="px-2.5 py-1 rounded-lg bg-[#030712] border border-white/10 font-mono text-[11px] text-slate-300"
            >
              <span className="text-[#10B981] mr-1">0{i + 1}</span>
              {node}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Metrics & Vault Launch CTA */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              FINALITY LATENCY
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-white">
              {corridor.latency}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              MONTHLY VOLUME
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-[#10B981]">
              {corridor.volume}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              INSTITUTIONAL SPREAD
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-cyan-400">
              {corridor.spread}
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] text-[#030712] font-mono text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
          <span>Unlock Corridor Vault</span>
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </motion.article>
  );
}

export default function CorridorReel({ onTriggerPortal, onShaderPulse }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [trancheM, setTrancheM] = useState(25);
  const [simulating, setSimulating] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);

  const sectionRef = useRef(null);

  // Pure MotionValue scroll tracking (zero React setState on scroll!)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // GPU-composited orbital ring rotations & scale driven by scrollYProgress
  const outerRingRotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const innerRingRotate = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const orbitalScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.98]);

  const current = CORRIDORS[activeIndex];

  const scrollToCorridorCard = (idx) => {
    soundEngine.playClick();
    if (onShaderPulse) onShaderPulse();
    setActiveIndex(idx);
    const el = document.getElementById(`corridor-card-${CORRIDORS[idx].id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const openCorridorPortal = (corridor, idx) => {
    soundEngine.playPortal();
    if (onShaderPulse) onShaderPulse();
    if (onTriggerPortal) {
      onTriggerPortal(`${corridor.index} // ${corridor.title}`, corridor.code);
    }
    setActiveIndex(idx);
    setSimCompleted(false);
    setSelectedCorridor(corridor);
  };

  const navigateModalCorridor = (dir) => {
    const nextIdx = (activeIndex + dir + CORRIDORS.length) % CORRIDORS.length;
    const nextCorridor = CORRIDORS[nextIdx];
    soundEngine.playPortal();
    if (onShaderPulse) onShaderPulse();
    if (onTriggerPortal) {
      onTriggerPortal(`${nextCorridor.index} // ${nextCorridor.title}`, nextCorridor.code);
    }
    setActiveIndex(nextIdx);
    setSimCompleted(false);
    setSelectedCorridor(nextCorridor);
  };

  const handleRunSimulation = () => {
    soundEngine.playConfirm();
    if (onShaderPulse) onShaderPulse();
    setSimulating(true);
    setSimCompleted(false);
    setTimeout(() => {
      setSimulating(false);
      setSimCompleted(true);
      soundEngine.playConfirm();
    }, 650);
  };

  return (
    <section
      id="corridors"
      ref={sectionRef}
      className="relative py-20 lg:py-28 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-mono uppercase tracking-widest text-[#10B981] mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>02 // SPLIT-SCREEN PINNED GLOBAL SETTLEMENT LEDGER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              <ScrambleText text="Global Liquidity Corridors." />
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Pinned orbital treasury telemetry on the left synchronizes with our 4 flagship
              atomic settlement corridors on the right. Click any corridor to unlock its vault
              simulator.
            </p>
          </div>

          {/* Pure GPU MotionValue Scroll Ledger Progress Bar */}
          <div className="px-4 py-3 rounded-2xl bg-[#070D19] border border-[#10B981]/40 flex items-center gap-3.5 self-start lg:self-auto">
            <Layers className="w-4 h-4 text-[#10B981]" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                LEDGER SCROLL SYNC // 60FPS GPU
              </div>
              <div className="w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1.5">
                <motion.div
                  style={{
                    scaleX: scrollYProgress,
                    transformOrigin: 'left center',
                    willChange: 'transform',
                  }}
                  className="h-full w-full bg-gradient-to-r from-[#10B981] to-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 60fps Split-Screen Sticky Settlement Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (lg:col-span-5 sticky top-24 self-start): Interactive Global Liquidity Orbital Visual & Total Volume Counter */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start space-y-5">
            <div className="rounded-3xl bg-[#060C18] border border-[#10B981]/40 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Top Command Deck Status */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#10B981] font-bold">
                    ORBITAL LIQUIDITY RADAR
                  </span>
                </div>
                <span className="font-mono text-[11px] text-cyan-400">
                  {current.code}
                </span>
              </div>

              {/* GPU-Accelerated Interactive Global Liquidity Orbital Visual */}
              <div className="relative h-56 flex items-center justify-center my-2">
                {/* Outer Scroll-Driven Orbital Ring */}
                <motion.div
                  style={{
                    rotate: outerRingRotate,
                    scale: orbitalScale,
                    willChange: 'transform',
                  }}
                  className="w-48 h-48 rounded-full border border-dashed border-[#10B981]/50 flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] -mt-48 shadow-[0_0_12px_#10B981]" />
                </motion.div>

                {/* Inner Counter-Rotating Orbital Ring */}
                <motion.div
                  style={{
                    rotate: innerRingRotate,
                    willChange: 'transform',
                  }}
                  className="absolute w-36 h-36 rounded-full border border-cyan-400/40 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 -ml-36 shadow-[0_0_10px_#06B6D4]" />
                </motion.div>

                {/* Center Total Volume Counter & Active Pair */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
                    TOTAL CORRIDOR VOLUME
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                    $77.7B<span className="text-xs text-[#10B981] ml-1">/MO</span>
                  </div>
                  <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 font-mono text-[10px] text-[#10B981] font-bold">
                    FOCUS: {current.pair} ({current.latency})
                  </div>
                </div>
              </div>

              {/* Active Corridor Quick Telemetry Readout */}
              <div className="p-4 rounded-2xl bg-[#030712] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">SELECTED RAIL</span>
                  <span className="text-white font-bold">{current.title}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">CORRIDOR VOLUME</span>
                  <span className="text-[#10B981] font-bold">{current.volume}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">SPREAD / YIELD</span>
                  <span className="text-cyan-400 font-bold">{current.spread}</span>
                </div>
              </div>

              {/* 4-Corridor Quick-Jump Ledger Index Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {CORRIDORS.map((item, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToCorridorCard(idx)}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#10B981]/15 border-[#10B981] text-white'
                          : 'bg-[#030712]/80 border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-mono text-[10px] text-[#10B981] font-bold">
                          {item.index} // {item.pair}
                        </div>
                        <div className="font-mono text-[11px] font-semibold truncate max-w-[125px]">
                          {item.latency} Finality
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => openCorridorPortal(current, activeIndex)}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#10B981] text-white hover:text-[#030712] border border-[#10B981]/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch {current.index} Tranche Simulator</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-7): 4 Flagship Settlement Corridor Cards */}
          <div className="lg:col-span-7 space-y-6">
            {CORRIDORS.map((corridor, idx) => (
              <CorridorLedgerCard
                key={corridor.id}
                corridor={corridor}
                idx={idx}
                isFocused={idx === activeIndex}
                onFocus={setActiveIndex}
                onOpenPortal={openCorridorPortal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Interactive Corridor Portal Takeover Modal */}
      <AnimatePresence>
        {selectedCorridor && (
          <motion.div
            key="corridor-portal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#030712]/95 overflow-y-auto p-4 sm:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="w-full max-w-5xl rounded-3xl bg-[#070D19] border border-[#10B981]/40 shadow-[0_0_60px_rgba(16,185,129,0.2)] p-6 sm:p-10 text-white relative overflow-hidden my-auto"
            >
              {/* Top Portal Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 font-mono text-xs font-bold text-[#10B981]">
                    LIVE CORRIDOR PORTAL // {selectedCorridor.index}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {selectedCorridor.code}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateModalCorridor(-1)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateModalCorridor(1)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <span>NEXT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedCorridor(null);
                    }}
                    aria-label="Close corridor portal"
                    className="ml-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Portal Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
                {/* Left 7 Cols: Live Interactive Settlement Route & Tranche Simulator */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                      {selectedCorridor.subtitle}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-bold mt-1">
                      <ScrambleText
                        text={selectedCorridor.title}
                        triggerKey={selectedCorridor.id}
                      />
                    </h3>
                    <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                      {selectedCorridor.summary}
                    </p>
                  </div>

                  {/* Node Hop Visualization */}
                  <div className="p-5 rounded-2xl bg-[#030712]/90 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>ATOMIC ROUTING TOPOLOGY</span>
                      <span className="text-[#10B981]">
                        FINALITY: {selectedCorridor.latency}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {selectedCorridor.nodes.map((node, i) => (
                        <div
                          key={node}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            simulating || simCompleted
                              ? 'bg-[#10B981]/15 border-[#10B981]/60 text-white'
                              : 'bg-white/5 border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-[#10B981] mb-1">
                            HOP 0{i + 1}
                          </div>
                          <div className="font-mono text-[11px] font-semibold truncate">
                            {node}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Institutional Tranche Simulator */}
                  <div className="p-5 rounded-2xl bg-[#0B1325] border border-white/15 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono uppercase text-[#10B981]">
                          INTERACTIVE SETTLEMENT TRANCHE SIMULATOR
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Simulate atomic liquidity execution vs. legacy Tier-1 correspondent wire
                        </div>
                      </div>
                      <span className="font-mono text-2xl font-bold text-white tabular-nums">
                        ${trancheM}M USD
                      </span>
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={250}
                      step={5}
                      value={trancheM}
                      onChange={(e) => setTrancheM(Number(e.target.value))}
                      className="meridian-slider w-full bg-slate-800 rounded-full h-2"
                    />

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-[#030712]/70 border border-white/10">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          MERIDIAN FEE (1 bps)
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-white mt-0.5">
                          ${(trancheM * 100).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#030712]/70 border border-white/10">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          SAVINGS VS. SWIFT
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-[#10B981] mt-0.5">
                          +${(trancheM * 14900).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#030712]/70 border border-white/10">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          SETTLEMENT SPEED
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-cyan-400 mt-0.5">
                          {selectedCorridor.latency}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunSimulation}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#030712] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      {simulating ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          <span>DISPATCHING QUANTUM LIQUIDITY PACKETS...</span>
                        </>
                      ) : simCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            ${trancheM}M TRANCHE SETTLED IN {selectedCorridor.latency} · RUN AGAIN
                          </span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>SIMULATE ${trancheM}M ATOMIC SETTLEMENT</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right 5 Cols: Key Telemetry Metrics & ISO-20022 Cryptographic Payload */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      VERIFIED CORRIDOR BENCHMARKS
                    </div>
                    {selectedCorridor.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="p-4 rounded-2xl bg-[#030712]/80 border border-white/10 flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-400">{m.label}</span>
                        <span className="font-mono text-sm font-bold text-[#10B981]">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-[#030712] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>ISO-20022 CRYPTOGRAPHIC ATTESTATION</span>
                      <span className="text-[#10B981]">● VERIFIED</span>
                    </div>
                    <pre className="font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
                      {selectedCorridor.isoPayload}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
