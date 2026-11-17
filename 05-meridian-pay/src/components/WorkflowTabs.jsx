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
} from 'lucide-react';

const TABS = [
  { id: 'payouts', label: 'Global Payouts', icon: Send },
  { id: 'yield', label: 'Treasury Yield', icon: TrendingUp },
  { id: 'expenses', label: 'Expense Controls', icon: Receipt },
  { id: 'api', label: 'API & Webhooks', icon: Terminal },
];

const INITIAL_PAYOUTS = [
  { id: 'INV-8841', vendor: 'Krono Design GmbH', rail: 'SEPA Instant', amount: '€38,400.00', usd: '$41,675' },
  { id: 'INV-8842', vendor: 'Thames Cloud Ltd', rail: 'Faster Payments', amount: '£24,150.00', usd: '$30,705' },
  { id: 'INV-8843', vendor: 'Tokyo Robotics KK', rail: 'Zengin Wire', amount: '¥6,420,000', usd: '$42,398' },
  { id: 'INV-8844', vendor: 'NorthStar Labs Inc', rail: 'EFT Canada', amount: 'C$38,950.00', usd: '$28,031' },
];

const INITIAL_EXPENSES = [
  { id: 'EXP-102', user: 'Maya Lin', merchant: 'AWS Cloud Services', amount: '$4,280.00', status: 'Pending' },
  { id: 'EXP-103', user: 'David Park', merchant: 'Lufthansa Airlines', amount: '$1,840.50', status: 'Approved' },
  { id: 'EXP-104', user: 'Elena Rostova', merchant: 'Figma Enterprise', amount: '$960.00', status: 'Pending' },
];

export default function WorkflowTabs() {
  const [activeTab, setActiveTab] = useState('payouts');

  // Payouts state
  const [batchSettled, setBatchSettled] = useState(false);

  // Yield state
  const [treasuryBalance, setTreasuryBalance] = useState(2500000);

  // Expenses state
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  // API state
  const [copied, setCopied] = useState(false);
  const [webhookTested, setWebhookTested] = useState(false);

  const handleCopy = () => {
    const snippet = `curl -X POST https://api.meridian.pay/v1/transfers \\\n  -H "Authorization: Bearer mk_live_98f2a..." \\\n  -d '{"amount": 4167500, "currency": "EUR", "rail": "sepa_instant"}'`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const approveExpense = (id) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  };

  const annualYield = Math.round(treasuryBalance * 0.0485);

  return (
    <section id="workflows" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#10B981] mb-2.5">
            Unified Financial Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            One workspace for every treasury workflow.
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Explore how finance teams automate global disbursements, earn institutional yield,
            enforce spend policies, and integrate via REST APIs.
          </p>
        </div>

        {/* LayoutId Tab Bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-[#F8FAFC] border border-slate-200">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="workflowTab"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-xl bg-[#0F172A] shadow-sm"
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
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card-elevated overflow-hidden">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase">
                        Batch #B-2026-11 · 4 Recipients
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                        Multi-Currency Vendor Disbursement
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBatchSettled((s) => !s)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${
                          batchSettled
                            ? 'bg-[#10B981]/10 text-[#059669] border border-[#10B981]/30'
                            : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm'
                        }`}
                      >
                        {batchSettled ? 'Batch Settled · Reset Demo' : 'Execute Batch ($142,809)'}
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {INITIAL_PAYOUTS.map((row) => (
                      <div
                        key={row.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-xs text-slate-400">{row.id}</span>
                          <div>
                            <div className="text-sm font-semibold text-[#0F172A]">
                              {row.vendor}
                            </div>
                            <div className="text-xs text-slate-500">Rail: {row.rail}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="font-mono text-sm font-semibold text-[#0F172A] tabular-nums">
                              {row.amount}
                            </div>
                            <div className="font-mono text-xs text-slate-400 tabular-nums">
                              ≈ {row.usd}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              batchSettled
                                ? 'bg-[#10B981]/10 text-[#059669]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {batchSettled && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {batchSettled ? 'Settled' : 'Ready'}
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#059669] font-mono text-xs font-semibold">
                        4.85% APY · U.S. T-Bills
                      </span>
                      <h3 className="text-xl font-bold text-[#0F172A] mt-3">
                        Automated Overnight Treasury Sweep
                      </h3>
                      <p className="text-sm text-slate-600 mt-1.5">
                        Idle operating cash automatically sweeps into SIPC-insured U.S. Treasury
                        money market funds with same-day liquidity.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>Allocated Treasury Balance</span>
                        <span className="font-mono font-bold text-[#0F172A]">
                          ${(treasuryBalance / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={10000000}
                        step={250000}
                        value={treasuryBalance}
                        onChange={(e) => setTreasuryBalance(Number(e.target.value))}
                        aria-label="Treasury balance"
                        className="meridian-slider w-full bg-slate-200 rounded-full h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                        <div className="text-xs text-slate-500">Projected Annual Yield</div>
                        <div className="font-mono text-xl font-bold text-[#10B981] mt-1 tabular-nums">
                          +${annualYield.toLocaleString('en-US')}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                        <div className="text-xs text-slate-500">Liquidity Window</div>
                        <div className="font-mono text-xl font-bold text-[#0F172A] mt-1">
                          Same-Day
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean SVG Yield Projection Chart */}
                  <div className="md:col-span-6 rounded-xl bg-[#0F172A] p-5 text-white">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span>12-Month Yield Compounding</span>
                      <span className="font-mono text-[#10B981]">+4.85% APY</span>
                    </div>
                    <svg viewBox="0 0 360 150" className="w-full h-40 overflow-visible">
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
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
                      <circle cx="350" cy="20" r="5" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
                    </svg>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
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
                  <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        Real-Time Expense Approval Queue
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Click Approve to test instant policy reconciliation
                      </p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-semibold">
                      Auto-Sync: NetSuite
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {expenses.map((exp) => (
                      <div
                        key={exp.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-[#0F172A]">
                            {exp.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#0F172A]">
                              {exp.merchant}
                            </div>
                            <div className="text-xs text-slate-500">
                              {exp.user} · {exp.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-mono text-sm font-semibold text-[#0F172A] tabular-nums">
                            {exp.amount}
                          </span>
                          {exp.status === 'Approved' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#059669] text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => approveExpense(exp.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold transition-colors"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
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
                  className="bg-[#0F172A] text-white p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-xs font-semibold">
                        POST
                      </span>
                      <span className="font-mono text-xs sm:text-sm text-slate-300">
                        /v1/treasury/transfers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? 'Copied' : 'Copy cURL'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebhookTested(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Send Test Event</span>
                      </button>
                    </div>
                  </div>

                  <pre className="font-mono text-xs sm:text-sm text-slate-200 bg-black/30 rounded-xl p-4 overflow-x-auto leading-relaxed border border-white/10">
{`curl -X POST https://api.meridian.pay/v1/treasury/transfers \\
  -H "Authorization: Bearer mk_live_98f2a4c1" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_account": "acct_usd_01H9X",
    "destination_currency": "EUR",
    "amount_cents": 4167500,
    "rail": "sepa_instant",
    "idempotency_key": "tx_2026_11_8841"
  }'`}
                  </pre>

                  {webhookTested && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 p-3.5 font-mono text-xs text-emerald-200 flex items-center justify-between"
                    >
                      <span>200 OK · transfer.settled (evt_98f2a) · 142ms</span>
                      <span className="text-[#10B981] font-semibold">VERIFIED</span>
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
