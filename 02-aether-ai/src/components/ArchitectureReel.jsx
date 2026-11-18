import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
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
  Compass,
  Layers,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { playHover, playClick, playTransition } from '../utils/soundEngine';

export const CASE_STUDIES = [
  {
    id: 'chronos-9',
    index: '01',
    code: 'DEPLOYMENT // 01-CHRONOS',
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
  },
  {
    id: 'helios-fabric',
    index: '02',
    code: 'DEPLOYMENT // 02-HELIOS',
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
  },
  {
    id: 'vortex-multimodal',
    index: '03',
    code: 'DEPLOYMENT // 03-VORTEX',
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
  },
  {
    id: 'aegis-enclave',
    index: '04',
    code: 'DEPLOYMENT // 04-AEGIS',
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
  },
];

// Procedural animated canvas preview inside each card & takeover
function ProceduralNodeCanvas({ accent, secondary, index, intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(240, Math.floor(rect.width));
      canvas.height = Math.max(140, Math.floor(rect.height));
    };
    resize();

    const start = performance.now();
    const seed = parseInt(index, 10) || 1;

    const draw = (now) => {
      const t = (now - start) * 0.0012 * intensity;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Perspective cyber grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      const step = 28;
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

      // Draw harmonic neural waves & nodes
      const cx = w * 0.5;
      const cy = h * 0.5;

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = layer % 2 === 0 ? accent : secondary;
        ctx.globalAlpha = 0.35 + layer * 0.2;
        ctx.lineWidth = 1.6;

        for (let x = 0; x <= w; x += 6) {
          const normX = x / w;
          const waveY =
            cy +
            Math.sin(normX * (4 + seed) + t * (1.4 + layer * 0.4)) *
              (h * 0.22) *
              Math.sin(t * 0.5 + layer) +
            Math.cos(normX * 9 - t) * 10;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // Orbiting telemetry nodes
      ctx.globalAlpha = 0.9;
      const nodeCount = 5 + seed;
      for (let i = 0; i < nodeCount; i++) {
        const angle = t * (0.8 + i * 0.15) + i * 1.2;
        const rx = cx + Math.cos(angle) * (w * 0.32);
        const ry = cy + Math.sin(angle * 1.3) * (h * 0.26);

        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? accent : secondary;
        ctx.arc(rx, ry, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Connect to center hub
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.16;
        ctx.moveTo(cx, cy);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.globalAlpha = 0.9;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [accent, secondary, index, intensity]);

  return <canvas ref={canvasRef} className="h-full w-full block" />;
}

/**
 * TunnelFlightCard
 * Individual 3D card positioned in Z-space inside the sticky scroll-scrubbed runway.
 * As scrollYProgress advances from 0 -> 1, each card flies from deep Z-space (-900px)
 * to center focus (0px) and then flies past the camera (+520px) with 3D rotation.
 */
function TunnelFlightCard({ study, idx, total, smoothProgress, onSelect }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // Center scroll progress point for this card (0.12, 0.37, 0.62, 0.88)
  const step = 1 / total;
  const center = step * idx + step * 0.5;
  const enterStart = Math.max(0, center - step * 1.35);
  const focusStart = Math.max(0, center - step * 0.38);
  const focusEnd = Math.min(1, center + step * 0.38);
  const exitEnd = Math.min(1, center + step * 1.25);

  const sideSign = idx % 2 === 0 ? -1 : 1;

  const z = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [-850, 0, 40, 520]
  );
  const x = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [sideSign * 260, 0, 0, sideSign * -220]
  );
  const y = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [130, 0, 0, -110]
  );
  const rotateY = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [sideSign * -28, 0, 0, sideSign * 22]
  );
  const rotateX = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [18, 0, 0, -16]
  );
  const scale = useTransform(
    smoothProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [0.68, 1, 1.03, 1.22]
  );
  const opacity = useTransform(
    smoothProgress,
    [
      Math.max(0, enterStart - 0.04),
      focusStart,
      focusEnd,
      Math.min(1, exitEnd + 0.02),
    ],
    [idx === 0 ? 1 : 0, 1, 1, idx === total - 1 ? 1 : 0]
  );

  // Floating foreground telemetry satellite badge parallax
  const badgeParallaxY = useTransform(
    smoothProgress,
    [enterStart, exitEnd],
    [65, -75]
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 9,
      gx: px * 100,
      gy: py * 100,
    });
  };

  return (
    <motion.div
      style={{
        z,
        x,
        y,
        rotateY,
        rotateX,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        zIndex: total - idx + 10,
      }}
      className=" absolute inset-x-0 mx-auto w-full max-w-4xl px-2 sm:px-6 pointer-events-auto"
    >
      {/* Floating Foreground Parallax Telemetry Pill */}
      <motion.div
        style={{ y: badgeParallaxY, translateZ: '70px' }}
        className={`pointer-events-none absolute -top-5 ${
          idx % 2 === 0 ? 'right-6 sm:right-10' : 'left-6 sm:left-10'
        } z-30 hidden sm:flex items-center gap-2 rounded-full border border-cyan-400/50 bg-[#09090B]/95 px-3.5 py-1 font-mono text-[11px] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.28)] backdrop-blur-md`}
      >
        <span
          className="h-2 w-2 rounded-full animate-pulse"
          style={{ backgroundColor: study.accent }}
        />
        <span>Z-NODE {study.index} // LIVE STREAM</span>
        <span className="text-emerald-400">{study.metrics.latency}</span>
      </motion.div>

      <article
        onMouseEnter={playHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })}
        onClick={() => {
          playTransition();
          onSelect(study);
        }}
        data-cursor="[ LAUNCH 3D PORTAL ]"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#27272A] bg-[#111115]/95 p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors duration-200 hover:border-cyan-400/70"
      >
        {/* Dynamic cursor spotlight sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(560px circle at ${tilt.gx}% ${tilt.gy}%, rgba(34,211,238,0.16), transparent 70%)`,
          }}
        />

        {/* Top Meta Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-md border px-2 py-0.5 font-bold"
              style={{
                borderColor: `${study.accent}66`,
                backgroundColor: `${study.accent}18`,
                color: study.accent,
              }}
            >
              NODE {study.index} / 04
            </span>
            <span className="text-cyan-300">{study.code}</span>
          </div>
          <span className="rounded-full border border-[#27272A] bg-[#09090B] px-3 py-0.5 text-zinc-300">
            CLIENT // {study.client}
          </span>
        </div>

        {/* Main Card Split Layout inside 3D Tunnel */}
        <div className="relative z-10 mt-5 grid gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left: Live Procedural Shader/Node Preview */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#09090B] lg:col-span-6">
            <ProceduralNodeCanvas
              accent={study.accent}
              secondary={study.secondary}
              index={study.index}
              intensity={1.35}
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#09090B]/85 px-2.5 py-1 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
              <Layers className="h-3 w-3 text-cyan-400" />
              <span>3D TOPOLOGY TELEMETRY</span>
            </div>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between rounded-lg border border-zinc-800/80 bg-[#09090B]/90 px-3 py-1.5 font-mono text-[10px] backdrop-blur-md">
              <span className="text-zinc-300">{study.category}</span>
              <span className="text-emerald-400 font-semibold">
                P50: {study.metrics.latency}
              </span>
            </div>
          </div>

          {/* Right: Title, Architecture Highlights & KPI Strip */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#FAFAFA] group-hover:text-cyan-300 transition-colors">
                  <ScrambleText text={study.title} scrambleOnMount={false} />
                </h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-cyan-400 group-hover:text-[#09090B]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
                {study.summary}
              </p>

              {/* Architecture bullet preview */}
              <div className="mt-3.5 space-y-1.5">
                {study.architecture.slice(0, 2).map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2 font-mono text-[11px] text-zinc-400"
                  >
                    <Zap className="h-3 w-3 shrink-0 text-cyan-400" />
                    <span className="truncate">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom KPI Strip */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#27272A]/90 pt-4 font-mono text-xs">
              <div className="rounded-lg border border-[#27272A]/70 bg-[#09090B]/80 px-2.5 py-1.5">
                <span className="block text-[9px] text-zinc-500">THROUGHPUT</span>
                <strong className="text-zinc-100">{study.metrics.throughput}</strong>
              </div>
              <div className="rounded-lg border border-[#27272A]/70 bg-[#09090B]/80 px-2.5 py-1.5">
                <span className="block text-[9px] text-zinc-500">COST DELTA</span>
                <strong className="text-emerald-400">-{study.metrics.savings}</strong>
              </div>
              <div className="rounded-lg border border-[#27272A]/70 bg-[#09090B]/80 px-2.5 py-1.5">
                <span className="block text-[9px] text-zinc-500">SLA UPTIME</span>
                <strong className="text-cyan-300">{study.metrics.uptime}</strong>
              </div>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function ReelCard({ study, idx, onSelect }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 12;
    const rx = (0.5 - py) * 12;
    setTilt({ rx, ry, gx: px * 100, gy: py * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 36, rotateX: 14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.55, delay: idx * 0.06 }}
      onMouseEnter={playHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playTransition();
        onSelect(study);
      }}
      data-cursor="[ LAUNCH PORTAL ]"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#27272A] bg-[#111115]/90 p-6 transition-all duration-200 hover:border-cyan-400/60 hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]"
    >
      {/* Dynamic spotlight sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(480px circle at ${tilt.gx}% ${tilt.gy}%, rgba(34,211,238,0.14), transparent 70%)`,
        }}
      />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[11px]">
        <span className="text-cyan-400">{study.code}</span>
        <span className="rounded-full border border-[#27272A] bg-[#09090B] px-2.5 py-0.5 text-zinc-400">
          {study.client}
        </span>
      </div>

      {/* Live Procedural Shader/Node Preview */}
      <div className="relative z-10 my-5 h-44 w-full overflow-hidden rounded-xl border border-[#27272A]/90 bg-[#09090B]">
        <ProceduralNodeCanvas
          accent={study.accent}
          secondary={study.secondary}
          index={study.index}
        />
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between rounded-lg border border-zinc-800/80 bg-[#09090B]/85 px-3 py-1.5 font-mono text-[10px] backdrop-blur-md">
          <span className="text-zinc-400">{study.category}</span>
          <span className="text-emerald-400">P50: {study.metrics.latency}</span>
        </div>
      </div>

      {/* Title & Summary */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-[#FAFAFA] group-hover:text-cyan-300 transition-colors">
            <ScrambleText text={study.title} scrambleOnMount={false} />
          </h3>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#09090B] text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-cyan-400/50 group-hover:text-cyan-300">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{study.summary}</p>

        {/* Bottom KPI Strip */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#27272A]/80 pt-4 font-mono text-xs">
          <div>
            <span className="block text-[10px] text-zinc-500">THROUGHPUT</span>
            <strong className="text-zinc-200">{study.metrics.throughput}</strong>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">COST DELTA</span>
            <strong className="text-emerald-400">-{study.metrics.savings}</strong>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">SLA UPTIME</span>
            <strong className="text-cyan-300">{study.metrics.uptime}</strong>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ArchitectureReel({ onTriggerPortal, onOpenModal }) {
  const [activeStudy, setActiveStudy] = useState(null);
  const [simConcurrency, setSimConcurrency] = useState(640);
  const [simCacheRate, setSimCacheRate] = useState(68);
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);
  const [activeTunnelIdx, setActiveTunnelIdx] = useState(0);

  const tunnelRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: tunnelRef,
    offset: ['start start', 'end end'],
  });

  const smoothTunnelProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.28,
  });

  // Track which of the 4 deployments is currently in focus during the scroll flight
  useMotionValueEvent(smoothTunnelProgress, 'change', (latest) => {
    const idx = Math.min(
      CASE_STUDIES.length - 1,
      Math.max(0, Math.floor(latest * CASE_STUDIES.length))
    );
    if (idx !== activeTunnelIdx) {
      setActiveTunnelIdx(idx);
    }
  });

  // Tunnel perspective grid rings depth animation
  const ringScale1 = useTransform(smoothTunnelProgress, [0, 1], [0.75, 1.45]);
  const ringRotate = useTransform(smoothTunnelProgress, [0, 1], [0, 45]);
  const progressBarFill = useTransform(smoothTunnelProgress, [0, 1], ['8%', '100%']);

  const scrollToTunnelNode = (idx) => {
    if (!tunnelRef.current) return;
    playClick();
    const rect = tunnelRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollableDistance = rect.height - window.innerHeight;
    const targetProgress = (idx + 0.45) / CASE_STUDIES.length;
    window.scrollTo({
      top: absoluteTop + scrollableDistance * targetProgress,
      behavior: 'smooth',
    });
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

  // Computed live telemetry for the takeover simulator
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
    <section id="reel" className="relative border-t border-[#27272A]/80">
      {/* STICKY SCROLL-SCRUBBED 3D Z-SPACE TUNNEL RUNWAY */}
      <div ref={tunnelRef} className="relative min-h-[280vh]">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden py-6 sm:py-10">
          {/* Perspective 3D Cybernetic Wireframe Tunnel Rings in Foreground Stage */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ scale: ringScale1, rotateZ: ringRotate }}
              className="h-[540px] w-[540px] rounded-full border border-cyan-400/10 sm:h-[760px] sm:w-[760px]"
            />
            <motion.div
              style={{ scale: ringScale1 }}
              className="absolute h-[360px] w-[680px] rounded-3xl border border-violet-500/10"
            />
          </div>

          {/* Sticky Stage Top Header & Live Scroll-Progress Indicator (01 -> 02 -> 03 -> 04) */}
          <div className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                  <Compass className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                  <span>02 // 3D Z-SPACE ARCHITECTURE FLIGHT</span>
                </div>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#FAFAFA] sm:text-4xl">
                  <ScrambleText
                    text="Scroll to Fly Through Production Nodes."
                    scrambleOnMount={false}
                  />
                </h2>
              </div>

              {/* Interactive 01 -> 02 -> 03 -> 04 Scroll Progress & Quick-Jump Bar */}
              <div className="flex flex-col items-start gap-2 md:items-end">
                <div className="flex items-center gap-1.5 rounded-xl border border-[#27272A] bg-[#111115]/90 p-1.5 backdrop-blur-md">
                  {CASE_STUDIES.map((study, idx) => {
                    const isCurrent = activeTunnelIdx === idx;
                    return (
                      <button
                        key={study.id}
                        type="button"
                        onClick={() => scrollToTunnelNode(idx)}
                        onMouseEnter={playHover}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
                          isCurrent
                            ? 'bg-cyan-400 text-[#09090B] font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                            : 'text-zinc-400 hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <span>{study.index}</span>
                        <span className="hidden sm:inline text-[10px]">
                          {study.id.split('-')[0].toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="h-1 w-full min-w-[220px] overflow-hidden rounded-full bg-[#18181D]">
                  <motion.div
                    style={{ width: progressBarFill }}
                    className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center 3D Perspective Stage where 4 Architecture Cards Fly Through Z-Space */}
          <div
            style={{ perspective: '1300px', transformStyle: 'preserve-3d' }}
            className="relative z-20 my-auto flex w-full items-center justify-center min-h-[390px] sm:min-h-[430px]"
          >
            {CASE_STUDIES.map((study, idx) => (
              <TunnelFlightCard
                key={study.id}
                study={study}
                idx={idx}
                total={CASE_STUDIES.length}
                smoothProgress={smoothTunnelProgress}
                onSelect={handleOpenStudy}
              />
            ))}
          </div>

          {/* Sticky Stage Bottom Telemetry Bar */}
          <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 font-mono text-[11px] text-zinc-400 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>
                ACTIVE FOCUS:{' '}
                <strong className="text-white">
                  {CASE_STUDIES[activeTunnelIdx]?.title}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-zinc-500">
                SCROLL DOWN TO SCRUB Z-AXIS • CLICK CARD FOR FULL PORTAL
              </span>
              <button
                type="button"
                onClick={() => handleOpenStudy(CASE_STUDIES[activeTunnelIdx])}
                className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-cyan-300 hover:bg-cyan-400/20"
              >
                Inspect Active Node →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complete 2x2 Matrix Index Below the 3D Runway for Instant Comparison */}
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#27272A]/80 pt-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
              02.B // COMPLETE TOPOLOGY MATRIX
            </span>
            <h3 className="mt-1 text-xl font-bold text-[#FAFAFA] sm:text-2xl">
              All Verified Production Clusters
            </h3>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            <span className="text-cyan-400">[4 ACTIVE CLUSTERS]</span> • CLICK ANY NODE FOR STRESS SIMULATOR
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((study, idx) => (
            <ReelCard
              key={study.id}
              study={study}
              idx={idx}
              onSelect={handleOpenStudy}
            />
          ))}
        </div>
      </div>

      {/* Full-Screen Case Study Portal Takeover Modal */}
      <AnimatePresence>
        {activeStudy && (
          <motion.div
            key={activeStudy.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] overflow-y-auto bg-[#09090B]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-between">
              {/* Top Portal Bar */}
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
                    <span>CLOSE PORTAL</span>
                  </button>
                </div>
              </div>

              {/* Main Portal Content */}
              <div className="my-8 grid gap-8 lg:grid-cols-12">
                {/* Left Column: Architecture Breakdown */}
                <div className="lg:col-span-6 flex flex-col justify-between">
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
                <div className="lg:col-span-6 space-y-5">
                  <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#111115]">
                    <ProceduralNodeCanvas
                      accent={activeStudy.accent}
                      secondary={activeStudy.secondary}
                      index={activeStudy.index}
                      intensity={benchmarkRunning ? 3.2 : 1.1}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#09090B]/90 px-3 py-1 font-mono text-[11px] text-cyan-300">
                      <Activity className="h-3.5 w-3.5" />
                      <span>
                        {benchmarkRunning
                          ? 'EXECUTING SYNTHETIC LOAD SPIKE...'
                          : 'LIVE TOPOLOGY TELEMETRY'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Load Simulator Controls */}
                  <div className="rounded-2xl border border-[#27272A] bg-[#111115] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-300">
                        <Sliders className="h-4 w-4 text-cyan-400" />
                        <span>Interactive Cluster Stress Simulator</span>
                      </div>
                      <button
                        type="button"
                        onClick={runLiveStressTest}
                        data-cursor="[ RUN BENCHMARK ]"
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

                    {/* Simulated Output Metrics */}
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

              {/* Bottom Portal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#27272A] pt-4 font-mono text-xs text-zinc-500">
                <span>AETHER // ARCHITECTURE CASE STUDY PORTAL</span>
                <span>ESC OR CLICK CLOSE TO RETURN TO STREAM</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
