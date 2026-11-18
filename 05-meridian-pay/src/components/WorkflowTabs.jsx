import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  TrendingUp,
  Receipt,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Play,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const TABS = [
  { id: 'payouts', label: '01 // Global Payouts', icon: Send },
  { id: 'yield', label: '02 // Treasury Yield', icon: TrendingUp },
  { id: 'expenses', label: '03 // Expense Quorum', icon: Receipt },
  { id: 'api', label: '04 // API & Webhooks', icon: Terminal },
];

const INITIAL_PAYOUTS = [
  {
    id: 'INV-8841',
    vendor: 'Krono Design GmbH',
    rail: 'SEPA Instant RT1',
    amount: '€38,400.00',
    usd: '$41,675',
  },
  {
    id: 'INV-8842',
    vendor: 'Thames Cloud Ltd',
    rail: 'CHAPS / Faster Payments',
    amount: '£24,150.00',
    usd: '$30,705',
  },
  {
    id: 'INV-8843',
    vendor: 'Tokyo Robotics KK',
    rail: 'BOJ Zengin Atomic',
    amount: '¥6,420,000',
    usd: '$42,398',
  },
  {
    id: 'INV-8844',
    vendor: 'NorthStar Labs Inc',
    rail: 'Lynx High-Value Rail',
    amount: 'C$38,950.00',
    usd: '$28,031',
  },
];

const INITIAL_EXPENSES = [
  {
    id: 'EXP-102',
    user: 'Maya Lin',
    merchant: 'AWS H100 Cluster',
    amount: '$14,280.00',
    status: 'Pending',
  },
  {
    id: 'EXP-103',
    user: 'David Park',
    merchant: 'Lufthansa Executive',
    amount: '$3,840.50',
    status: 'Approved',
  },
  {
    id: 'EXP-104',
    user: 'Elena Rostova',
    merchant: 'Figma Enterprise Annual',
    amount: '$4,960.00',
    status: 'Pending',
  },
];

