import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Globe2,
  ShieldCheck,
  Cpu,
  X,
  Play,
  CheckCircle2,
  Activity,
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

export default function CorridorReel({ onTriggerPortal, onShaderPulse }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [trancheM, setTrancheM] = useState(25); // $25M default simulation tranche
  const [simulating, setSimulating] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);
  const cardContainerRef = useRef(null);

  const current = CORRIDORS[activeIndex];

  const cycleCorridor = (dir) => {
    soundEngine.playClick();
    if (onShaderPulse) onShaderPulse();
    setActiveIndex((prev) => (prev + dir + CORRIDORS.length) % CORRIDORS.length);
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
    }, 750);
  };

  const handleMouseMove = (e) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -ny * 10, y: nx * 14 });
  };

  return (
    <section
      id="corridors"
      className="relative py-24 lg:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-mono uppercase tracking-widest text-[#10B981] mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>02 // INTERACTIVE CORRIDOR CASE REEL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              <ScrambleText text="Global Liquidity Corridors." />
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl">
              Explore Meridian’s live institutional settlement corridors. Tilt and inspect any
              corridor card or launch its full-screen interactive settlement portal.
            </p>
          </div>

          {/* Reel Navigation Controls */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="font-mono text-xs text-slate-400 mr-2">
              CORRIDOR <span className="text-white font-bold">0{activeIndex + 1}</span> / 0
              {CORRIDORS.length}
            </div>
            <button
              type="button"
              data-cursor="PREV CORRIDOR"
              onMouseEnter={() => soundEngine.playHover(0.9)}
              onClick={() => cycleCorridor(-1)}
              aria-label="Previous corridor"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-cursor="NEXT CORRIDOR"
              onMouseEnter={() => soundEngine.playHover(1.1)}
              onClick={() => cycleCorridor(1)}
              aria-label="Next corridor"
              className="w-11 h-11 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Velocity-Tilted Featured Corridor Showcase + Selector Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 Cols: Interactive 3D Perspective Portal Stage */}
          <div
            ref={cardContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ perspective: 1200 }}
            className="lg:col-span-7 flex"
          >
            <motion.div
              key={current.id}
              initial={{ opacity: 0, rotateY: -8, scale: 0.96 }}
              animate={{
                opacity: 1,
                rotateX: tilt.x,
                rotateY: tilt.y,
                scale: 1,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              onClick={() => openCorridorPortal(current, activeIndex)}
              data-cursor="LAUNCH CORRIDOR"
              className="relative w-full rounded-3xl bg-gradient-to-br from-[#0B1325]/95 via-[#070D19]/95 to-[#030712]/95 border border-white/15 hover:border-[#10B981]/60 p-7 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.65)] cursor-pointer overflow-hidden group flex flex-col justify-between min-h-[420px]"
            >
              {/* Animated SVG Quantum Corridor Node Mesh Background */}
              <svg
                className="absolute inset-0 w-full h-full opacity-25 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
                viewBox="0 0 600 400"
                fill="none"
              >
                <defs>
                  <linearGradient id="corridorArcGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={current.accent} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={current.secondary} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <circle
                  cx="460"
                  cy="190"
                  r="150"
                  stroke="url(#corridorArcGrad)"
                  strokeWidth="1.2"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="460"
                  cy="190"
                  r="95"
                  stroke={current.accent}
                  strokeWidth="0.9"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 40 310 Q 250 90 520 170"
                  stroke="url(#corridorArcGrad)"
                  strokeWidth="2.5"
                />
                <path
                  d="M 40 310 Q 280 260 520 170"
                  stroke={current.secondary}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <circle cx="40" cy="310" r="6" fill={current.accent} />
                <circle cx="275" cy="185" r="5" fill={current.secondary} />
                <circle cx="520" cy="170" r="8" fill={current.accent} />
              </svg>

              {/* Top Telemetry Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 font-mono text-xs font-bold text-[#10B981]">
                    {current.index}
                  </span>
                  <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
                    {current.code}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-xs font-mono text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                  <span>{current.pair}</span>
                </div>
              </div>

              {/* Center Title & Description */}
              <div className="relative z-10 my-8">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-2">
                  {current.subtitle}
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white group-hover:text-[#10B981] transition-colors">
                  <ScrambleText text={current.title} triggerKey={current.id} />
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl leading-relaxed">
                  {current.summary}
                </p>
              </div>

              {/* Bottom Metrics & Launch Portal Button */}
              <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      FINALITY LATENCY
                    </div>
                    <div className="font-mono text-lg font-bold text-white">{current.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      CORRIDOR VOLUME
                    </div>
                    <div className="font-mono text-lg font-bold text-[#10B981]">
                      {current.volume}
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      INSTITUTIONAL SPREAD
                    </div>
                    <div className="font-mono text-lg font-bold text-cyan-400">
                      {current.spread}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] text-[#030712] font-mono text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Enter Corridor Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right 5 Cols: Interactive Corridor Reel Index Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {CORRIDORS.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    soundEngine.playHover(1 + idx * 0.08);
                    setActiveIndex(idx);
                  }}
                  onClick={() => openCorridorPortal(item, idx)}
                  data-cursor="OPEN PORTAL"
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#0B1325]/95 border-[#10B981]/60 shadow-[0_0_30px_rgba(16,185,129,0.14)]'
                      : 'bg-[#070D19]/70 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isSelected ? 'text-[#10B981]' : 'text-slate-500'
                        }`}
                      >
                        {item.index} //
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                        {item.pair}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <div className="text-xs text-slate-400 font-mono">
                      Latency: <span className="text-[#10B981]">{item.latency}</span> · Vol:{' '}
                      <span className="text-slate-200">{item.volume}</span>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#10B981] text-[#030712] border-[#10B981]'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
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
            className="fixed inset-0 z-[80] bg-[#030712]/95 backdrop-blur-2xl overflow-y-auto p-4 sm:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="w-full max-w-5xl rounded-3xl bg-[#070D19] border border-[#10B981]/40 shadow-[0_0_80px_rgba(16,185,129,0.2)] p-6 sm:p-10 text-white relative overflow-hidden my-auto"
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
