import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Gauge,
  Layers,
  X,
  Sliders,
  Sparkles,
  Play,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const CASES = [
  {
    id: 'kinetix',
    index: '01',
    client: 'KINETIX HYPERCOMMERCE',
    sector: 'WEBGL CONFIGURATOR & EDGE RETAIL',
    year: '2026',
    metric: '+142%',
    metricLabel: 'Conversion Velocity Lift',
    summary:
      'Re-architected a monolithic luxury footwear storefront into an interactive 60fps WebGL 3D customizer with sub-40ms edge cart mutations.',
    challenge:
      'Legacy DOM product pages suffered from 3.4s LCP and static photography that failed to communicate bespoke carbon-weave materials.',
    architecture: [
      'Custom GLSL PBR Material & Iridescent Weave Shader',
      'Distributed Cloudflare Workers Edge State Sync',
      'Zero-CLS Streaming React Server Components',
      'Procedural Web Audio Tactile UI Feedback',
    ],
    stats: [
      { label: 'Global LCP', value: '0.38s' },
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Cart Latency', value: '18ms' },
      { label: 'Conversion', value: '+142%' },
    ],
    span: 'lg:col-span-7',
    icon: TrendingUp,
    accent: '#C8FF32',
    accentSecondary: '#6366F1',
    shaderMode: 1,
    visualType: 'wave',
  },
  {
    id: 'aether',
    index: '02',
    client: 'AETHER NEURAL CLOUD',
    sector: 'AUTONOMOUS TELEMETRY & AI FABRIC',
    year: '2026',
    metric: '40K/s',
    metricLabel: 'Real-Time Telemetry Events @ 60FPS',
    summary:
      'Engineered an institutional GPU cluster command deck rendering 40,000+ streaming WebSocket events per second via instanced WebGL buffers.',
    challenge:
      'Standard SVG/DOM charts locked up the main thread above 2,000 concurrent node heartbeats during peak LLM training runs.',
    architecture: [
      'WebGL2 Instanced Tensor Topology Visualizer',
      'WebWorker Binary Ring-Buffer Stream Parser',
      'Sub-Millisecond Command Palette & Hotkey Matrix',
      'Multi-Region Failover State Machine',
    ],
    stats: [
      { label: 'Throughput', value: '40k msg/s' },
      { label: 'Main Thread', value: '< 2.1ms' },
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'Nodes', value: '16,384' },
    ],
    span: 'lg:col-span-5',
    icon: ShieldCheck,
    accent: '#6366F1',
    accentSecondary: '#00EBFF',
    shaderMode: 2,
    visualType: 'matrix',
  },
  {
    id: 'solis',
    index: '03',
    client: 'SOLIS BIO-SYNTHESIS',
    sector: 'MOLECULAR STORYTELLING & DATA PORTAL',
    year: '2026',
    metric: '0.34s',
    metricLabel: 'Global Largest Contentful Paint',
    summary:
      'Interactive raymarched protein-folding showcase paired with an edge-indexed genomic research repository scoring 100/100 across Core Web Vitals.',
    challenge:
      'Translating complex molecular folding dynamics into an intuitive, investor-grade spatial web experience without sacrificing mobile speed.',
    architecture: [
      'Signed-Distance-Field (SDF) Raymarched Protein Solver',
      'Scroll-Linked Camera Choreography & Depth-of-Field',
      'Instantaneous Edge Search Across 1.2M Compounds',
      'Adaptive GPU Tier Resolution Scaling',
    ],
    stats: [
      { label: 'Lighthouse', value: '100/100' },
      { label: 'TTFB Global', value: '32ms' },
      { label: 'CLS Score', value: '0.000' },
      { label: 'Engagement', value: '4.6x' },
    ],
    span: 'lg:col-span-5',
    icon: Gauge,
    accent: '#00EBFF',
    accentSecondary: '#C8FF32',
    shaderMode: 0,
    visualType: 'orbital',
  },
  {
    id: 'nordic',
    index: '04',
    client: 'MERIDIAN QUANTUM TREASURY',
    sector: 'INSTITUTIONAL FINTECH & DESIGN SYSTEM',
    year: '2026',
    metric: '$48B+',
    metricLabel: 'Annualized Programmable Settlement',
    summary:
      'Unified 6 regional institutional liquidity desks under a single tokenized React & WebGL visual system with cryptographic proof verification.',
    challenge:
      'Fragmented legacy interfaces caused operational friction during high-volatility FX sweeps across Tokyo, London, and New York.',
    architecture: [
      '68 Multi-Brand Accessible React Primitives',
      'Real-Time FX Corridor Liquidity Arc Globe',
      'Automated Visual Regression & Cryptography Suite',
      'Zero-Latency Keyboard Execution Engine',
    ],
    stats: [
      { label: 'Release Speed', value: '3.8x' },
      { label: 'Components', value: '68 Core' },
      { label: 'Settlement', value: '< 120ms' },
      { label: 'WCAG Compliance', value: 'AAA' },
    ],
    span: 'lg:col-span-7',
    icon: Layers,
    accent: '#C8FF32',
    accentSecondary: '#00EBFF',
    shaderMode: 1,
    visualType: 'corridor',
  },
];

