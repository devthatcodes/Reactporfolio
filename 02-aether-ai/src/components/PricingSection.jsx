import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ChevronDown } from 'lucide-react';

const TIERS = [
  {
    name: 'Starter',
    description: 'For solo developers and early prototypes.',
    monthlyPrice: 0,
    annualPrice: 0,
    cta: 'Start Free',
    popular: false,
    features: [
      '100,000 monthly requests included',
      '7-day trace retention',
      'Multi-model routing (up to 3 providers)',
      'Community Discord support',
    ],
  },
  {
    name: 'Pro',
    description: 'For production AI teams scaling traffic and evals.',
    monthlyPrice: 79,
    annualPrice: 63,
    cta: 'Get Pro Sandbox Key',
    popular: true,
    features: [
      '2,500,000 monthly requests included',
      '30-day trace & payload retention',
      'Edge semantic caching (sub-12ms)',
      'Automatic circuit-breaker failover',
      'Prompt versioning & canary splits',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Dedicated VPC, custom SLAs, and compliance.',
    monthlyPrice: null,
    annualPrice: null,
    cta: 'Request Enterprise Key',
    popular: false,
    features: [
      'Unlimited requests & custom throughput',
      '365-day retention + OTel export',
      'Private VPC / On-prem edge deployment',
      'SOC 2 Type II, HIPAA BAA & Zero-Retention',
      '24/7 dedicated Slack & solutions engineer',
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: 'Monthly Edge Requests', starter: '100K', pro: '2.5M', enterprise: 'Unlimited' },
  { feature: 'Semantic Cache Hit Rate', starter: 'Standard', pro: 'Edge Vector', enterprise: 'Dedicated Cluster' },
  { feature: 'Trace Retention', starter: '7 Days', pro: '30 Days', enterprise: '365 Days' },
  { feature: 'Failover Latency SLA', starter: 'Best Effort', pro: '99.95%', enterprise: '99.99% Contractual' },
  { feature: 'PII Guardrails & Redaction', starter: '—', pro: 'Included', enterprise: 'Custom Policies' },
];

export default function PricingSection({ onSelectPlan }) {
  const [annual, setAnnual] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="pricing" className="border-t border-[#27272A]/80 bg-[#09090B] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
            Predictable pricing that scales with tokens.
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Start free in seconds. Upgrade when your production traffic demands edge caching and SLAs.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#27272A] bg-[#111115] p-1.5">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                !annual ? 'bg-[#27272A] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                annual ? 'bg-[#27272A] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Annual</span>
              <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className={`relative flex flex-col justify-between rounded-2xl border p-7 ${
                  tier.popular
                    ? 'border-cyan-400/50 bg-[#111115] shadow-2xl shadow-cyan-500/10'
                    : 'border-[#27272A] bg-[#111115]/70'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-3 py-0.5 text-[11px] font-bold text-[#09090B]">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-[#FAFAFA]">{tier.name}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    {price !== null ? (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${tier.name}-${price}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="font-mono text-4xl font-extrabold text-[#FAFAFA]"
                          >
                            ${price}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-sm text-zinc-500">/ month</span>
                      </>
                    ) : (
                      <span className="font-mono text-4xl font-extrabold text-[#FAFAFA]">Custom</span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 border-t border-[#27272A] pt-6 text-sm text-zinc-300">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(tier.name)}
                  className={`mt-8 w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#09090B] hover:opacity-90'
                      : 'border border-[#27272A] bg-[#09090B] text-[#FAFAFA] hover:border-zinc-600'
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Feature Comparison Toggle */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowComparison((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#111115] px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            <span>{showComparison ? 'Hide' : 'Compare'} full plan specifications</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showComparison ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="overflow-x-auto rounded-2xl border border-[#27272A] bg-[#111115] text-left">
                  <table className="w-full min-w-[540px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#27272A] bg-[#09090B] font-mono text-xs text-zinc-400">
                        <th className="px-5 py-3.5 font-medium">Specification</th>
                        <th className="px-5 py-3.5 font-medium">Starter</th>
                        <th className="px-5 py-3.5 font-medium text-cyan-400">Pro</th>
                        <th className="px-5 py-3.5 font-medium">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]/70 text-xs sm:text-sm">
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row.feature} className="hover:bg-[#16161C]">
                          <td className="px-5 py-3.5 font-medium text-zinc-200">{row.feature}</td>
                          <td className="px-5 py-3.5 font-mono text-zinc-400">{row.starter}</td>
                          <td className="px-5 py-3.5 font-mono text-cyan-300">{row.pro}</td>
                          <td className="px-5 py-3.5 font-mono text-zinc-300">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
