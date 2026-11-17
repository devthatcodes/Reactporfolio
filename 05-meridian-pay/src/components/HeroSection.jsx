import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';

const CURRENCIES = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateFromUSD: 1.0, badge: 'US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateFromUSD: 0.9214, badge: 'EU' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateFromUSD: 0.7865, badge: 'GB' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateFromUSD: 151.42, badge: 'JP' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateFromUSD: 1.3895, badge: 'CA' },
};

function CurrencyBadge({ code }) {
  const colors = {
    USD: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
    EUR: 'bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]/20',
    GBP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    JPY: 'bg-rose-50 text-rose-700 border-rose-200',
    CAD: 'bg-[#10B981]/10 text-[#059669] border-[#10B981]/20',
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-mono font-semibold border ${colors[code]}`}
    >
      {CURRENCIES[code].badge}
    </span>
  );
}

export default function HeroSection({ onOpenAccount }) {
  const [amountStr, setAmountStr] = useState('50000');
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

    // Meridian 0.15% FX spread
    const meridianFeeRate = 0.0015;
    const meridianFeeInFrom = numericAmount * meridianFeeRate;
    const netSend = Math.max(0, numericAmount - meridianFeeInFrom);
    const convertedAmount = netSend * midMarketRate;

    // Traditional bank: ~3.8% FX markup + $25 wire fee equivalent
    const bankMarkupRate = 0.038;
    const bankWireFeeInUSD = 25;
    const bankWireFeeInFrom = bankWireFeeInUSD * fromRate;
    const bankTotalCostInFrom = numericAmount * bankMarkupRate + (numericAmount > 0 ? bankWireFeeInFrom : 0);
    const savingsInFrom = Math.max(0, bankTotalCostInFrom - meridianFeeInFrom);

    return {
      midMarketRate,
      meridianFeeInFrom,
      convertedAmount,
      savingsInFrom,
    };
  }, [numericAmount, fromCurr, toCurr]);

  const handleSwap = () => {
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
    <section className="relative overflow-hidden bg-white bg-grid-slate border-b border-slate-200/80">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(16,185,129,0.06) 50%, transparent 75%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Copy & Trust Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span>Global Treasury OS</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono font-semibold text-[#10B981]">4.85% USD Yield</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-[#0F172A] leading-[1.08]">
              Borderless treasury, multi-currency accounts, and{' '}
              <span className="text-[#2563EB]">automated spend.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Consolidate global cash, convert 140+ currencies at interbank rates, and issue
              programmable corporate cards from a single institutional-grade platform.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onOpenAccount('account')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Open Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenAccount('demo')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-slate-200 rounded-xl shadow-sm transition-all"
              >
                <span>Book a Demo</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#0F172A] tabular-nums">
                  $4.2B+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Processed Annually</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#0F172A] tabular-nums">
                  140+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Local Currencies</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#10B981] tabular-nums">
                  0.15%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Flat FX Spread</div>
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
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-elevated p-5 sm:p-7">
              {/* Calculator Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A]">
                    Live FX &amp; Fee Calculator
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transparent interbank pricing with zero hidden wire markups
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#059669] text-[11px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>LIVE RATE</span>
                </div>
              </div>

              {/* You Send */}
              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>You send</span>
                    <span className="font-mono">
                      Balance: {CURRENCIES[fromCurr].symbol}250,000.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="font-mono text-xl sm:text-2xl font-medium text-slate-400">
                        {CURRENCIES[fromCurr].symbol}
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amountStr}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                          setAmountStr(cleaned);
                        }}
                        aria-label="Send amount"
                        className="w-full bg-transparent font-mono text-2xl sm:text-[28px] font-semibold text-[#0F172A] focus:outline-none tabular-nums"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm shrink-0">
                      <CurrencyBadge code={fromCurr} />
                      <select
                        value={fromCurr}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next === toCurr) {
                            setToCurr(fromCurr);
                          }
                          setFromCurr(next);
                        }}
                        aria-label="Source currency"
                        className="bg-transparent font-semibold text-sm text-[#0F172A] focus:outline-none cursor-pointer pr-1"
                      >
                        {Object.keys(CURRENCIES).map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Swap Button Divider */}
                <div className="relative flex items-center justify-center -my-3 z-10">
                  <motion.button
                    type="button"
                    onClick={handleSwap}
                    animate={{ rotate: swapRotation }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    aria-label="Swap currencies"
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-[#2563EB] hover:text-[#2563EB] text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Recipient Gets */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Recipient gets</span>
                    <span className="inline-flex items-center gap-1 text-[#10B981] font-medium">
                      <Zap className="w-3 h-3" />
                      Instant Settlement
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-2xl sm:text-[28px] font-semibold text-[#0F172A] tabular-nums truncate">
                      {CURRENCIES[toCurr].symbol}
                      {formatMoney(calculation.convertedAmount, toCurr)}
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
                      <CurrencyBadge code={toCurr} />
                      <select
                        value={toCurr}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next === fromCurr) {
                            setFromCurr(toCurr);
                          }
                          setToCurr(next);
                        }}
                        aria-label="Target currency"
                        className="bg-transparent font-semibold text-sm text-[#0F172A] focus:outline-none cursor-pointer pr-1"
                      >
                        {Object.keys(CURRENCIES).map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate & Fee Breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Interbank mid-market rate</span>
                  <span className="font-mono font-medium text-[#0F172A] tabular-nums">
                    1 {fromCurr} = {calculation.midMarketRate.toFixed(4)} {toCurr}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Meridian FX fee (0.15%)</span>
                  <span className="font-mono font-medium text-[#0F172A] tabular-nums">
                    {CURRENCIES[fromCurr].symbol}
                    {formatMoney(calculation.meridianFeeInFrom, fromCurr)} {fromCurr}
                  </span>
                </div>
              </div>

              {/* Savings Callout */}
              <div className="mt-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#059669] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                    Estimated savings vs. traditional banks
                  </span>
                </div>
                <span className="font-mono text-sm sm:text-base font-bold text-[#059669] tabular-nums shrink-0">
                  +{CURRENCIES[fromCurr].symbol}
                  {formatMoney(calculation.savingsInFrom, fromCurr)}
                </span>
              </div>

              {/* Action CTA */}
              <button
                type="button"
                onClick={() => onOpenAccount('account')}
                className="mt-4 w-full py-3.5 px-5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Lock Rate &amp; Open Treasury Account</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