function CaseProceduralCanvas({ type, accent, accentSecondary, intensity = 1, interactive = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: 0.5, y: 0.5 };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.scale(dpr, dpr);
    };

    handleResize();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / Math.max(1, rect.width);
      mouse.y = (e.clientY - rect.top) / Math.max(1, rect.height);
    };

    if (interactive) {
      window.addEventListener('mousemove', onMove, { passive: true });
    }

    const start = performance.now();
    const draw = (now) => {
      const t = (now - start) * 0.001 * intensity;
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 180;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(245, 242, 235, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      if (type === 'wave') {
        for (let layer = 0; layer < 4; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = layer % 2 === 0 ? accent : accentSecondary;
          ctx.lineWidth = layer === 0 ? 2.2 : 1.1;
          ctx.globalAlpha = 0.85 - layer * 0.18;
          for (let x = 0; x <= w; x += 6) {
            const nx = x / w;
            const y =
              h * 0.5 +
              Math.sin(nx * 8 * intensity + t * 2.2 + layer * 0.8) * (22 + mouse.y * 18) +
              Math.cos(nx * 14 - t * 1.6) * 10;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (type === 'matrix') {
        const cols = 16;
        const barW = (w - 32) / cols;
        for (let i = 0; i < cols; i++) {
          const phase = Math.sin(t * 2.8 + i * 0.55 + mouse.x * 4) * 0.5 + 0.5;
          const barH = Math.max(12, phase * (h * 0.72));
          const x = 16 + i * barW;
          const y = h - barH - 12;
          ctx.fillStyle = i % 3 === 0 ? accent : accentSecondary;
          ctx.globalAlpha = 0.25 + phase * 0.65;
          ctx.fillRect(x, y, barW - 5, barH);
          ctx.globalAlpha = 1;
          ctx.fillRect(x, y, barW - 5, 2.5);
        }
      } else if (type === 'orbital') {
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let r = 1; r <= 4; r++) {
          ctx.beginPath();
          ctx.strokeStyle = r % 2 === 0 ? accent : accentSecondary;
          ctx.globalAlpha = 0.35 + r * 0.12;
          ctx.lineWidth = 1.4;
          const radius = r * Math.min(w, h) * 0.1;
          ctx.arc(cx, cy, radius, t * r * 0.6, t * r * 0.6 + Math.PI * 1.45);
          ctx.stroke();

          const px = cx + Math.cos(t * r * 0.9) * radius;
          const py = cy + Math.sin(t * r * 0.9) * radius;
          ctx.fillStyle = accent;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const nodes = 5;
        for (let i = 0; i < nodes; i++) {
          const x1 = (w / (nodes + 1)) * (i + 1);
          const y1 = h * 0.72;
          const x2 = w * (0.2 + ((i * 0.18 + t * 0.05) % 0.65));
          const y2 = h * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = i % 2 === 0 ? accent : accentSecondary;
          ctx.globalAlpha = 0.65;
          ctx.lineWidth = 1.6;
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo((x1 + x2) * 0.5, h * 0.08 + Math.sin(t + i) * 18, x2, y2);
          ctx.stroke();

          ctx.fillStyle = accent;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
          ctx.arc(x2, y2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      if (interactive) window.removeEventListener('mousemove', onMove);
    };
  }, [type, accent, accentSecondary, intensity, interactive]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

export default function CaseHighlightsSection({
  onOpenInquiry,
  onTriggerPortal,
  onSelectShader,
  forceStreamLayout = false,
}) {
  const [layoutMode, setLayoutMode] = useState('stream');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCase, setSelectedCase] = useState(null);
  const [simFrequency, setSimFrequency] = useState(1.25);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scrollDepthPct, setScrollDepthPct] = useState(0);

  // Sticky Scroll-Driven 3D Runway Reference
  const runwayRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const smoothRunway = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 240,
    mass: 0.4,
  });

  // Automatically switch active project & morph foreground 3D geometry as user scrolls through #work!
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (layoutMode !== 'stream') return;
    const clamped = Math.max(0, Math.min(0.999, latest));
    setScrollDepthPct(Math.round(clamped * 100));
    const idx = Math.floor(clamped * CASES.length);
    if (idx !== activeIndex && idx >= 0 && idx < CASES.length) {
      setActiveIndex(idx);
      if (onSelectShader) onSelectShader(CASES[idx].shaderMode);
    }
  });

  // Continuous 3D Z-space wave transforms driven by scroll inside the sticky stage
  const stageRotateY = useTransform(
    smoothRunway,
    [0, 0.25, 0.5, 0.75, 1],
    [-12, 8, -10, 10, 0]
  );
  const stageRotateX = useTransform(
    smoothRunway,
    [0, 0.25, 0.5, 0.75, 1],
    [10, -6, 8, -8, 0]
  );
  const badgeParallaxY = useTransform(smoothRunway, [0, 1], [45, -55]);
  const canvasParallaxY = useTransform(smoothRunway, [0, 1], [-30, 35]);

  useEffect(() => {
    if (forceStreamLayout) setLayoutMode('stream');
  }, [forceStreamLayout]);

  const handleOpenCase = (item, idx) => {
    soundEngine.playTransition();
    if (onSelectShader) onSelectShader(item.shaderMode);
    if (onTriggerPortal) {
      onTriggerPortal({
        label: item.client,
        sublabel: `PORTAL ${item.index} // ${item.sector}`,
        accent: item.accent,
      });
    }
    setActiveIndex(idx);
    setTimeout(() => {
      setSelectedCase(item);
    }, 240);
  };

  const handleSwitchPortalCase = (dir) => {
    if (!selectedCase) return;
    const currentIdx = CASES.findIndex((c) => c.id === selectedCase.id);
    const nextIdx = (currentIdx + dir + CASES.length) % CASES.length;
    const nextItem = CASES[nextIdx];
    soundEngine.playTransition();
    if (onSelectShader) onSelectShader(nextItem.shaderMode);
    if (onTriggerPortal) {
      onTriggerPortal({
        label: nextItem.client,
        sublabel: `SWITCHING PORTAL // ${nextItem.index}`,
        accent: nextItem.accent,
      });
    }
    setTimeout(() => {
      setSelectedCase(nextItem);
      setActiveIndex(nextIdx);
    }, 220);
  };

  const handleStepStream = (dir) => {
    soundEngine.playClick();
    const next = (activeIndex + dir + CASES.length) % CASES.length;
    setActiveIndex(next);
    if (onSelectShader) onSelectShader(CASES[next].shaderMode);
  };

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -ny * 10, y: nx * 12 });
  };

  const currentStreamCase = CASES[activeIndex];

  return (
    <section id="work" className="relative px-5 sm:px-8 max-w-7xl mx-auto">
      {/* MODE 1: ACTIVE THEORY STICKY SCROLL-SCRUBBED 3D Z-TUNNEL */}
      {layoutMode === 'stream' ? (
        <div ref={runwayRef} className="relative min-h-[250vh] py-12">
          <div className="sticky top-20 pt-2 pb-8 flex flex-col justify-between">
            {/* Header + Active Theory Mode Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-lime mb-2">
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span>
                    // SCROLL-SCRUBBED 3D WORK TUNNEL · DEPTH {String(scrollDepthPct).padStart(3, '0')}%
                  </span>
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
                  <ScrambleText text="Selected Portals" scrambleOnMount={false} />
                  <span className="text-lime">.</span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center bg-surface/90 border border-ivory/15 rounded-full p-1 backdrop-blur-md">
                  <button
                    type="button"
                    data-cursor="3D SCROLL STREAM"
                    onClick={() => {
                      soundEngine.playClick();
                      setLayoutMode('stream');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                      layoutMode === 'stream'
                        ? 'bg-lime text-obsidian font-semibold shadow-[0_0_16px_rgba(200,255,50,0.3)]'
                        : 'text-ivory/65 hover:text-ivory'
                    }`}
                  >
                    3D Scroll Stream
                  </button>
                  <button
                    type="button"
                    data-cursor="BENTO MATRIX"
                    onClick={() => {
                      soundEngine.playClick();
                      setLayoutMode('grid');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                      layoutMode === 'grid'
                        ? 'bg-lime text-obsidian font-semibold shadow-[0_0_16px_rgba(200,255,50,0.3)]'
                        : 'text-ivory/65 hover:text-ivory'
                    }`}
                  >
                    Matrix Grid
                  </button>
                </div>

                <button
                  type="button"
                  data-cursor="REQUEST DOSSIER"
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenInquiry();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-ivory/15 text-xs font-mono uppercase tracking-wider text-ivory hover:border-lime/50 hover:text-lime transition-colors"
                >
                  Request Dossier
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Scroll-Progress Z-Tunnel Rail */}
            <div className="mb-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
                  {CASES.map((c, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        data-cursor={`SELECT ${c.index}`}
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveIndex(idx);
                          if (onSelectShader) onSelectShader(c.shaderMode);
                        }}
                        onMouseEnter={() => soundEngine.playHover()}
                        className={`px-3.5 py-2 rounded-xl border text-left transition-all shrink-0 ${
                          active
                            ? 'bg-surface border-lime text-ivory shadow-[0_0_20px_rgba(200,255,50,0.18)] scale-[1.03]'
                            : 'bg-obsidian/60 border-ivory/10 text-ivory/50 hover:text-ivory hover:border-ivory/25'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-lime">{c.index} // PORTAL</div>
                        <div className="font-display font-semibold text-xs sm:text-sm truncate max-w-[155px]">
                          {c.client}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous Work"
                    data-cursor="PREV WORK"
                    onClick={() => handleStepStream(-1)}
                    className="w-9 h-9 rounded-full bg-surface border border-ivory/15 flex items-center justify-center text-ivory hover:border-lime hover:text-lime transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Work"
                    data-cursor="NEXT WORK"
                    onClick={() => handleStepStream(1)}
                    className="w-9 h-9 rounded-full bg-surface border border-ivory/15 flex items-center justify-center text-ivory hover:border-lime hover:text-lime transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scroll Runway Progress Bar */}
              <div className="w-full h-1 bg-ivory/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigoGlow via-lime to-lime shadow-[0_0_12px_#C8FF32]"
                  style={{ width: `${scrollDepthPct}%` }}
                />
              </div>
            </div>

            {/* 3D Perspective Stage Card driven by BOTH Scroll & Cursor Tilt */}
            <motion.div
              style={{
                rotateY: stageRotateY,
                rotateX: stageRotateX,
                transformStyle: 'preserve-3d',
                perspective: '1500px',
              }}
              className="will-change-transform"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStreamCase.id}
                  initial={{
                    opacity: 0,
                    z: -260,
                    scale: 0.78,
                    rotateX: 22,
                    rotateY: -18,
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    opacity: 1,
                    z: 0,
                    scale: 1,
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    z: 180,
                    scale: 1.14,
                    rotateX: -16,
                    rotateY: 16,
                    filter: 'blur(8px)',
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative rounded-3xl bg-surface/90 border border-ivory/15 p-6 sm:p-10 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl group"
                >
                  <div
                    className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-35 pointer-events-none transition-all duration-500"
                    style={{ backgroundColor: currentStreamCase.accent }}
                  />

                  <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Editorial & Telemetry with Foreground Parallax */}
                    <motion.div
                      style={{ y: badgeParallaxY }}
                      className="lg:col-span-6 space-y-5 will-change-transform"
                    >
                      <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.22em] text-ivory/60">
                        <span
                          className="px-2.5 py-1 rounded bg-obsidian border border-ivory/15 font-bold"
                          style={{ color: currentStreamCase.accent }}
                        >
                          {currentStreamCase.index} / 0{CASES.length}
                        </span>
                        <span>{currentStreamCase.sector}</span>
                      </div>

                      <h3 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory leading-[1.04]">
                        <ScrambleText
                          text={currentStreamCase.client}
                          triggerKey={currentStreamCase.id}
                        />
                      </h3>

                      <p className="text-ivory/75 text-sm sm:text-base leading-relaxed">
                        {currentStreamCase.summary}
                      </p>

                      {/* 4 Key Telemetry Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        {currentStreamCase.stats.map((st) => (
                          <div
                            key={st.label}
                            className="rounded-xl bg-obsidian/85 border border-ivory/10 p-3 shadow-lg"
                          >
                            <div className="text-[10px] font-mono uppercase tracking-wider text-ivory/45">
                              {st.label}
                            </div>
                            <div
                              className="font-display font-bold text-lg sm:text-xl mt-0.5"
                              style={{ color: currentStreamCase.accent }}
                            >
                              {st.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          type="button"
                          data-cursor="LAUNCH PORTAL"
                          onClick={() => handleOpenCase(currentStreamCase, activeIndex)}
                          onMouseEnter={() => soundEngine.playHover()}
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-lime text-obsidian font-display font-semibold text-sm hover:bg-ivory transition-all shadow-[0_0_30px_rgba(200,255,50,0.3)]"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Launch Interactive Case Portal
                        </button>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-lime/80">
                          [ KEEP SCROLLING TO FLY TO NEXT PORTAL ]
                        </span>
                      </div>
                    </motion.div>

                    {/* Right Column: Live Procedural Shader / Canvas Viewport with Counter-Parallax */}
                    <motion.div
                      style={{ y: canvasParallaxY }}
                      onClick={() => handleOpenCase(currentStreamCase, activeIndex)}
                      data-cursor="ENTER PORTAL"
                      className="lg:col-span-6 relative h-72 sm:h-96 rounded-2xl bg-obsidian border border-ivory/15 overflow-hidden cursor-pointer group/canvas will-change-transform shadow-2xl"
                    >
                      <CaseProceduralCanvas
                        type={currentStreamCase.visualType}
                        accent={currentStreamCase.accent}
                        accentSecondary={currentStreamCase.accentSecondary}
                        intensity={1.25}
                        interactive={true}
                      />

                      <div className="absolute top-4 inset-x-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-ivory/60 pointer-events-none">
                        <span>LIVE TELEMETRY // {currentStreamCase.id.toUpperCase()}</span>
                        <span
                          className="px-2 py-0.5 rounded bg-obsidian/90 border border-ivory/15"
                          style={{ color: currentStreamCase.accent }}
                        >
                          Z-TUNNEL // {scrollDepthPct}%
                        </span>
                      </div>

                      <div className="absolute bottom-4 inset-x-4 flex items-end justify-between pointer-events-none">
                        <div className="bg-obsidian/85 backdrop-blur-md border border-ivory/10 rounded-xl px-4 py-2.5">
                          <div
                            className="font-display font-bold text-2xl sm:text-3xl"
                            style={{ color: currentStreamCase.accent }}
                          >
                            {currentStreamCase.metric}
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-ivory/60">
                            {currentStreamCase.metricLabel}
                          </div>
                        </div>

                        <div className="px-3.5 py-2 rounded-full bg-lime text-obsidian font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover/canvas:scale-105 transition-transform">
                          <span>ENTER PORTAL</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      ) : (
        /* MODE 2: BENTO MATRIX GRID WITH 3D SCROLL FLIP-IN */
        <div className="py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-lime mb-3">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span>// INTERACTIVE WORK ARCHIVE (MATRIX VIEW)</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
                Selected Portals<span className="text-lime">.</span>
              </h2>
            </div>

            <div className="inline-flex items-center bg-surface/90 border border-ivory/15 rounded-full p-1 backdrop-blur-md self-start">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setLayoutMode('stream');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-ivory/65 hover:text-ivory"
              >
                3D Scroll Stream
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setLayoutMode('grid');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-lime text-obsidian font-semibold"
              >
                Matrix Grid
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" style={{ perspective: '1400px' }}>
            {CASES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.id}
                  data-cursor="LAUNCH PORTAL"
                  onClick={() => handleOpenCase(item, idx)}
                  onMouseEnter={() => soundEngine.playHover()}
                  initial={{ opacity: 0, y: 70, rotateX: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className={`${item.span} cursor-pointer group relative rounded-2xl bg-surface/90 border border-ivory/10 p-6 sm:p-8 overflow-hidden transition-all hover:border-lime/50 backdrop-blur-md`}
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-lime block">
                            {item.index} // {item.sector}
                          </span>
                          <h3 className="font-display font-bold text-xl sm:text-2xl text-ivory mt-1">
                            {item.client}
                          </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-obsidian border border-ivory/15 flex items-center justify-center text-ivory/70 group-hover:text-obsidian group-hover:bg-lime group-hover:border-lime transition-all">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mb-4 flex items-baseline gap-3">
                        <span
                          className="font-display font-bold text-4xl sm:text-5xl tracking-tight"
                          style={{ color: item.accent }}
                        >
                          {item.metric}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-wider text-ivory/55">
                          {item.metricLabel}
                        </span>
                      </div>

                      <p className="text-sm text-ivory/70 leading-relaxed mb-5">{item.summary}</p>
                    </div>

                    <div className="relative h-40 rounded-xl bg-obsidian border border-ivory/10 overflow-hidden">
                      <CaseProceduralCanvas
                        type={item.visualType}
                        accent={item.accent}
                        accentSecondary={item.accentSecondary}
                        intensity={1.0}
                      />
                      <div className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded bg-obsidian/90 border border-ivory/15 text-[10px] font-mono uppercase tracking-wider text-lime flex items-center gap-1">
                        <span>OPEN INTERACTIVE PORTAL</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-SCREEN ACTIVE THEORY CASE STUDY PORTAL TAKEOVER */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            key="case-portal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-obsidian/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="min-h-screen max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-ivory/15 pb-5 mb-8">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-surface border border-ivory/15"
                    style={{ color: selectedCase.accent }}
                  >
                    PORTAL {selectedCase.index}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-ivory/60">
                    {selectedCase.sector}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-cursor="PREV PORTAL"
                    onClick={() => handleSwitchPortalCase(-1)}
                    className="px-3.5 py-2 rounded-full bg-surface border border-ivory/15 text-xs font-mono uppercase tracking-wider text-ivory hover:border-lime hover:text-lime transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    data-cursor="NEXT PORTAL"
                    onClick={() => handleSwitchPortalCase(1)}
                    className="px-3.5 py-2 rounded-full bg-surface border border-ivory/15 text-xs font-mono uppercase tracking-wider text-ivory hover:border-lime hover:text-lime transition-colors flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-cursor="EXIT PORTAL"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedCase(null);
                    }}
                    className="ml-2 p-2.5 rounded-full bg-lime text-obsidian hover:bg-ivory transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-10 items-start my-auto">
                <div className="lg:col-span-6 space-y-6">
                  <h2 className="font-display font-bold text-4xl sm:text-6xl tracking-tight text-ivory leading-none">
                    <ScrambleText text={selectedCase.client} triggerKey={selectedCase.id} />
                  </h2>

                  <p className="text-base sm:text-lg text-ivory/80 leading-relaxed">
                    {selectedCase.summary}
                  </p>

                  <div className="rounded-2xl bg-surface border border-ivory/10 p-5">
                    <div className="text-xs font-mono uppercase tracking-wider text-lime mb-2">
                      // Engineering Challenge
                    </div>
                    <p className="text-sm text-ivory/70 leading-relaxed">
                      {selectedCase.challenge}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-ivory/50 mb-3">
                      // Production Architecture & Shaders
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {selectedCase.architecture.map((arch) => (
                        <div
                          key={arch}
                          className="rounded-xl bg-surface/80 border border-ivory/10 p-3.5 text-xs text-ivory/85 flex items-start gap-2.5"
                        >
                          <Sparkles
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: selectedCase.accent }}
                          />
                          <span>{arch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedCase.stats.map((st) => (
                      <div
                        key={st.label}
                        className="rounded-xl bg-surface border border-ivory/10 p-3.5"
                      >
                        <div className="text-[10px] font-mono uppercase text-ivory/50">
                          {st.label}
                        </div>
                        <div
                          className="font-display font-bold text-2xl mt-1"
                          style={{ color: selectedCase.accent }}
                        >
                          {st.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-3xl bg-surface border border-ivory/15 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime">
                      <Sliders className="w-4 h-4" />
                      <span>Interactive Telemetry & Shader Sandbox</span>
                    </div>
                    <span className="text-[11px] font-mono text-ivory/50">
                      FREQ: {simFrequency.toFixed(2)}x
                    </span>
                  </div>

                  <div className="h-80 sm:h-96 rounded-2xl bg-obsidian border border-ivory/15 overflow-hidden relative">
                    <CaseProceduralCanvas
                      type={selectedCase.visualType}
                      accent={selectedCase.accent}
                      accentSecondary={selectedCase.accentSecondary}
                      intensity={simFrequency}
                      interactive={true}
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ivory/55 bg-obsidian/80 backdrop-blur-md px-3 py-2 rounded-lg border border-ivory/10">
                      <span>MOVE CURSOR OVER CANVAS TO WARP FIELD</span>
                      <span style={{ color: selectedCase.accent }}>ACTIVE_GLSL // 60FPS</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-ivory/65">
                      <span>SIMULATION VELOCITY / SHADER OVERDRIVE</span>
                      <span className="text-lime">{Math.round(simFrequency * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="3.0"
                      step="0.05"
                      value={simFrequency}
                      onChange={(e) => setSimFrequency(parseFloat(e.target.value))}
                      className="w-full accent-lime cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10">
                    <span className="text-xs text-ivory/60">
                      Want this architecture deployed for your product?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const title = selectedCase.client;
                        setSelectedCase(null);
                        onOpenInquiry({ projectType: `Architecture like ${title}` });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime text-obsidian font-display font-semibold text-xs uppercase tracking-wider hover:bg-ivory transition-colors"
                    >
                      Commission Similar Build
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
