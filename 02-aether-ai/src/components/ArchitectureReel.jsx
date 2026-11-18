import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Activity,
  Zap,
  X,
  Play,
  Sliders,
  Cpu,
  Terminal,
  ShieldCheck,
  Network,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { playHover, playClick, playTransition } from '../utils/soundEngine';

export const CASE_STUDIES = [
  {
    id: 'chronos-9',
    index: '01',
    code: 'CHAPTER // 01-CHRONOS',
    shortName: '01 CHRONOS-9 SWARM',
    title: 'CHRONOS-9 AUTONOMOUS SWARM',
    client: 'Vanguard Orbital Defense',
    category: 'MULTI-AGENT ROUTING FABRIC',
    accent: '#22D3EE',
    secondary: '#8B5CF6',
    metrics: {
      latency: '4.8ms',
      throughput: '142,000 tok/s',
      savings: '48.4%',
      uptime: '99.999%',
    },
    summary:
      'Sub-5ms deterministic consensus and semantic caching across 1,200 concurrent autonomous reasoning agents operating across 18 global edge PoPs.',
    architecture: [
      'Zero-copy gRPC tensor streaming between regional PoP clusters',
      'Cosine-similarity vector cache (0.96 threshold) eliminating 61% redundant calls',
      'Sub-3ms circuit-breaker failover from GPT-4o to dedicated vLLM Llama-3.1-405B nodes',
    ],
    defaultConcurrency: 640,
    topologyNodes: [
      { id: 'edge-us', label: 'US-EAST INGRESS', x: 76, y: 52, load: '94%' },
      { id: 'vec-cache', label: 'COSINE CACHE 0.96', x: 210, y: 36, load: '61% HIT' },
      { id: 'consensus', label: 'RAFT SWARM BUS', x: 210, y: 112, load: '4.8ms' },
      { id: 'vllm-cluster', label: 'LLAMA-405B MESH', x: 344, y: 74, load: '142k/s' },
    ],
    waveformPoints: 'M 0 58 Q 45 18, 90 48 T 180 34 T 270 52 T 360 24 L 420 40',
    configSnippet: `cluster: "chronos-9-orbital"
routing:
  mode: "deterministic-swarm"
  consensus_quorum: 0.994
  semantic_cache:
    enabled: true
    cosine_threshold: 0.96
  failover_chain:
    - provider: "openai/gpt-4o"
    - provider: "vllm/llama-3.1-405b-fp8"`,
  },
  {
    id: 'helios-fabric',
    index: '02',
    code: 'CHAPTER // 02-HELIOS',
    shortName: '02 HELIOS INFERENCE FABRIC',
    title: 'HELIOS SUB-MS INFERENCE FABRIC',
    client: 'Synthetix Quant Markets',
    category: 'HIGH-FREQUENCY TELEMETRY ENGINE',
    accent: '#8B5CF6',
    secondary: '#22D3EE',
    metrics: {
      latency: '3.2ms',
      throughput: '218,500 tok/s',
      savings: '52.1%',
      uptime: '99.998%',
    },
    summary:
      'Real-time financial sentiment and macro-signal extraction pipeline routing 85M daily prompts with deterministic speculative decoding.',
    architecture: [
      'Hardware-accelerated speculative token verification at the edge gateway',
      'Full OpenTelemetry span ingestion with zero runtime latency overhead',
      'Automated canary prompt weights with live Sharpe-ratio eval feedback loops',
    ],
    defaultConcurrency: 920,
    topologyNodes: [
      { id: 'fix-gateway', label: 'FIX STREAM INGEST', x: 72, y: 78, load: '85M/d' },
      { id: 'spec-dec', label: 'SPECULATIVE DRAFT', x: 205, y: 38, load: '3.2ms' },
      { id: 'otel-sink', label: 'OTEL ZERO-COPY', x: 205, y: 118, load: '0.0ms' },
      { id: 'quant-out', label: 'ALPHA EXECUTION', x: 346, y: 78, load: '218k/s' },
    ],
    waveformPoints: 'M 0 64 Q 35 12, 70 60 T 140 20 T 210 58 T 280 18 T 350 52 L 420 22',
    configSnippet: `cluster: "helios-quant-hft"
speculative_decoding:
  draft_model: "aether-draft-7b-int4"
  verify_parallelism: 16
telemetry:
  otel_ zero_copy: true
  p99_budget_ms: 4.5
canary_split:
  v3_alpha_weights: 0.25`,
  },
  {
    id: 'vortex-multimodal',
    index: '03',
    code: 'CHAPTER // 03-VORTEX',
    shortName: '03 VORTEX MULTIMODAL',
    title: 'VORTEX MULTIMODAL ENGINE',
    client: 'Orbital Robotics Lab',
    category: 'VISION-LANGUAGE TELEMETRY',
    accent: '#34D399',
    secondary: '#22D3EE',
    metrics: {
      latency: '7.1ms',
      throughput: '94,800 tok/s',
      savings: '39.7%',
      uptime: '99.995%',
    },
    summary:
      'Unified vision-language spatial stream processor fusing LiDAR point clouds and multi-camera frames into real-time action tokens.',
    architecture: [
      'Frame-delta semantic deduplication cutting vision token payloads by 54%',
      'Dynamic model multiplexing between Claude 3.5 Sonnet and local TensorRT vision nodes',
      'Live frame-by-frame token attribution and spatial attention heatmaps',
    ],
    defaultConcurrency: 480,
    topologyNodes: [
      { id: 'lidar-in', label: 'LIDAR + RGB FUSION', x: 74, y: 46, load: '120Hz' },
      { id: 'frame-dedup', label: 'FRAME DELTA DEDUP', x: 206, y: 76, load: '-54% TOK' },
      { id: 'trt-vision', label: 'TENSOR-RT VISION', x: 342, y: 42, load: '7.1ms' },
      { id: 'sonnet-vlm', label: 'CLAUDE 3.5 SONNET', x: 342, y: 114, load: '94.8k/s' },
    ],
    waveformPoints: 'M 0 44 Q 60 74, 120 28 T 240 62 T 360 30 L 420 46',
    configSnippet: `cluster: "vortex-spatial-vlm"
multimodal_pipeline:
  frame_delta_dedup: 0.94
  point_cloud_voxel_mm: 12
mux_targets:
  - node: "tensorrt/llava-next-fp8"
  - node: "anthropic/claude-3-5-sonnet"`,
  },
  {
    id: 'aegis-enclave',
    index: '04',
    code: 'CHAPTER // 04-AEGIS',
    shortName: '04 AEGIS ZK-ENCLAVE',
    title: 'AEGIS ZERO-KNOWLEDGE ENCLAVE',
    client: 'Hyperion BioHealth',
    category: 'CONFIDENTIAL AI GUARDRAILS',
    accent: '#F59E0B',
    secondary: '#8B5CF6',
    metrics: {
      latency: '6.4ms',
      throughput: '112,400 tok/s',
      savings: '44.0%',
      uptime: '100.0%',
    },
    summary:
      'HIPAA & SOC 2 Type II zero-retention neural gateway with sub-4ms inline PII/PHI cryptographic redaction and verifiable audit trails.',
    architecture: [
      'Inline NER & regex PII redaction executing in <2.1ms on Cloudflare/Edge workers',
      'Ephemeral memory enclaves with cryptographic proof of zero payload persistence',
      'Automated compliance policy enforcement across 14 clinical research divisions',
    ],
    defaultConcurrency: 520,
    topologyNodes: [
      { id: 'phi-stream', label: 'CLINICAL INGRESS', x: 74, y: 76, load: 'HIPAA' },
      { id: 'ner-redact', label: 'INLINE PII SCRUB', x: 206, y: 42, load: '1.9ms' },
      { id: 'zk-attest', label: 'NITRO ZK-ENCLAVE', x: 206, y: 112, load: 'ZERO-RET' },
      { id: 'audit-log', label: 'MERKLE AUDIT SINK', x: 344, y: 76, load: '100% SLA' },
    ],
    waveformPoints: 'M 0 50 Q 52 38, 105 50 T 210 46 T 315 50 L 420 48',
    configSnippet: `cluster: "aegis-confidential-zk"
security_enclave:
  attestation: "aws-nitro-sha384"
  zero_retention_proof: true
  inline_redaction:
    entities: ["PHI", "SSN", "GENOMIC_ID"]
    max_Budget_ms: 2.1`,
  },
];

