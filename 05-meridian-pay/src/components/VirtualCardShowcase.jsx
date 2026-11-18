import React, { useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { Lock, Unlock, Shield, Sliders, Wifi, Sparkles, Orbit } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const CARD_THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Titanium',
    badge: 'PHYSICAL · LASER TITANIUM',
    bgClass: 'from-[#070D19] via-[#111C35] to-[#030712]',
    accentColor: '#10B981',
    textColor: 'text-white',
    subTextColor: 'text-slate-300',
    last4: '4829',
    holder: 'ALEXANDER CHEN · CFO',
    network: 'VISA INFINITE INSTITUTIONAL',
  },
  emerald: {
    id: 'emerald',
    name: 'Quantum Emerald',
    badge: 'VIRTUAL · ZERO-KNOWLEDGE',
    bgClass: 'from-[#022C22] via-[#065F46] to-[#047857]',
    accentColor: '#6EE7B7',
    textColor: 'text-white',
    subTextColor: 'text-emerald-100',
    last4: '9104',
    holder: 'AI COMPUTE CLUSTER 04',
    network: 'VISA COMMERCIAL DIRECT',
  },
  cobalt: {
    id: 'cobalt',
    name: 'Cyber Cobalt',
    badge: 'EXECUTIVE · 0% FX SPREAD',
    bgClass: 'from-[#0F172A] via-[#1D4ED8] to-[#0284C7]',
    accentColor: '#7DD3FC',
    textColor: 'text-white',
    subTextColor: 'text-cyan-100',
    last4: '7731',
    holder: 'TOKYO–LONDON DESK',
    network: 'MASTERCARD WORLD ELITE',
  },
};

