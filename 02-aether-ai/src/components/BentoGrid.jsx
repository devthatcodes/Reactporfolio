import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  GitBranch,
  Layers,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

function GlowCard({ children, className = '' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#111115] p-6 transition-colors hover:border-zinc-700 ${className}`}
    >
      {/* Mouse-tracking radial glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.06) 40%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between">{children}</div>
    </motion.div>
  );
}

export default function BentoGrid() {
  // Card 1: Semantic Caching state
  const [threshold, setThreshold] = useState('0.95');

  // Card 2: Multi-Model Failover state
  const [outageSimulated, setOutageSimulated] = useState(false);

  // Card 3: Trace Inspector state
  const [activeSpan, setActiveSpan] = useState('llm.stream');

  // Card 4: Prompt Versioning state
  const [canarySplit, setCanarySplit] = useState(20);

  const spans = [
    { id: 'gateway.auth', label: 'gateway.auth', ms: '2ms', width: '12%', color: 'bg-cyan-400', detail: 'JWT + Rate Limit Verified' },
    { id: 'cache.lookup', label: 'cache.lookup', ms: '6ms', width: '24%', color: 'bg-emerald-400', detail: 'Cosine 0.88 (Miss → Origin)' },
    { id: 'llm.stream', label: 'llm.stream', ms: '184ms', width: '82%', color: 'bg-violet-400', detail: 'claude-3-5-sonnet • 412 tok' },
    { id: 'guardrail.pii', label: 'guardrail.pii', ms: '4ms', width: '16%', color: 'bg-amber-400', detail: '0 PII Entities Redacted' },
  ];

  return (
    <section id="platform" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
            Core Infrastructure
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
            Built for zero-downtime AI at scale.
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Every primitive you need to ship deterministic, observable, and cost-efficient LLM applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Card 1: Semantic Caching */}
          <GlowCard className="lg:col-span-7">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Semantic Caching</h3>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-[#27272A] bg-[#09090B] p-0.5 font-mono text-[11px]">
                  {['0.92', '0.95', '0.98'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setThreshold(val)}
                      className={`rounded-md px-2 py-0.5 transition-colors ${
                        threshold === val ? 'bg-[#1D1D24] text-cyan-300' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      cos ≥ {val}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Serve semantically identical queries from edge vector memory in under 12ms instead of paying for redundant origin inference.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-[#27272A] bg-[#09090B] p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>&quot;Summarize Q3 ARR growth drivers&quot;</span>
                <span className="text-emerald-400">
                  {threshold === '0.98' ? '0.96 (Miss → 620ms)' : '0.96 (HIT • 11ms)'}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#18181D]">
                <motion.div
                  animate={{ width: threshold === '0.98' ? '32%' : '94%' }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                />
              </div>
              <div className="mt-2.5 flex justify-between text-[11px] text-zinc-500">
                <span>Est. Monthly Savings: {threshold === '0.92' ? '$4,820' : threshold === '0.95' ? '$3,910' : '$1,640'}</span>
                <span>Edge Vector Store</span>
              </div>
            </div>
          </GlowCard>

          {/* Card 2: Multi-Model Failover */}
          <GlowCard className="lg:col-span-5">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10 text-violet-400">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Multi-Model Failover</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOutageSimulated((prev) => !prev)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    outageSimulated
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                      : 'border-[#27272A] bg-[#09090B] text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {outageSimulated ? 'Reset Primary' : 'Simulate 503'}
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                Automatic circuit-breaking reroutes traffic to secondary providers in &lt;4ms on 429s or 5xx spikes.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 rounded-xl border border-[#27272A] bg-[#09090B] p-4 font-mono text-xs">
              <div className="flex items-center justify-between rounded-lg border border-[#27272A] bg-[#111115] px-3 py-2">
                <span className="text-zinc-300">Primary: OpenAI GPT-4o</span>
                {outageSimulated ? (
                  <span className="inline-flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5" /> 503 Timeout
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 200 OK
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#27272A] bg-[#111115] px-3 py-2">
                <span className="text-zinc-300">Fallback: Claude 3.5 Sonnet</span>
                <span className={outageSimulated ? 'text-cyan-300' : 'text-zinc-500'}>
                  {outageSimulated ? 'ACTIVE (3.4ms)' : 'Standby'}
                </span>
              </div>
            </div>
          </GlowCard>

          {/* Card 3: Trace Inspector */}
          <GlowCard className="lg:col-span-5">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-[#FAFAFA]">Trace Inspector</h3>
              </div>
              <p className="text-sm text-zinc-400">
                OpenTelemetry-native waterfall traces for every prompt, retrieval step, tool call, and guardrail check.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-[#27272A] bg-[#09090B] p-3.5 font-mono text-[11px]">
              <div className="space-y-2">
                {spans.map((span) => {
                  const selected = activeSpan === span.id;
                  return (
                    <button
                      key={span.id}
                      type="button"
                      onClick={() => setActiveSpan(span.id)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1 text-left transition-colors ${
                        selected ? 'bg-[#18181D]' : 'hover:bg-[#111115]'
                      }`}
                    >
                      <span className="w-24 shrink-0 truncate text-zinc-400">{span.label}</span>
                      <div className="h-2 flex-1 rounded-full bg-[#18181D]">
                        <div className={`h-full rounded-full ${span.color}`} style={{ width: span.width }} />
                      </div>
                      <span className="w-11 text-right text-zinc-300">{span.ms}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-[#27272A] pt-2 text-[11px] text-cyan-300">
                Span: {spans.find((s) => s.id === activeSpan)?.detail}
              </div>
            </div>
          </GlowCard>

          {/* Card 4: Prompt Versioning */}
          <GlowCard className="lg:col-span-7">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10 text-violet-400">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Prompt Versioning & Canary Splits</h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 font-mono text-[11px] text-violet-300">
                  <Sparkles className="h-3 w-3" /> Live A/B
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                Ship prompt updates independently of your codebase. Roll out canary weights and compare eval scores in real time.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-[#27272A] bg-[#09090B] p-4">
              <div className="mb-3 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-300">
                  v2.4-prod <strong className="text-cyan-400">{100 - canarySplit}%</strong>
                </span>
                <span className="text-zinc-300">
                  v2.5-canary <strong className="text-violet-400">{canarySplit}%</strong>
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={canarySplit}
                onChange={(e) => setCanarySplit(Number(e.target.value))}
                aria-label="Canary traffic split percentage"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#27272A] accent-cyan-400"
              />

              <div className="mt-3 grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="rounded-lg border border-[#27272A] bg-[#111115] px-3 py-2">
                  <span className="text-zinc-500">v2.4 Eval Accuracy</span>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-200">91.4%</p>
                </div>
                <div className="rounded-lg border border-[#27272A] bg-[#111115] px-3 py-2">
                  <span className="text-zinc-500">v2.5 Eval Accuracy</span>
                  <p className="mt-0.5 text-sm font-semibold text-emerald-400">95.8% (+4.4%)</p>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
