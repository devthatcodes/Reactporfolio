import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Unlock, Shield, Sliders, Wifi } from 'lucide-react';

const CARD_THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Metal',
    badge: 'PHYSICAL · TITANIUM',
    bgClass: 'from-[#0F172A] via-[#1E293B] to-[#0B1120]',
    accentColor: '#10B981',
    textColor: 'text-white',
    subTextColor: 'text-slate-300',
    last4: '4829',
    holder: 'ALEXANDER CHEN · CFO',
    network: 'VISA CORPORATE',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Virtual',
    badge: 'VIRTUAL · SaaS & CLOUD',
    bgClass: 'from-[#064E3B] via-[#059669] to-[#047857]',
    accentColor: '#A7F3D0',
    textColor: 'text-white',
    subTextColor: 'text-emerald-100',
    last4: '9104',
    holder: 'AWS INFRASTRUCTURE',
    network: 'VISA COMMERCIAL',
  },
  cobalt: {
    id: 'cobalt',
    name: 'Cobalt Travel',
    badge: 'TRAVEL · 0% FX FEE',
    bgClass: 'from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8]',
    accentColor: '#93C5FD',
    textColor: 'text-white',
    subTextColor: 'text-blue-100',
    last4: '7731',
    holder: 'EMEA SALES TEAM',
    network: 'MASTERCARD WORLD',
  },
};

export default function VirtualCardShowcase() {
  const [selectedTheme, setSelectedTheme] = useState('obsidian');
  const [spendLimit, setSpendLimit] = useState(85000);
  const [isFrozen, setIsFrozen] = useState(false);
  const [requireReceipt, setRequireReceipt] = useState(true);

  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 220,
    damping: 24,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const theme = CARD_THEMES[selectedTheme];
  const currentSpend = 18450;
  const utilizationPct = Math.min(100, Math.round((currentSpend / spendLimit) * 100));
  const sliderPct = ((spendLimit - 5000) / (250000 - 5000)) * 100;

  return (
    <section id="cards" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB] mb-2.5">
            Programmable Corporate Cards
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Issue physical &amp; virtual cards with built-in spend guardrails.
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Spin up vendor-locked virtual cards in seconds or ship laser-etched titanium cards
            with real-time limits and multi-currency settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: 3D Tilt Interactive Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div style={{ perspective: 1100 }} className="w-full max-w-[430px]">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className={`relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${theme.bgClass} p-6 sm:p-7 shadow-card-elevated overflow-hidden select-none cursor-pointer border border-white/15`}
              >
                {/* Bespoke Geometric SVG Pattern Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                  viewBox="0 0 400 250"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="340" cy="40" r="140" stroke="white" strokeWidth="1" />
                  <circle cx="340" cy="40" r="95" stroke="white" strokeWidth="0.75" />
                  <path d="M-20 210 Q 180 120 420 220" stroke="white" strokeWidth="1" />
                </svg>

                {/* Frozen Overlay */}
                {isFrozen && (
                  <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
                      Card Frozen
                    </span>
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center">
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
                      <span className={`font-semibold text-sm tracking-tight ${theme.textColor}`}>
                        Meridian
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 ${theme.subTextColor}`}
                    >
                      {theme.badge}
                    </span>
                  </div>

                  {/* Middle Row: EMV Chip & Contactless */}
                  <div className="flex items-center justify-between my-auto">
                    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200/90 via-amber-300/80 to-amber-500/80 border border-amber-100/50 flex items-center justify-center shadow-inner">
                      <div className="w-7 h-5 border border-amber-900/30 rounded-[3px] grid grid-cols-2 gap-px p-0.5">
                        <div className="border-r border-amber-900/25" />
                        <div />
                      </div>
                    </div>
                    <Wifi className={`w-5 h-5 rotate-90 opacity-75 ${theme.textColor}`} />
                  </div>

                  {/* Bottom Row */}
                  <div className="space-y-3">
                    <div
                      className={`font-mono text-lg sm:text-xl tracking-[0.18em] ${theme.textColor} tabular-nums`}
                    >
                      •••• •••• •••• {theme.last4}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className={`text-[10px] uppercase tracking-wider opacity-70 ${theme.subTextColor}`}>
                          Cardholder
                        </div>
                        <div className={`font-mono text-xs font-medium tracking-wide ${theme.textColor}`}>
                          {theme.holder}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-[11px] font-semibold tracking-wider ${theme.textColor}`}>
                          {theme.network}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Theme Selector Pills */}
            <div className="mt-7 inline-flex p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm gap-1">
              {Object.values(CARD_THEMES).map((item) => {
                const active = selectedTheme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTheme(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="cardThemePill"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="absolute inset-0 rounded-lg bg-[#0F172A]"
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Spend-Limit Slider & Controls */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle p-6 sm:p-8 space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      Live Spend Limit Control
                    </h3>
                    <p className="text-xs text-slate-500">
                      Changes enforce globally in &lt;200ms
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFrozen((f) => !f)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    isFrozen
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>
              </div>

              {/* Spend Limit Slider */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-slate-600">Monthly Spend Cap</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0F172A] tabular-nums">
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
                    onChange={(e) => setSpendLimit(Number(e.target.value))}
                    aria-label="Monthly Spend Limit"
                    className="meridian-slider w-full"
                    style={{
                      background: `linear-gradient(to right, #2563EB 0%, #2563EB ${sliderPct}%, #E2E8F0 ${sliderPct}%, #E2E8F0 100%)`,
                      borderRadius: '9999px',
                      height: '8px',
                    }}
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>$5,000</span>
                    <span>$125,000</span>
                    <span>$250,000</span>
                  </div>
                </div>
              </div>

              {/* Utilization Preview */}
              <div className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Current Cycle Utilization</span>
                  <span className="font-mono font-semibold text-[#0F172A] tabular-nums">
                    ${currentSpend.toLocaleString('en-US')} / ${spendLimit.toLocaleString('en-US')} ({utilizationPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      utilizationPct > 80 ? 'bg-amber-500' : 'bg-[#10B981]'
                    }`}
                    initial={false}
                    animate={{ width: `${utilizationPct}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                </div>
              </div>

              {/* Policy Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Require Receipt &amp; Memo &gt; $500
                    </div>
                    <div className="text-xs text-slate-500">
                      Auto-syncs to NetSuite &amp; QuickBooks
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={requireReceipt}
                  onClick={() => setRequireReceipt((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    requireReceipt ? 'bg-[#10B981]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      requireReceipt ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