export default function VirtualCardShowcase({ onShaderPulse }) {
  const [selectedTheme, setSelectedTheme] = useState('obsidian');
  const [spendLimit, setSpendLimit] = useState(125000);
  const [isFrozen, setIsFrozen] = useState(false);
  const [requireReceipt, setRequireReceipt] = useState(true);
  const [foilCoords, setFoilCoords] = useState({ x: 50, y: 50, angle: 135 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-scrubbed 3D orbital rotation for the titanium card
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scrollOrbitY = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [-28, 0, 18]),
    { stiffness: 180, damping: 28 }
  );
  const scrollOrbitX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -10]),
    { stiffness: 180, damping: 28 }
  );
  const scrollOrbitZ = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 0, 3]);
  const floatRingY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const panelParallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -35]);

  // Automatically sweep holographic foil across the card as you scroll when not hovering
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!isHoveringCard) {
      setFoilCoords({
        x: Math.round(15 + latest * 70),
        y: Math.round(80 - latest * 60),
        angle: Math.round(105 + latest * 95),
      });
    }
  });

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 240,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 240,
    damping: 22,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    setIsHoveringCard(true);
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    setFoilCoords({
      x: Math.round((xPct + 0.5) * 100),
      y: Math.round((yPct + 0.5) * 100),
      angle: Math.round(135 + xPct * 90 - yPct * 60),
    });
  };

  const handleMouseLeave = () => {
    setIsHoveringCard(false);
    mouseX.set(0);
    mouseY.set(0);
    setFoilCoords({ x: 50, y: 50, angle: 135 });
  };

  const theme = CARD_THEMES[selectedTheme];
  const currentSpend = 24800;
  const utilizationPct = Math.min(100, Math.round((currentSpend / spendLimit) * 100));
  const sliderPct = ((spendLimit - 5000) / (250000 - 5000)) * 100;

  return (
    <section
      id="cards"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>03 // HOLOGRAPHIC METAL &amp; VIRTUAL CARDS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            <ScrambleText text="Programmable Titanium Cards." />
          </h2>
          <p className="text-base text-slate-400 mt-3">
            Spin up vendor-locked virtual cards in milliseconds or issue laser-etched titanium
            cards with real-time cryptographic spend guardrails and multi-currency settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Scroll-Driven 3D Orbital + Cursor Gyroscopic Tilt Interactive Card */}
          <div className="lg:col-span-6 flex flex-col items-center relative">
            {/* Floating Parallax Orbital Telemetry Badge */}
            <motion.div
              style={{ y: floatRingY }}
              className="pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070D19]/90 border border-cyan-400/35 text-[10px] font-mono text-cyan-300 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
            >
              <Orbit className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
              <span>3D SCROLL ORBIT + GYRO FOIL SHIMMER ACTIVE</span>
            </motion.div>

            <div style={{ perspective: 1200 }} className="w-full max-w-[440px]">
              {/* Outer Scroll-Driven 3D Orbital Wrapper */}
              <motion.div
                style={{
                  rotateY: scrollOrbitY,
                  rotateX: scrollOrbitX,
                  rotateZ: scrollOrbitZ,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Inner Cursor-Driven 3D Tilt Card */}
                <motion.div
                  ref={cardRef}
                  data-cursor="ROTATE 3D CARD"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  className={`relative w-full aspect-[1.586/1] rounded-3xl bg-gradient-to-br ${theme.bgClass} p-6 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.85)] overflow-hidden select-none cursor-pointer border border-white/20`}
                >
                  {/* Live Iridescent Holographic Foil Shimmer Layer */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-45 mix-blend-screen transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(circle at ${foilCoords.x}% ${foilCoords.y}%, rgba(16, 185, 129, 0.5), rgba(6, 182, 212, 0.32) 38%, rgba(59, 130, 246, 0.18) 65%, transparent 85%), linear-gradient(${foilCoords.angle}deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)`,
                    }}
                  />

                  {/* Bespoke Geometric Quantum SVG Pattern Overlay */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                    viewBox="0 0 400 250"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="340" cy="40" r="140" stroke="white" strokeWidth="1" />
                    <circle cx="340" cy="40" r="95" stroke="#10B981" strokeWidth="0.85" />
                    <circle
                      cx="340"
                      cy="40"
                      r="55"
                      stroke="#06B6D4"
                      strokeWidth="0.75"
                      strokeDasharray="4 4"
                    />
                    <path d="M-20 210 Q 180 120 420 220" stroke="white" strokeWidth="1" />
                  </svg>

                  {/* Frozen Overlay */}
                  {isFrozen && (
                    <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-[#10B981] uppercase">
                        CRYPTOGRAPHIC FREEZE ACTIVE
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 18V6L12 13L20 6V18"
                              stroke={theme.accentColor}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className={`font-bold text-sm tracking-tight ${theme.textColor}`}>
                          Meridian
                        </span>
                      </div>
                      <span
                        className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-black/30 border border-white/20 ${theme.subTextColor}`}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    {/* Middle Row: Holographic EMV Chip & Contactless + Gyro Telemetry */}
                    <div className="flex items-center justify-between my-auto">
                      <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200/90 via-emerald-200/80 to-cyan-300/85 border border-white/40 flex items-center justify-center shadow-inner">
                        <div className="w-8 h-6 border border-slate-900/30 rounded-[3px] grid grid-cols-2 gap-px p-0.5">
                          <div className="border-r border-slate-900/25" />
                          <div />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-white/60">
                          FOIL {foilCoords.x}% · {foilCoords.y}%
                        </span>
                        <Wifi className={`w-5 h-5 rotate-90 opacity-85 ${theme.textColor}`} />
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="space-y-3">
                      <div
                        className={`font-mono text-lg sm:text-xl tracking-[0.2em] ${theme.textColor} tabular-nums`}
                      >
                        4921 •••• •••• {theme.last4}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div
                            className={`text-[10px] font-mono uppercase tracking-wider opacity-70 ${theme.subTextColor}`}
                          >
                            Authorized Entity
                          </div>
                          <div
                            className={`font-mono text-xs font-semibold tracking-wide ${theme.textColor}`}
                          >
                            {theme.holder}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-mono text-[10px] font-bold tracking-wider ${theme.textColor}`}
                          >
                            {theme.network}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Theme Selector Pills */}
            <div className="mt-7 inline-flex p-1.5 rounded-2xl bg-[#070D19] border border-white/15 shadow-lg gap-1">
              {Object.values(CARD_THEMES).map((item) => {
                const active = selectedTheme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-cursor={`FINISH: ${item.name.toUpperCase()}`}
                    onMouseEnter={() => soundEngine.playHover(1.05)}
                    onClick={() => {
                      soundEngine.playClick();
                      if (onShaderPulse) onShaderPulse();
                      setSelectedTheme(item.id);
                    }}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                      active ? 'text-[#030712]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="cardThemePill"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="absolute inset-0 rounded-xl bg-[#10B981]"
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Spend-Limit Slider & Cryptographic Controls with Parallax Counter-Motion */}
          <motion.div style={{ y: panelParallaxY }} className="lg:col-span-6">
            <div className="bg-[#070D19]/90 backdrop-blur-xl rounded-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-6 sm:p-8 space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Real-Time Spend Guardrail Engine
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      ENFORCES ACROSS VISA / MASTERCARD NODES IN &lt;180ms
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-cursor={isFrozen ? 'UNFREEZE CARD' : 'FREEZE CARD'}
                  onClick={() => {
                    soundEngine.playClick();
                    if (onShaderPulse) onShaderPulse();
                    setIsFrozen((f) => !f);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-colors ${
                    isFrozen
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                      : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>
              </div>

              {/* Spend Limit Slider */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    MONTHLY VELOCITY LIMIT
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#10B981] tabular-nums">
                    ${spendLimit.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min={5000}
                    max={250000}
                    step={5000}
                    value={spendLimit}
                    onChange={(e) => {
                      setSpendLimit(Number(e.target.value));
                    }}
                    aria-label="Monthly Spend Limit"
                    className="meridian-slider w-full"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #06B6D4 ${sliderPct}%, #1E293B ${sliderPct}%, #1E293B 100%)`,
                      borderRadius: '9999px',
                      height: '8px',
                    }}
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                    <span>$5,000</span>
                    <span>$125,000</span>
                    <span>$250,000</span>
                  </div>
                </div>
              </div>

              {/* Utilization Preview */}
              <div className="rounded-2xl bg-[#030712]/85 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">CURRENT CYCLE UTILIZATION</span>
                  <span className="font-semibold text-white tabular-nums">
                    ${currentSpend.toLocaleString('en-US')} / ${spendLimit.toLocaleString('en-US')}{' '}
                    ({utilizationPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      utilizationPct > 80
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-[#10B981] to-cyan-400'
                    }`}
                    initial={false}
                    animate={{ width: `${utilizationPct}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                </div>
              </div>

              {/* Policy Toggle */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Zero-Knowledge Receipt Attestation &gt; $500
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      AUTO-RECONCILES TO NETSUITE, SAP &amp; WORKDAY
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={requireReceipt}
                  onClick={() => {
                    soundEngine.playClick();
                    setRequireReceipt((v) => !v);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    requireReceipt ? 'bg-[#10B981]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#030712] shadow ring-0 transition duration-200 ${
                      requireReceipt ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
