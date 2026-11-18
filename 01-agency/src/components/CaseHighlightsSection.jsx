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

// Lightweight IntersectionObserver-paused Canvas Preview
function CaseProceduralCanvas({ type, accent, accentSecondary, intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = null;
    let isVisible = true;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    handleResize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const start = performance.now();
    const draw = (now) => {
      if (isVisible) {
        const t = (now - start) * 0.001 * intensity;
        const w = canvas.width || 320;
        const h = canvas.height || 180;

        ctx.clearRect(0, 0, w, h);

        if (type === 'wave') {
          for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.strokeStyle = layer % 2 === 0 ? accent : accentSecondary;
            ctx.lineWidth = layer === 0 ? 2 : 1.2;
            ctx.globalAlpha = 0.85 - layer * 0.2;
            for (let x = 0; x <= w; x += 10) {
              const nx = x / w;
              const y =
                h * 0.5 +
                Math.sin(nx * 7 * intensity + t * 2.0 + layer * 0.8) * 24 +
                Math.cos(nx * 12 - t * 1.4) * 8;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        } else if (type === 'matrix') {
          const cols = 14;
          const barW = (w - 24) / cols;
          for (let i = 0; i < cols; i++) {
            const phase = Math.sin(t * 2.4 + i * 0.55) * 0.5 + 0.5;
            const barH = Math.max(10, phase * (h * 0.7));
            const x = 12 + i * barW;
            const y = h - barH - 10;
            ctx.fillStyle = i % 3 === 0 ? accent : accentSecondary;
            ctx.globalAlpha = 0.3 + phase * 0.6;
            ctx.fillRect(x, y, barW - 5, barH);
          }
        } else if (type === 'orbital') {
          const cx = w * 0.5;
          const cy = h * 0.5;
          for (let r = 1; r <= 3; r++) {
            ctx.beginPath();
            ctx.strokeStyle = r % 2 === 0 ? accent : accentSecondary;
            ctx.globalAlpha = 0.4 + r * 0.15;
            ctx.lineWidth = 1.5;
            const radius = r * Math.min(w, h) * 0.12;
            ctx.arc(cx, cy, radius, t * r * 0.6, t * r * 0.6 + Math.PI * 1.4);
            ctx.stroke();
          }
        } else {
          const nodes = 4;
          for (let i = 0; i < nodes; i++) {
            const x1 = (w / (nodes + 1)) * (i + 1);
            const y1 = h * 0.75;
            const x2 = w * (0.2 + ((i * 0.2 + t * 0.04) % 0.65));
            const y2 = h * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = i % 2 === 0 ? accent : accentSecondary;
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 1.6;
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo((x1 + x2) * 0.5, h * 0.1 + Math.sin(t + i) * 16, x2, y2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [type, accent, accentSecondary, intensity]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

export default function CaseHighlightsSection({
  onOpenInquiry,
  onTriggerPortal,
  onSelectShader,
  forceStreamLayout = false,
}) {
  const [layoutMode, setLayoutMode] = useState('stream');
  const [selectedCase, setSelectedCase] = useState(null);
  const [simFrequency, setSimFrequency] = useState(1.25);

  // Unique to 01-agency: Horizontal Cinema Filmstrip Track driven 100% by GPU MotionValue (zero React state re-renders on scroll!)
  const runwayRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  // Translates the horizontal filmstrip smoothly from 0% to -72% on the GPU
  const filmstripX = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  const progressBarScaleX = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  useEffect(() => {
    if (forceStreamLayout) setLayoutMode('stream');
  }, [forceStreamLayout]);

  const handleOpenCase = (item) => {
    soundEngine.playTransition();
    if (onSelectShader) onSelectShader(item.shaderMode);
    if (onTriggerPortal) {
      onTriggerPortal({
        label: item.client,
        sublabel: `PORTAL ${item.index} // ${item.sector}`,
        accent: item.accent,
      });
    }
    setTimeout(() => {
      setSelectedCase(item);
    }, 220);
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
    }, 200);
  };

  return (
    <section id="work" className="relative">
      {/* MODE 1: VESPERA SIGNATURE HORIZONTAL CINEMA FILMSTRIP TRACK (100% GPU, ZERO LAG) */}
      {layoutMode === 'stream' ? (
        <div ref={runwayRef} className="relative h-[240vh]">
          <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden px-5 sm:px-8 max-w-[1440px] mx-auto">
            {/* Header + View Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-lime mb-2">
                  <span className="w-2 h-2 rounded-full bg-lime" />
                  <span>// WIDESCREEN HORIZONTAL FILMSTRIP REEL (SCROLL TO GLIDE)</span>
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
                  <ScrambleText text="Selected Portals" scrambleOnMount={false} />
                  <span className="text-lime">.</span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center bg-[#131318] border border-ivory/15 rounded-full p-1">
                  <button
                    type="button"
                    data-cursor="FILMSTRIP REEL"
                    onClick={() => {
                      soundEngine.playClick();
                      setLayoutMode('stream');
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-lime text-obsidian font-semibold"
                  >
                    Cinema Reel
                  </button>
                  <button
                    type="button"
                    data-cursor="BENTO MATRIX"
                    onClick={() => {
                      soundEngine.playClick();
                      setLayoutMode('grid');
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-ivory/65 hover:text-ivory"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131318] border border-ivory/15 text-xs font-mono uppercase tracking-wider text-ivory hover:border-lime/50 hover:text-lime transition-colors"
                >
                  Request Dossier
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* GPU-Composited Progress Bar */}
            <div className="w-full h-1 bg-ivory/10 rounded-full overflow-hidden mb-6">
              <motion.div
                style={{ scaleX: progressBarScaleX, transformOrigin: 'left' }}
                className="w-full h-full bg-lime will-change-transform"
              />
            </div>

            {/* Horizontal Cinema Track — pure translate3d(x) on GPU */}
            <div className="relative w-full">
              <motion.div
                style={{ x: filmstripX }}
                className="flex items-stretch gap-6 w-[340vw] sm:w-[260vw] lg:w-[210vw] will-change-transform"
              >
                {CASES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.id}
                      data-cursor="LAUNCH PORTAL"
                      onClick={() => handleOpenCase(item)}
                      onMouseEnter={() => soundEngine.playHover()}
                      className="w-[82vw] sm:w-[62vw] lg:w-[48vw] shrink-0 cursor-pointer group relative rounded-3xl bg-[#131318] border border-ivory/15 p-6 sm:p-8 flex flex-col justify-between hover:border-lime/60 transition-colors shadow-2xl"
                    >
                      <div className="grid md:grid-cols-12 gap-6 items-center h-full">
                        {/* Left Editorial Info */}
                        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span
                                className="px-2.5 py-0.5 rounded bg-obsidian border border-ivory/15 text-[11px] font-mono font-bold"
                                style={{ color: item.accent }}
                              >
                                {item.index} / 04
                              </span>
                              <div className="w-8 h-8 rounded-full bg-obsidian border border-ivory/15 flex items-center justify-center text-ivory/70 group-hover:bg-lime group-hover:text-obsidian transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                            </div>

                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ivory/50 mb-1">
                              {item.sector}
                            </div>
                            <h3 className="font-display font-bold text-2xl sm:text-3xl text-ivory tracking-tight">
                              {item.client}
                            </h3>
                            <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed mt-2.5 line-clamp-3">
                              {item.summary}
                            </p>
                          </div>

                          <div className="pt-2">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {item.stats.slice(0, 2).map((st) => (
                                <div
                                  key={st.label}
                                  className="rounded-xl bg-obsidian border border-ivory/10 px-3 py-2"
                                >
                                  <div className="text-[9px] font-mono uppercase text-ivory/45">
                                    {st.label}
                                  </div>
                                  <div
                                    className="font-display font-bold text-base"
                                    style={{ color: item.accent }}
                                  >
                                    {st.value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-lime group-hover:translate-x-1 transition-transform">
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Enter Fullscreen Portal</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Live Procedural Viewport */}
                        <div className="md:col-span-6 relative h-56 sm:h-72 rounded-2xl bg-obsidian border border-ivory/15 overflow-hidden">
                          <CaseProceduralCanvas
                            type={item.visualType}
                            accent={item.accent}
                            accentSecondary={item.accentSecondary}
                            intensity={1.1}
                          />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                            <div className="bg-obsidian/90 border border-ivory/15 rounded-xl px-3.5 py-2">
                              <div
                                className="font-display font-bold text-2xl"
                                style={{ color: item.accent }}
                              >
                                {item.metric}
                              </div>
                              <div className="text-[9px] font-mono uppercase tracking-wider text-ivory/60">
                                {item.metricLabel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: BENTO MATRIX GRID */
        <div className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-lime mb-3">
                <span className="w-2 h-2 rounded-full bg-lime" />
                <span>// INTERACTIVE WORK ARCHIVE (MATRIX VIEW)</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
                Selected Portals<span className="text-lime">.</span>
              </h2>
            </div>

            <div className="inline-flex items-center bg-[#131318] border border-ivory/15 rounded-full p-1 self-start">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setLayoutMode('stream');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-ivory/65 hover:text-ivory"
              >
                Cinema Reel
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {CASES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.id}
                  data-cursor="LAUNCH PORTAL"
                  onClick={() => handleOpenCase(item)}
                  onMouseEnter={() => soundEngine.playHover()}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className={`${item.span} cursor-pointer group relative rounded-2xl bg-[#131318] border border-ivory/10 p-6 sm:p-8 overflow-hidden transition-colors hover:border-lime/50`}
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
                        <div className="w-10 h-10 rounded-full bg-obsidian border border-ivory/15 flex items-center justify-center text-ivory/70 group-hover:text-obsidian group-hover:bg-lime transition-colors">
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
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-SCREEN CASE STUDY PORTAL TAKEOVER */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            key="case-portal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-[#0A0A0C] overflow-y-auto"
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
                          className="rounded-xl bg-surface border border-ivory/10 p-3.5 text-xs text-ivory/85 flex items-start gap-2.5"
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
                    />
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
