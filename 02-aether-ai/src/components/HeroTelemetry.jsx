import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Cpu,
  Pause,
  Play,
  Terminal,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const REGIONS = {
  'us-east-1': { baseLatency: 14, throughput: 48200, cacheHit: 64.2 },
  'eu-central-1': { baseLatency: 18, throughput: 31900, cacheHit: 58.7 },
  'ap-northeast-1': { baseLatency: 22, throughput: 24600, cacheHit: 61.4 },
};

const MODEL_NODES = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    share: '46%',
    ttft: '210ms',
    status: 'Healthy',
    color: '#22D3EE',
  },
  {
    id: 'claude-35',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    share: '38%',
    ttft: '185ms',
    status: 'Healthy',
    color: '#8B5CF6',
  },
  {
    id: 'llama-405b',
    name: 'Llama 3.1 405B',
    provider: 'Together / vLLM',
    share: '16%',
    ttft: '142ms',
    status: 'Standby',
    color: '#34D399',
  },
];

export default function HeroTelemetry({ onOpenModal }) {
  const [region, setRegion] = useState('us-east-1');
  const [isLive, setIsLive] = useState(true);
  const [selectedModel, setSelectedModel] = useState(MODEL_NODES[0].id);
  const [series, setSeries] = useState([15, 18, 14, 19, 13, 16, 21, 15, 14, 17, 13, 15, 16, 14, 15, 13]);
  const [throughput, setThroughput] = useState(REGIONS['us-east-1'].throughput);

  useEffect(() => {
    setThroughput(REGIONS[region].throughput);
  }, [region]);

  useEffect(() => {
    if (!isLive) return undefined;
    const interval = setInterval(() => {
      const base = REGIONS[region].baseLatency;
      const jitter = Math.round((Math.random() - 0.45) * 6);
      const nextVal = Math.max(9, Math.min(34, base + jitter));
      setSeries((prev) => [...prev.slice(1), nextVal]);
      setThroughput(REGIONS[region].throughput + Math.round((Math.random() - 0.5) * 1400));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLive, region]);

  const sparkline = useMemo(() => {
    const width = 420;
    const height = 92;
    const maxVal = 36;
    const minVal = 6;
    const stepX = width / (series.length - 1);

    const points = series.map((val, idx) => {
      const x = idx * stepX;
      const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 16) - 8;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
    return { linePath, areaPath, lastPoint: points[points.length - 1].split(',') };
  }, [series]);

  const activeNode = MODEL_NODES.find((m) => m.id === selectedModel) || MODEL_NODES[0];
  const currentP50 = series[series.length - 1];
  const currentP95 = Math.round(currentP50 * 1.65);

  return (
    <section id="telemetry" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Animated Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.05, 0.96, 1.05], opacity: [0.2, 0.32, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-10 right-1/4 h-[380px] w-[380px] translate-x-1/3 rounded-full bg-violet-600/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#111115]/90 px-3.5 py-1.5 text-xs font-medium text-zinc-300"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>v2.4 Edge Gateway • Sub-10ms Semantic Routing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-4xl font-extrabold tracking-tight text-[#FAFAFA] sm:text-6xl lg:text-[64px] lg:leading-[1.06]"
          >
            Real-time observability and routing for{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              production AI
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Unify OpenAI, Anthropic, and self-hosted models behind a single ultra-low-latency gateway.
            Cut inference spend by 42% with semantic caching, automatic failover, and full-trace telemetry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-[#09090B] shadow-lg shadow-cyan-500/15 transition-opacity hover:opacity-90"
            >
              <span>Get API Key</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#sdk"
              className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#111115] px-6 py-3 text-sm font-semibold text-[#FAFAFA] transition-colors hover:border-zinc-600 hover:bg-[#18181D]"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Explore SDK</span>
            </a>
          </motion.div>
        </div>

        {/* Interactive Live Telemetry Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="mx-auto mt-14 max-w-5xl rounded-2xl border border-[#27272A] bg-[#111115]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-6"
        >
          {/* Telemetry Top Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-1">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-xs text-zinc-300">aether://telemetry/live</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Region Selector */}
              <div className="flex rounded-lg border border-[#27272A] bg-[#09090B] p-0.5">
                {Object.keys(REGIONS).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setRegion(reg)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      region === reg
                        ? 'bg-[#1D1D24] text-cyan-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              {/* Pause/Live Button */}
              <button
                type="button"
                onClick={() => setIsLive((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#09090B] px-2.5 py-1 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-600"
              >
                {isLive ? (
                  <>
                    <Pause className="h-3 w-3 text-cyan-400" />
                    <span>LIVE</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 text-amber-400" />
                    <span>PAUSED</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Telemetry Main Grid */}
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Left: Sparkline & Throughput */}
            <div className="flex flex-col justify-between rounded-xl border border-[#27272A] bg-[#09090B] p-4 lg:col-span-6">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Gateway Overhead Latency
                  </span>
                  <div className="mt-1 flex items-baseline gap-2.5">
                    <span className="font-mono text-2xl font-bold text-[#FAFAFA]">
                      {currentP50}ms
                    </span>
                    <span className="font-mono text-xs text-emerald-400">
                      p50 • p95: {currentP95}ms
                    </span>
                  </div>
                </div>
                <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                  {region}
                </span>
              </div>

              {/* Sparkline SVG */}
              <div className="my-2 overflow-hidden">
                <svg viewBox="0 0 420 92" className="h-24 w-full overflow-visible">
                  <defs>
                    <linearGradient id="spark-stroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={sparkline.areaPath} fill="url(#spark-fill)" />
                  <path
                    d={sparkline.linePath}
                    fill="none"
                    stroke="url(#spark-stroke)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={sparkline.lastPoint[0]}
                    cy={sparkline.lastPoint[1]}
                    r="4"
                    fill="#22D3EE"
                  />
                  <circle
                    cx={sparkline.lastPoint[0]}
                    cy={sparkline.lastPoint[1]}
                    r="8"
                    fill="#22D3EE"
                    fillOpacity="0.25"
                  />
                </svg>
              </div>

              {/* Bottom KPI row */}
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[#27272A]/80 pt-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Token Throughput
                  </span>
                  <p className="mt-0.5 font-mono text-base font-semibold text-[#FAFAFA]">
                    {throughput.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-zinc-400">tok/s</span>
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Semantic Cache Hit
                  </span>
                  <p className="mt-0.5 font-mono text-base font-semibold text-emerald-400">
                    {REGIONS[region].cacheHit}%{' '}
                    <span className="text-xs font-normal text-zinc-500">(-$1.4k/day)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Model Routing Nodes */}
            <div className="flex flex-col justify-between rounded-xl border border-[#27272A] bg-[#09090B] p-4 lg:col-span-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Interactive Model Router
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  Click node to inspect
                </span>
              </div>

              {/* Routing Diagram */}
              <div className="relative my-1 flex items-center justify-between gap-3">
                {/* Gateway Source Node */}
                <div className="z-10 flex w-28 shrink-0 flex-col items-center rounded-xl border border-cyan-400/40 bg-[#111115] p-3 text-center shadow-lg shadow-cyan-500/5">
                  <Cpu className="mb-1.5 h-5 w-5 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Aether Edge</span>
                  <span className="mt-0.5 font-mono text-[10px] text-cyan-400">Router v2.4</span>
                </div>

                {/* Animated Connecting SVG Lines */}
                <svg
                  className="pointer-events-none hidden h-36 w-20 shrink-0 sm:block"
                  viewBox="0 0 80 144"
                  fill="none"
                >
                  {[24, 72, 120].map((yEnd, idx) => {
                    const pathD = `M 0 72 C 36 72, 44 ${yEnd}, 80 ${yEnd}`;
                    const isActive = MODEL_NODES[idx].id === selectedModel;
                    return (
                      <g key={yEnd}>
                        <path
                          d={pathD}
                          stroke={isActive ? MODEL_NODES[idx].color : '#27272A'}
                          strokeWidth={isActive ? '2' : '1.25'}
                          strokeDasharray={isActive ? 'none' : '3 3'}
                        />
                        {isLive && (
                          <circle r="3" fill={MODEL_NODES[idx].color}>
                            <animateMotion
                              dur={`${1.4 + idx * 0.35}s`}
                              repeatCount="indefinite"
                              path={pathD}
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Target Model Nodes */}
                <div className="flex flex-1 flex-col gap-2">
                  {MODEL_NODES.map((node) => {
                    const isSelected = node.id === selectedModel;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedModel(node.id)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-all ${
                          isSelected
                            ? 'border-cyan-400/60 bg-[#16161C] shadow-md'
                            : 'border-[#27272A] bg-[#111115] hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#FAFAFA]">{node.name}</p>
                            <p className="font-mono text-[10px] text-zinc-500">{node.provider}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-medium text-zinc-300">
                          {node.share}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Node Inspector Footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#27272A]/80 bg-[#111115] px-3 py-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{activeNode.name}:</span>
                  <span className="text-emerald-400">{activeNode.status}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <span>
                    TTFT: <strong className="text-zinc-200">{activeNode.ttft}</strong>
                  </span>
                  <span>
                    Weight: <strong className="text-cyan-300">{activeNode.share}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
