import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowRight, CheckCircle2, Sparkles, Zap, Radio } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const CURRENCIES = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateFromUSD: 1.0, badge: 'US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateFromUSD: 0.9214, badge: 'EU' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateFromUSD: 0.7865, badge: 'GB' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateFromUSD: 151.42, badge: 'JP' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateFromUSD: 1.3895, badge: 'CA' },
};

const NETWORK_MODES = [
  { id: 0, label: 'FX CORRIDOR', rateNote: '0.01% INSTITUTIONAL SPREAD' },
  { id: 1, label: 'TREASURY YIELD', rateNote: '4.85% U.S. T-BILL REPO' },
  { id: 2, label: 'ZERO-KNOWLEDGE VAULT', rateNote: 'FIPS 140-3 HSM CUSTODY' },
];

function CurrencyBadge({ code }) {
  const colors = {
    USD: 'bg-[#2563EB]/20 text-blue-300 border-[#2563EB]/40',
    EUR: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    GBP: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    JPY: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    CAD: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-mono font-semibold border ${colors[code]}`}
    >
      {CURRENCIES[code].badge}
    </span>
  );
}

export default function HeroSection({
  onOpenAccount,
  networkMode = 0,
  onSelectNetworkMode,
  onShaderPulse,
}) {
  const [amountStr, setAmountStr] = useState('250000');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');
  const [swapRotation, setSwapRotation] = useState(0);

  const numericAmount = useMemo(() => {
    const parsed = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [amountStr]);

  const calculation = useMemo(() => {
    const fromRate = CURRENCIES[fromCurr].rateFromUSD;
    const toRate = CURRENCIES[toCurr].rateFromUSD;
    const midMarketRate = toRate / fromRate;

    // Meridian 0.15% standard / 0.01% institutional FX spread
    const meridianFeeRate = 0.0015;
    const meridianFeeInFrom = numericAmount * meridianFeeRate;
    const netSend = Math.max(0, numericAmount - meridianFeeInFrom);
    const convertedAmount = netSend * midMarketRate;

    // Traditional bank: ~3.8% FX markup + $25 wire fee equivalent
    const bankMarkupRate = 0.038;
    const bankWireFeeInUSD = 25;
    const bankWireFeeInFrom = bankWireFeeInUSD * fromRate;
    const bankTotalCostInFrom =
      numericAmount * bankMarkupRate + (numericAmount > 0 ? bankWireFeeInFrom : 0);
    const savingsInFrom = Math.max(0, bankTotalCostInFrom - meridianFeeInFrom);

    return {
      midMarketRate,
      meridianFeeInFrom,
      convertedAmount,
      savingsInFrom,
    };
  }, [numericAmount, fromCurr, toCurr]);

  const handleSwap = () => {
    soundEngine.playConfirm();
    if (onShaderPulse) onShaderPulse();
    setSwapRotation((r) => r + 180);
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const formatMoney = (val, code) => {
    const decimals = code === 'JPY' ? 0 : 2;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 pt-10 pb-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Interactive WebGL Shader Mode Pill Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
            <span>QUANTUM SHADER TOPOLOGY // INTERACTIVE FIELD</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {NETWORK_MODES.map((m) => {
              const active = networkMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  data-cursor={`MODE: ${m.label}`}
                  onMouseEnter={() => soundEngine.playHover(1.05)}
                  onClick={() => {
                    soundEngine.playClick();
                    if (onSelectNetworkMode) onSelectNetworkMode(m.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider border transition-all ${
                    active
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Kinetic Scramble Copy & Institutional Telemetry */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-7"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#070D19]/90 border border-[#10B981]/35 text-xs font-mono text-slate-200 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span>01 // QUANTUM LIQUIDITY NETWORK</span>
              <span className="text-slate-600">·</span>
              <span className="font-semibold text-[#10B981]">
                {NETWORK_MODES[networkMode]?.rateNote}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.06]">
              Borderless treasury, atomic FX rails, and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-cyan-400 to-[#3B82F6]">
                <ScrambleText
                  text="programmable liquidity."
                  triggerKey={networkMode}
                  scrambleOnHover
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Consolidate global multi-entity cash, execute atomic FX across 140+ currencies in
              38ms, and deploy hardware-enforced corporate cards from a single institutional OS.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                data-cursor="INITIALIZE VAULT"
                onMouseEnter={() => soundEngine.playHover(1.15)}
                onClick={() => {
                  soundEngine.playConfirm();
                  onOpenAccount('account');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-[#030712] bg-[#10B981] hover:bg-[#34D399] rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98]"
              >
                <span>Open Institutional Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-cursor="BOOK WALKTHROUGH"
                onMouseEnter={() => soundEngine.playHover(1.0)}
                onClick={() => {
                  soundEngine.playClick();
                  onOpenAccount('demo');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl backdrop-blur-md transition-all"
              >
                <span>Book Architecture Demo</span>
              </button>
            </div>

            {/* Trust Metrics with Kinetic Scramble */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="font-mono text-2xl sm:text-[28px] font-bold text-white tabular-nums">
                  <ScrambleText text="$48.2B+" scrambleOnHover />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Liquidity Volume
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-[28px] font-bold text-cyan-400 tabular-nums">
                  <ScrambleText text="38ms" scrambleOnHover />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Atomic Finality
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-[28px] font-bold text-[#10B981] tabular-nums">
                  <ScrambleText text="0.01%" scrambleOnHover />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Prime FX Spread
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Multi-Currency FX & Fee Calculator */}
          <motion.div
            id="fx-calculator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <div className="bg-[#070D19]/90 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.75)] p-5 sm:p-7 relative overflow-hidden">
              {/* Top corner accent glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[#10B981]/15 blur-3xl" />

              {/* Calculator Header */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div>
                  <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
                    Live Quantum FX &amp; Fee Engine
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time interbank orderbook depth with zero correspondent markups
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[11px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                  <span>LIVE FEED</span>
                </div>
              </div>

              {/* You Send */}
              <div className="space-y-2 relative z-10">
                <div
                  data-cursor="SIMULATE FX"
                  className="rounded-2xl border border-white/10 bg-[#030712]/85 p-4 focus-within:border-[#10B981] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>YOU DISPATCH</span>
                    <span>VAULT BAL: {CURRENCIES[fromCurr].symbol}12,500,000.00</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="font-mono text-xl sm:text-2xl font-medium text-slate-500">
                        {CURRENCIES[fromCurr].symbol}
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amountStr}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                          setAmountStr(cleaned);
                          if (onShaderPulse) onShaderPulse();
                        }}
                        aria-label="Send amount"
                        className="w-full bg-transparent font-mono text-2xl sm:text-[28px] font-bold text-white focus:outline-none tabular-nums"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-[#0B1325] border border-white/15 rounded-xl px-2.5 py-1.5 shrink-0">
                      <CurrencyBadge code={fromCurr} />
                      <select
                        value={fromCurr}
                        onChange={(e) => {
                          soundEngine.playClick();
                          if (onShaderPulse) onShaderPulse();
                          const next = e.target.value;
                          if (next === toCurr) {
                            setToCurr(fromCurr);
                          }
                          setFromCurr(next);
                        }}
                        aria-label="Source currency"
                        className="bg-transparent font-mono font-bold text-sm text-white focus:outline-none cursor-pointer pr-1"
                      >
                        {Object.keys(CURRENCIES).map((code) => (
                          <option key={code} value={code} className="bg-[#070D19] text-white">
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Swap Button Divider */}
                <div className="relative flex items-center justify-center -my-3 z-20">
                  <motion.button
                    type="button"
                    data-cursor="ATOMIC SWAP"
                    onClick={handleSwap}
                    animate={{ rotate: swapRotation }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    aria-label="Swap currencies"
                    className="w-10 h-10 rounded-full bg-[#0B1325] border border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-[#10B981] hover:text-[#030712] text-[#10B981] flex items-center justify-center transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Recipient Gets */}
                <div
                  data-cursor="SIMULATE FX"
                  className="rounded-2xl border border-white/10 bg-[#030712]/85 p-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>RECIPIENT SETTLES (T+0)</span>
                    <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                      <Zap className="w-3 h-3" />
                      38ms Atomic Rail
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-2xl sm:text-[28px] font-bold text-[#10B981] tabular-nums truncate">
                      {CURRENCIES[toCurr].symbol}
                      {formatMoney(calculation.convertedAmount, toCurr)}
                    </div>
                    <div className="flex items-center gap-2 bg-[#0B1325] border border-white/15 rounded-xl px-2.5 py-1.5 shrink-0">
                      <CurrencyBadge code={toCurr} />
                      <select
                        value={toCurr}
                        onChange={(e) => {
                          soundEngine.playClick();
                          if (onShaderPulse) onShaderPulse();
                          const next = e.target.value;
                          if (next === fromCurr) {
                            setFromCurr(toCurr);
                          }
                          setToCurr(next);
                        }}
                        aria-label="Target currency"
                        className="bg-transparent font-mono font-bold text-sm text-white focus:outline-none cursor-pointer pr-1"
                      >
                        {Object.keys(CURRENCIES).map((code) => (
                          <option key={code} value={code} className="bg-[#070D19] text-white">
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate & Fee Breakdown */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>INTERBANK MID-MARKET RATE</span>
                  <span className="font-semibold text-white tabular-nums">
                    1 {fromCurr} = {calculation.midMarketRate.toFixed(4)} {toCurr}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>MERIDIAN LIQUIDITY FEE (0.15%)</span>
                  <span className="font-semibold text-cyan-400 tabular-nums">
                    {CURRENCIES[fromCurr].symbol}
                    {formatMoney(calculation.meridianFeeInFrom, fromCurr)} {fromCurr}
                  </span>
                </div>
              </div>

              {/* Savings Callout */}
              <div className="mt-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-mono text-slate-200">
                    SAVINGS VS. TIER-1 CORRESPONDENT BANK
                  </span>
                </div>
                <span className="font-mono text-sm sm:text-base font-bold text-[#10B981] tabular-nums shrink-0">
                  +{CURRENCIES[fromCurr].symbol}
                  {formatMoney(calculation.savingsInFrom, fromCurr)}
                </span>
              </div>

              {/* Action CTA */}
              <button
                type="button"
                data-cursor="LOCK FX RATE"
                onMouseEnter={() => soundEngine.playHover(1.2)}
                onClick={() => {
                  soundEngine.playConfirm();
                  if (onShaderPulse) onShaderPulse();
                  onOpenAccount('account');
                }}
                className="mt-4 w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#10B981] to-cyan-400 hover:opacity-95 text-[#030712] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lock Atomic Rate &amp; Open Treasury Vault</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