export default function WorkflowTabs({ onShaderPulse }) {
  const [activeTab, setActiveTab] = useState('payouts');
  const [batchSettled, setBatchSettled] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(5000000);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [copied, setCopied] = useState(false);
  const [webhookTested, setWebhookTested] = useState(false);

  const handleCopy = () => {
    soundEngine.playConfirm();
    const snippet = `curl -X POST https://api.meridian.pay/v1/treasury/transfers \\\n  -H "Authorization: Bearer mk_live_98f2a..." \\\n  -d '{"amount": 4167500, "currency": "EUR", "rail": "sepa_instant"}'`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const approveExpense = (id) => {
    soundEngine.playConfirm();
    if (onShaderPulse) onShaderPulse();
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  };

  const annualYield = Math.round(treasuryBalance * 0.0485);

  return (
    <section id="workflows" className="relative py-24 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-mono font-semibold uppercase tracking-widest text-[#10B981] mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>04 // AUTONOMOUS TREASURY WORKFLOW ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            <ScrambleText text="One OS for Every Liquidity Rail." />
          </h2>
          <p className="text-base text-slate-400 mt-3">
            Automate multi-currency vendor disbursements, sweep idle cash into U.S. Treasury
            repos, enforce hardware-signed spend quorums, and orchestrate via REST webhooks.
          </p>
        </div>

        {/* LayoutId Tab Bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-[#070D19] border border-white/15 shadow-lg">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-cursor={`MODULE: ${tab.id.toUpperCase()}`}
                  onMouseEnter={() => soundEngine.playHover(1.05)}
                  onClick={() => {
                    soundEngine.playClick();
                    if (onShaderPulse) onShaderPulse();
                    setActiveTab(tab.id);
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-[#030712]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="workflowTab"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-xl bg-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Tab Preview Panel */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-white/15 bg-[#070D19]/90 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.75)] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'payouts' && (
                <motion.div
                  key="payouts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <div className="text-xs font-mono text-[#10B981] uppercase tracking-wider">
                        BATCH #B-2026-11 · 4 ATOMIC CORRIDORS
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Multi-Currency Institutional Disbursement
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        data-cursor="EXECUTE RAIL"
                        onClick={() => {
                          soundEngine.playConfirm();
                          if (onShaderPulse) onShaderPulse();
                          setBatchSettled((s) => !s);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${
                          batchSettled
                            ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40'
                            : 'bg-[#10B981] hover:bg-[#34D399] text-[#030712] shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                        }`}
                      >
                        {batchSettled
                          ? 'Batch Settled (38ms) · Reset Demo'
                          : 'Execute Atomic Batch ($142,809)'}
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-white/10 mt-2">
                    {INITIAL_PAYOUTS.map((row) => (
                      <div
                        key={row.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-xs text-cyan-400">{row.id}</span>
                          <div>
                            <div className="text-sm font-semibold text-white">{row.vendor}</div>
                            <div className="text-xs font-mono text-slate-400">
                              Rail: {row.rail}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold text-white tabular-nums">
                              {row.amount}
                            </div>
                            <div className="font-mono text-xs text-slate-400 tabular-nums">
                              ≈ {row.usd}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                              batchSettled
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-white/5 text-slate-300 border border-white/10'
                            }`}
                          >
                            {batchSettled && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {batchSettled ? 'SETTLED' : 'QUEUED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'yield' && (
                <motion.div
                  key="yield"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-6 space-y-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-xs font-semibold">
                        4.85% APY · U.S. T-BILL REPO
                      </span>
                      <h3 className="text-xl font-bold text-white mt-3">
                        Automated Overnight Treasury Sweep
                      </h3>
                      <p className="text-sm text-slate-400 mt-1.5">
                        Idle operating cash automatically sweeps into SIPC-insured U.S. Treasury
                        money market vaults with instant T+0 recall.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>ALLOCATED TREASURY BALANCE</span>
                        <span className="font-bold text-white">
                          ${(treasuryBalance / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={25000000}
                        step={500000}
                        value={treasuryBalance}
                        onChange={(e) => setTreasuryBalance(Number(e.target.value))}
                        aria-label="Treasury balance"
                        className="meridian-slider w-full bg-slate-800 rounded-full h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-[#030712]/80 border border-white/10">
                        <div className="text-xs font-mono text-slate-400">
                          PROJECTED ANNUAL YIELD
                        </div>
                        <div className="font-mono text-xl font-bold text-[#10B981] mt-1 tabular-nums">
                          +${annualYield.toLocaleString('en-US')}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#030712]/80 border border-white/10">
                        <div className="text-xs font-mono text-slate-400">LIQUIDITY WINDOW</div>
                        <div className="font-mono text-xl font-bold text-cyan-400 mt-1">
                          Instant T+0
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean SVG Yield Projection Chart */}
                  <div className="md:col-span-6 rounded-2xl bg-[#030712] border border-white/10 p-5 text-white">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                      <span>12-MONTH COMPOUNDING CURVE</span>
                      <span className="text-[#10B981]">+4.85% APY</span>
                    </div>
                    <svg viewBox="0 0 360 150" className="w-full h-40 overflow-visible">
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 10 130 Q 100 112 180 82 T 350 20 L 350 140 L 10 140 Z"
                        fill="url(#yieldGrad)"
                      />
                      <path
                        d="M 10 130 Q 100 112 180 82 T 350 20"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="350"
                        cy="20"
                        r="5"
                        fill="#10B981"
                        stroke="#030712"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                      <span>Q1</span>
                      <span>Q2</span>
                      <span>Q3</span>
                      <span>Q4</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'expenses' && (
                <motion.div
                  key="expenses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between pb-5 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Cryptographic Expense Quorum Queue
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click Approve to sign policy attestation and sync to NetSuite
                      </p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-semibold">
                      ERP SYNC: LIVE
                    </span>
                  </div>

                  <div className="divide-y divide-white/10 mt-2">
                    {expenses.map((exp) => (
                      <div
                        key={exp.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-[#10B981]">
                            {exp.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{exp.merchant}</div>
                            <div className="text-xs font-mono text-slate-400">
                              {exp.user} · {exp.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-mono text-sm font-bold text-white tabular-nums">
                            {exp.amount}
                          </span>
                          {exp.status === 'Approved' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              SIGNED
                            </span>
                          ) : (
                            <button
                              type="button"
                              data-cursor="SIGN APPROVAL"
                              onClick={() => approveExpense(exp.id)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-[#030712] text-xs font-mono font-bold uppercase transition-colors"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="bg-[#030712] text-white p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-xs font-semibold">
                        POST
                      </span>
                      <span className="font-mono text-xs sm:text-sm text-slate-300">
                        /v1/treasury/atomic-transfers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? 'COPIED' : 'COPY cURL'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playConfirm();
                          if (onShaderPulse) onShaderPulse();
                          setWebhookTested(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-[#030712] text-xs font-mono font-bold uppercase transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Dispatch Webhook</span>
                      </button>
                    </div>
                  </div>

                  <pre className="font-mono text-xs sm:text-sm text-emerald-300/90 bg-[#070D19] rounded-2xl p-4 overflow-x-auto leading-relaxed border border-white/10">
                    {`curl -X POST https://api.meridian.pay/v1/treasury/atomic-transfers \\
  -H "Authorization: Bearer mk_live_quantum_98f2a4c1" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_vault": "vault_usd_01H9X",
    "destination_currency": "EUR",
    "amount_cents": 4167500,
    "rail": "sepa_instant_rt1",
    "zk_attestation": true
  }'`}
                  </pre>

                  {webhookTested && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 p-3.5 font-mono text-xs text-emerald-200 flex items-center justify-between"
                    >
                      <span>200 OK · transfer.atomic_settled (evt_98f2a) · 38ms</span>
                      <span className="text-[#10B981] font-bold">ZK-VERIFIED</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