// Lightweight visibility-gated procedural node canvas for the full benchmark modal
function ProceduralNodeCanvas({ accent, secondary, index, intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = null;
    let isVisible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(220, Math.floor(rect.width * 0.85));
      canvas.height = Math.max(120, Math.floor(rect.height * 0.85));
    };
    resize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const start = performance.now();
    const seed = parseInt(index, 10) || 1;

    const draw = (now) => {
      if (isVisible) {
        const t = (now - start) * 0.0012 * intensity;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255,255,255,0.045)';
        ctx.lineWidth = 1;
        const step = 32;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        const cx = w * 0.5;
        const cy = h * 0.5;

        for (let layer = 0; layer < 2; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = layer % 2 === 0 ? accent : secondary;
          ctx.globalAlpha = 0.4 + layer * 0.25;
          ctx.lineWidth = 1.5;

          for (let x = 0; x <= w; x += 8) {
            const normX = x / w;
            const waveY =
              cy +
              Math.sin(normX * (4 + seed) + t * (1.4 + layer * 0.4)) *
                (h * 0.22) *
                Math.sin(t * 0.5 + layer) +
              Math.cos(normX * 8 - t) * 8;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        }

        ctx.globalAlpha = 0.9;
        const nodeCount = 4 + seed;
        for (let i = 0; i < nodeCount; i++) {
          const angle = t * (0.8 + i * 0.15) + i * 1.2;
          const rx = cx + Math.cos(angle) * (w * 0.32);
          const ry = cy + Math.sin(angle * 1.3) * (h * 0.26);

          ctx.beginPath();
          ctx.fillStyle = i % 2 === 0 ? accent : secondary;
          ctx.arc(rx, ry, 2.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.15;
          ctx.moveTo(cx, cy);
          ctx.lineTo(rx, ry);
          ctx.stroke();
          ctx.globalAlpha = 0.9;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [accent, secondary, index, intensity]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

/**
 * ArchitectureChapterCard (Left Column Scroll Item)
 * Uses IntersectionObserver to notify parent when scrolled into the viewport center.
 * Also features mouse-tracked radial border spotlight.
 */
function ArchitectureChapterCard({ study, idx, isActive, onActivate, onInspect }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onActivate(idx);
        }
      },
      {
        rootMargin: '-32% 0px -38% 0px',
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [idx, onActivate]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      id={`blade-card-${idx}`}
      initial={{ opacity: 0.35, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onClick={() => {
        playClick();
        onActivate(idx);
      }}
      className={`spotlight-card group relative cursor-pointer overflow-hidden rounded-2xl border p-6 sm:p-7 transition-all duration-300 ${
        isActive
          ? 'border-cyan-400/60 bg-[#0D121F]/95 shadow-[0_24px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.09)]'
          : 'border-[#27272A]/80 bg-[#090D16]/75 opacity-65 hover:opacity-95'
      }`}
    >
      {/* Top Active Accent Bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] transition-opacity duration-300"
        style={{
          opacity: isActive ? 1 : 0.25,
          background: `linear-gradient(90deg, ${study.accent}, ${study.secondary}, transparent)`,
        }}
      />

      {/* Chapter Header Meta */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-md border px-2 py-0.5 font-bold"
            style={{
              borderColor: isActive ? `${study.accent}80` : '#27272A',
              backgroundColor: isActive ? `${study.accent}18` : '#111115',
              color: isActive ? study.accent : '#A1A1AA',
            }}
          >
            {study.shortName}
          </span>
        </div>
        <span className="text-zinc-400">
          CLIENT // <strong className="text-zinc-200">{study.client}</strong>
        </span>
      </div>

      {/* Title & Summary */}
      <div className="relative z-10 mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-[#FAFAFA] sm:text-2xl">
            <ScrambleText text={study.title} />
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playTransition();
              onInspect(study);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 transition-all hover:bg-cyan-400 hover:text-[#09090B]"
            aria-label={`Inspect ${study.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
          {study.summary}
        </p>
      </div>

      {/* Verified Architecture Primitives */}
      <div className="relative z-10 mt-5 space-y-2 border-t border-[#27272A]/80 pt-4">
        {study.architecture.map((point) => (
          <div
            key={point}
            className="flex items-start gap-2.5 font-mono text-[11px] text-zinc-300"
          >
            <Zap
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: study.accent }}
            />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* Bottom KPI Strip + Inspect Trigger */}
      <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#27272A]/80 pt-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="block text-[9px] text-zinc-500">P50 LATENCY</span>
            <strong style={{ color: study.accent }}>{study.metrics.latency}</strong>
          </div>
          <div>
            <span className="block text-[9px] text-zinc-500">THROUGHPUT</span>
            <strong className="text-zinc-100">{study.metrics.throughput}</strong>
          </div>
          <div>
            <span className="block text-[9px] text-zinc-500">SAVINGS</span>
            <strong className="text-emerald-400">-{study.metrics.savings}</strong>
          </div>
        </div>

        <button
          type="button"
          onMouseEnter={playHover}
          onClick={(e) => {
            e.stopPropagation();
            playTransition();
            onInspect(study);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/20"
        >
          <span>Inspect Full Cluster</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

export default function ArchitectureReel({ onTriggerPortal, onOpenModal }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [consoleTab, setConsoleTab] = useState('topology'); // 'topology' | 'config'
  const [activeStudy, setActiveStudy] = useState(null);
  const [simConcurrency, setSimConcurrency] = useState(640);
  const [simCacheRate, setSimCacheRate] = useState(68);
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);

  const deckRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ['start start', 'end end'],
  });

  const currentChapter = CASE_STUDIES[activeIndex] || CASE_STUDIES[0];

  const scrollToBladeNode = (idx) => {
    playClick();
    setActiveIndex(idx);
    const el = document.getElementById(`blade-card-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenStudy = (study) => {
    if (onTriggerPortal) {
      onTriggerPortal({ code: study.code, title: study.title });
    }
    setSimConcurrency(study.defaultConcurrency);
    setActiveStudy(study);
  };

  const handleCycleStudy = (dir) => {
    if (!activeStudy) return;
    playTransition();
    const idx = CASE_STUDIES.findIndex((s) => s.id === activeStudy.id);
    const nextIdx = (idx + dir + CASE_STUDIES.length) % CASE_STUDIES.length;
    const nextStudy = CASE_STUDIES[nextIdx];
    if (onTriggerPortal) {
      onTriggerPortal({ code: nextStudy.code, title: nextStudy.title });
    }
    setSimConcurrency(nextStudy.defaultConcurrency);
    setActiveStudy(nextStudy);
  };

  const runLiveStressTest = () => {
    playClick();
    setBenchmarkRunning(true);
    setTimeout(() => setBenchmarkRunning(false), 750);
  };

  const computedLatency = activeStudy
    ? Math.max(
        2.1,
        (
          parseFloat(activeStudy.metrics.latency) *
          (1 - (simCacheRate - 50) * 0.006)
        ).toFixed(1)
      )
    : 4.2;
  const computedTokPerSec = activeStudy
    ? Math.round(simConcurrency * 215 * (1 + simCacheRate / 180))
    : 120000;
  const computedMonthlySaved =
    Math.round((simConcurrency * simCacheRate * 1.85) / 10) * 10;

  return (
    <section id="reel" className="relative border-t border-[#27272A]/80 py-16 sm:py-24">
      <div ref={deckRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Chapter Selector Bar */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#090D16]/95 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>02 // SPLIT-SCREEN NEURAL COMMAND DECK</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#FAFAFA] sm:text-4xl">
              <ScrambleText text="Scroll-Synced Live Topology & Code Inspector." />
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Scroll through our 4 flagship production AI architectures on the left while the pinned neural command deck on the right morphs its live node topology, latency waveforms, and deployment spec in real time.
            </p>
          </div>

          {/* Quick-Jump Chapter Tabs & Progress Bar */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#27272A] bg-[#090D16]/95 p-1.5">
              {CASE_STUDIES.map((study, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={study.id}
                    type="button"
                    onClick={() => scrollToBladeNode(idx)}
                    onMouseEnter={playHover}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs transition-all ${
                      isSelected
                        ? 'border-cyan-400/50 bg-[#141927] text-white shadow-sm'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span style={{ color: study.accent }}>{study.index}</span>
                    <span className="hidden text-[10px] sm:inline">
                      {study.id.split('-')[0].toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-1 w-full min-w-[220px] overflow-hidden rounded-full bg-[#18181D]">
              <motion.div
                style={{
                  scaleX: scrollYProgress,
                  transformOrigin: 'left center',
                }}
                className="h-full w-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399] will-change-transform"
              />
            </div>
          </div>
        </div>

        {/* SPLIT-SCREEN SCROLL-SYNCED LAYOUT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN: Scrolling 4 Flagship AI Architecture Chapters */}
          <div className="space-y-8 lg:col-span-6 lg:space-y-16 lg:pb-16">
            {CASE_STUDIES.map((study, idx) => (
              <ArchitectureChapterCard
                key={study.id}
                study={study}
                idx={idx}
                isActive={activeIndex === idx}
                onActivate={setActiveIndex}
                onInspect={handleOpenStudy}
              />
            ))}
          </div>

          {/* RIGHT COLUMN: Sticky Live Interactive Neural Cluster Visualizer & Telemetry Console */}
          <div className="lg:sticky lg:top-24 lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-[#27272A] bg-[#090D16]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.85)] sm:p-6">
              {/* Top Console Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] pb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: currentChapter.accent,
                      boxShadow: `0 0 12px ${currentChapter.accent}`,
                    }}
                  />
                  <span className="font-mono text-xs font-bold tracking-wider text-white">
                    {currentChapter.shortName}
                  </span>
                </div>

                {/* Mode Switcher: Live Node Graph vs YAML Config */}
                <div className="flex items-center gap-1 rounded-lg border border-[#27272A] bg-[#09090B] p-1 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setConsoleTab('topology');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                      consoleTab === 'topology'
                        ? 'bg-[#181822] text-cyan-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Network className="h-3 w-3" />
                    <span>TOPOLOGY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setConsoleTab('config');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                      consoleTab === 'config'
                        ? 'bg-[#181822] text-cyan-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Terminal className="h-3 w-3" />
                    <span>CLUSTER SPEC</span>
                  </button>
                </div>
              </div>

              {/* Morphing Interactive Node Graph OR Deployment Spec */}
              <div className="mt-5">
                <AnimatePresence mode="wait">
                  {consoleTab === 'topology' ? (
                    <motion.div
                      key={`topology-${currentChapter.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.24 }}
                      className="rounded-2xl border border-[#27272A] bg-[#09090B] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                        <span>LIVE NEURAL MESH // {currentChapter.category}</span>
                        <span className="text-emerald-400">
                          SLA: {currentChapter.metrics.uptime}
                        </span>
                      </div>

                      {/* Morphing Animated SVG Node Graph */}
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#1F1F26] bg-[#070A12]">
                        <svg
                          viewBox="0 0 420 156"
                          className="h-full w-full"
                          fill="none"
                        >
                          <defs>
                            <linearGradient
                              id="mesh-edge-grad"
                              x1="0"
                              y1="0"
                              x2="420"
                              y2="0"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0%" stopColor={currentChapter.accent} />
                              <stop offset="100%" stopColor={currentChapter.secondary} />
                            </linearGradient>
                          </defs>

                          {/* Connecting Circuit Edges between the 4 Chapter Nodes */}
                          {[
                            [0, 1],
                            [0, 2],
                            [1, 3],
                            [2, 3],
                          ].map(([fromIdx, toIdx], edgeIdx) => {
                            const n1 = currentChapter.topologyNodes[fromIdx];
                            const n2 = currentChapter.topologyNodes[toIdx];
                            const d = `M ${n1.x} ${n1.y} C ${(n1.x + n2.x) / 2} ${n1.y}, ${(n1.x + n2.x) / 2} ${n2.y}, ${n2.x} ${n2.y}`;
                            return (
                              <g key={`${currentChapter.id}-edge-${edgeIdx}`}>
                                <path
                                  d={d}
                                  stroke="url(#mesh-edge-grad)"
                                  strokeWidth="1.75"
                                  strokeOpacity="0.55"
                                />
                                <circle
                                  r="3"
                                  fill={
                                    edgeIdx % 2 === 0
                                      ? currentChapter.accent
                                      : currentChapter.secondary
                                  }
                                >
                                  <animateMotion
                                    dur={`${1.5 + edgeIdx * 0.28}s`}
                                    repeatCount="indefinite"
                                    path={d}
                                  />
                                </circle>
                              </g>
                            );
                          })}

                          {/* Animated Topology Nodes */}
                          {currentChapter.topologyNodes.map((node, i) => (
                            <g
                              key={node.id}
                              transform={`translate(${node.x}, ${node.y})`}
                            >
                              <circle
                                r="16"
                                fill="#090D16"
                                stroke={
                                  i % 2 === 0
                                    ? currentChapter.accent
                                    : currentChapter.secondary
                                }
                                strokeWidth="1.5"
                              />
                              <circle
                                r="4"
                                fill={
                                  i % 2 === 0
                                    ? currentChapter.accent
                                    : currentChapter.secondary
                                }
                              />
                              <text
                                y="28"
                                textAnchor="middle"
                                fill="#E4E4E7"
                                fontSize="8.5"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {node.label}
                              </text>
                              <text
                                y="-21"
                                textAnchor="middle"
                                fill={currentChapter.accent}
                                fontSize="8"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {node.load}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* Live Latency Waveform Strip */}
                      <div className="mt-4 rounded-xl border border-[#1F1F26] bg-[#070A12] p-3">
                        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-zinc-400">
                            REAL-TIME P50 LATENCY WAVEFORM
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: currentChapter.accent }}
                          >
                            {currentChapter.metrics.latency} • {currentChapter.metrics.throughput}
                          </span>
                        </div>
                        <svg viewBox="0 0 420 76" className="h-14 w-full">
                          <motion.path
                            key={currentChapter.waveformPoints}
                            initial={{ pathLength: 0, opacity: 0.3 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            d={currentChapter.waveformPoints}
                            fill="none"
                            stroke={currentChapter.accent}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`config-${currentChapter.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="rounded-2xl border border-[#27272A] bg-[#09090B] p-4"
                    >
                      <div className="mb-2.5 flex items-center justify-between border-b border-[#1F1F26] pb-2 font-mono text-[11px] text-zinc-400">
                        <span>aether-cluster.yaml</span>
                        <span className="text-cyan-400">VERIFIED MANIFEST</span>
                      </div>
                      <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-cyan-200">
                        <code>{currentChapter.configSnippet}</code>
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Console Telemetry Summary & Inspect CTA */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#27272A] pt-4">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Client:</span>
                  <strong className="text-white">{currentChapter.client}</strong>
                </div>

                <button
                  type="button"
                  onMouseEnter={playHover}
                  onClick={() => handleOpenStudy(currentChapter)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-4 py-2.5 font-mono text-xs font-bold text-[#09090B] shadow-lg shadow-cyan-500/15 transition-opacity hover:opacity-90"
                >
                  <span>Inspect Full Cluster</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Interactive Cluster Benchmark Modal */}
      <AnimatePresence>
        {activeStudy && (
          <motion.div
            key={activeStudy.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] overflow-y-auto bg-[#090D16]/98 backdrop-blur-xl"
          >
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
              {/* Top Modal Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272A] pb-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 font-mono text-xs text-cyan-300">
                    {activeStudy.code}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    CLIENT: <strong className="text-white">{activeStudy.client}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onMouseEnter={playHover}
                    onClick={() => handleCycleStudy(-1)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#111115] px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-cyan-400/50 hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    type="button"
                    onMouseEnter={playHover}
                    onClick={() => handleCycleStudy(1)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#111115] px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-cyan-400/50 hover:text-white"
                  >
                    <span>NEXT</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseEnter={playHover}
                    onClick={() => {
                      playClick();
                      setActiveStudy(null);
                    }}
                    className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs text-rose-300 hover:bg-rose-500/20"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>CLOSE INSPECTOR</span>
                  </button>
                </div>
              </div>

              {/* Main Modal Content */}
              <div className="my-8 grid gap-8 lg:grid-cols-12">
                <div className="flex flex-col justify-between lg:col-span-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
                      {activeStudy.category}
                    </span>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                      <ScrambleText text={activeStudy.title} />
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-zinc-300">
                      {activeStudy.summary}
                    </p>

                    <div className="mt-6 space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                        Verified System Architecture
                      </h4>
                      {activeStudy.architecture.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-xl border border-[#27272A] bg-[#111115] p-3.5 text-sm text-zinc-200"
                        >
                          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onMouseEnter={playHover}
                      onClick={() => {
                        playClick();
                        setActiveStudy(null);
                        if (onOpenModal) onOpenModal();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-[#09090B] shadow-lg shadow-cyan-500/20 hover:opacity-90"
                    >
                      <span>Deploy Identical Topology</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Interactive Telemetry & Stress Simulator */}
                <div className="space-y-5 lg:col-span-6">
                  <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#111115]">
                    <ProceduralNodeCanvas
                      accent={activeStudy.accent}
                      secondary={activeStudy.secondary}
                      index={activeStudy.index}
                      intensity={benchmarkRunning ? 3.2 : 1.1}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#09090B]/95 px-3 py-1 font-mono text-[11px] text-cyan-300">
                      <Activity className="h-3.5 w-3.5" />
                      <span>
                        {benchmarkRunning
                          ? 'EXECUTING SYNTHETIC LOAD SPIKE...'
                          : 'LIVE TOPOLOGY TELEMETRY'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#27272A] bg-[#111115] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-300">
                        <Sliders className="h-4 w-4 text-cyan-400" />
                        <span>Interactive Cluster Stress Simulator</span>
                      </div>
                      <button
                        type="button"
                        onClick={runLiveStressTest}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300 hover:bg-cyan-400/20"
                      >
                        <Play className="h-3 w-3" />
                        <span>{benchmarkRunning ? 'Benchmarking...' : 'Spike Load'}</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-1.5 flex justify-between font-mono text-xs">
                          <span className="text-zinc-400">Concurrent Agent Streams</span>
                          <span className="text-cyan-300">{simConcurrency} agents</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="40"
                          value={simConcurrency}
                          onChange={(e) => setSimConcurrency(Number(e.target.value))}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#27272A] accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex justify-between font-mono text-xs">
                          <span className="text-zinc-400">Edge Semantic Cache Hit Ratio</span>
                          <span className="text-emerald-400">{simCacheRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="95"
                          step="1"
                          value={simCacheRate}
                          onChange={(e) => setSimCacheRate(Number(e.target.value))}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#27272A] accent-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#27272A] pt-4 font-mono">
                      <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-3">
                        <span className="text-[10px] text-zinc-500">P50 GATEWAY</span>
                        <p className="mt-1 text-lg font-bold text-white">{computedLatency}ms</p>
                      </div>
                      <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-3">
                        <span className="text-[10px] text-zinc-500">THROUGHPUT</span>
                        <p className="mt-1 text-lg font-bold text-cyan-300">
                          {(computedTokPerSec / 1000).toFixed(1)}k/s
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-3">
                        <span className="text-[10px] text-zinc-500">EST. SAVINGS</span>
                        <p className="mt-1 text-lg font-bold text-emerald-400">
                          ${computedMonthlySaved.toLocaleString()}/mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#27272A] pt-4 font-mono text-xs text-zinc-500">
                <span>AETHER // NEURAL CLUSTER BENCHMARK INSPECTOR</span>
                <span>ESC OR CLICK CLOSE TO RETURN</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
