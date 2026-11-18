import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  MonitorPlay,
  Sparkles,
  CheckCircle2,
  Globe,
  MessageSquarePlus,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

function ProjectStageArtwork({ project }) {
  if (project.id === 'aether-ai') {
    return (
      <div className="w-full h-full bg-[#090D16] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5 text-[11px] font-mono text-sky-400">
          <span>AETHER // NEURAL CLUSTER TOPOLOGY</span>
          <span>P50: 0.42ms · 40K MSG/S</span>
        </div>

        <svg viewBox="0 0 480 210" className="w-full h-48 my-auto" fill="none">
          <path
            d="M40 155 C 140 155, 140 50, 240 50 C 340 50, 340 135, 440 70"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />
          <path
            d="M40 90 C 150 90, 170 155, 240 125 C 310 90, 350 40, 440 135"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          {[
            { cx: 40, cy: 155, label: 'INGEST_01' },
            { cx: 240, cy: 50, label: 'TENSOR_ROUTER' },
            { cx: 240, cy: 125, label: 'KV_CACHE_MESH' },
            { cx: 440, cy: 70, label: 'EDGE_REPLICA' },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.cx} cy={n.cy} r="8" fill="#090D16" stroke="#38BDF8" strokeWidth="2.5" />
              <text
                x={n.cx - 28}
                y={n.cy + 22}
                fill="#94A3B8"
                fontSize="9"
                fontFamily="monospace"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-xl bg-white/[0.04] border border-sky-400/25 p-3">
            <div className="text-white/45 text-[10px]">CLUSTER SLA</div>
            <div className="text-sky-400 font-bold text-base mt-0.5">99.99%</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-white/45 text-[10px]">INTERACTION</div>
            <div className="text-white font-bold text-base mt-0.5">Spotlight + SVG</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-white/45 text-[10px]">NODES</div>
            <div className="text-violet-400 font-bold text-base mt-0.5">16,384 GPUs</div>
          </div>
        </div>
      </div>
    );
  }

  if (project.id === 'kanso-atelier') {
    return (
      <div className="w-full h-full bg-[#F6F4F0] text-[#1A1917] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1A1917]/15 pb-3.5 text-[11px] font-mono text-[#1A1917]/60">
          <span>PLATE I — KOMOREBI PAVILION · KYOTO</span>
          <span>SOLAR AZIMUTH: 14:30 ZENITH</span>
        </div>

        <svg viewBox="0 0 480 210" className="w-full h-48 my-auto" fill="none">
          <circle cx="370" cy="56" r="30" fill="#D4B483" fillOpacity="0.45" />
          <rect x="70" y="50" width="220" height="115" fill="#E5E0D8" stroke="#1A1917" strokeWidth="1.5" />
          <rect x="112" y="76" width="76" height="89" fill="#1A1917" fillOpacity="0.88" />
          <line x1="30" y1="165" x2="450" y2="165" stroke="#1A1917" strokeWidth="1.5" />
          <line x1="70" y1="28" x2="70" y2="185" stroke="#1A1917" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="290" y1="28" x2="290" y2="185" stroke="#1A1917" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x="140" y="40" fill="#1A1917" fontSize="9" fontFamily="monospace">
            ELEVATION 1:100 — 14,200mm
          </text>
        </svg>

        <div className="flex items-center justify-between border-t border-[#1A1917]/15 pt-3.5 text-xs">
          <span className="font-serif italic text-base text-[#1A1917]">
            “Poetic negative space (Ma) &amp; slow limestone curtain unveils.”
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#1A1917] text-[#F6F4F0]">
            HELIODON LIVE
          </span>
        </div>
      </div>
    );
  }

  if (project.id === 'solstice-roasters') {
    return (
      <div className="w-full h-full bg-[#1C120D] text-[#FBF7F0] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#FBF7F0]/15 pb-3.5 text-[11px] font-mono text-[#E05A37]">
          <span>SOLSTICE ROASTERS · FANNED LETTERPRESS DECK</span>
          <span>LOT #04 · GEDEB ETHIOPIA</span>
        </div>

        <div className="my-auto flex items-center justify-center py-4">
          {[-14, -5, 5, 14].map((deg, i) => (
            <div
              key={deg}
              style={{ transform: `rotate(${deg}deg) translateY(${Math.abs(deg) * 0.6}px)` }}
              className="w-28 sm:w-32 h-40 -mx-3 rounded-2xl bg-[#F5EFE6] text-[#1C120D] border border-[#1C120D]/15 p-3.5 shadow-xl flex flex-col justify-between"
            >
              <span className="text-[9px] font-mono uppercase text-[#E05A37] font-bold">
                LOT 0{i + 1}
              </span>
              <div className="w-9 h-9 rounded-full bg-[#E05A37]/20 border border-[#E05A37] mx-auto" />
              <div className="text-[11px] font-bold leading-tight">
                {['Yirgacheffe', 'Huila Pink', 'Nyeri AA', 'Tarrazú'][i]}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#FBF7F0]/15 pt-3.5 text-xs font-mono">
          <span className="text-[#FBF7F0]/75">SCROLL POUR-OVER STREAM + 6-AXIS RADAR</span>
          <span className="text-[#E05A37] font-bold">2120M MASL</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#050D14] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5 text-[11px] font-mono text-emerald-400">
        <span>MERIDIAN // TITANIUM HARDWARE &amp; FX RAILS</span>
        <span>POOL: $48.2B+ · 0.01% SPREAD</span>
      </div>

      <div className="my-auto grid grid-cols-12 gap-4 items-center py-2">
        <div className="col-span-7 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 border border-emerald-400/40 p-5 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 mb-6">
            <span>MERIDIAN QUANTUM TITANIUM</span>
            <span>GRADE-5</span>
          </div>
          <div className="font-mono text-sm sm:text-base tracking-widest text-white/90 mb-3">
            4829 •••• •••• 9014
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/55">
            <span>DEONTAE WORK</span>
            <span>ZERO-LATENCY RAIL</span>
          </div>
        </div>

        <div className="col-span-5 space-y-2.5">
          <div className="rounded-xl bg-white/[0.04] border border-emerald-500/25 p-3">
            <div className="text-[10px] font-mono text-white/45">SETTLEMENT</div>
            <div className="font-display font-bold text-xl text-emerald-400">38ms finality</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-[10px] font-mono text-white/45">CORRIDORS</div>
            <div className="font-display font-bold text-base text-white">TYO → LDN → NYC</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3.5 text-[11px] font-mono text-white/55">
        <span>APPLE-STYLE SCROLL-DOCKING 3D CARD</span>
        <span className="text-emerald-400">LIVE BEZIER FX ARCS</span>
      </div>
    </div>
  );
}

function ProjectScrollPlate({ project, onOpenTheater, onOpenInquiry, onActiveChange }) {
  const [embedLive, setEmbedLive] = useState(false);
  const plateRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: plateRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [44, 0, 0, -36]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.95, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.25, 1, 1, 0.3]);

  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onActiveChange) {
          onActiveChange(project);
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [project, onActiveChange]);

  return (
    <div id={`project-${project.id}`} ref={plateRef} className="scroll-mt-28">
      <motion.article
        style={{ y, scale, opacity }}
        className="rounded-[28px] bg-[#0D0E12] border border-white/10 p-5 sm:p-7 shadow-[0_35px_90px_rgba(0,0,0,0.75)] will-change-transform"
      >
        {/* Top Browser Frame Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.accent }}
              />
            </div>
            <span className="font-mono text-xs text-white/60 ml-1">
              {project.number} // {project.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setEmbedLive((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                embedLive
                  ? 'bg-[#F5F4F0] text-[#060608] border-[#F5F4F0] font-semibold'
                  : 'bg-[#060608] text-white/75 border-white/15 hover:border-white/35'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>{embedLive ? 'Live Site Embedded' : 'Embed Live Site'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenTheater(project);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider text-[#060608]"
              style={{ backgroundColor: project.accent }}
            >
              <MonitorPlay className="w-3 h-3" />
              <span>Fullscreen Demo</span>
            </button>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/75 hover:text-white transition-colors"
              title={`Open ${project.liveUrl}`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Viewport Container */}
        <div className="relative h-[360px] sm:h-[440px] rounded-2xl bg-[#060608] border border-white/10 overflow-hidden group">
          {embedLive ? (
            <iframe
              src={project.liveUrl}
              title={project.title}
              className="w-full h-full border-0 bg-black"
            />
          ) : (
            <div
              onClick={() => {
                soundEngine.playClick();
                onOpenTheater(project);
              }}
              className="w-full h-full cursor-pointer"
            >
              <ProjectStageArtwork project={project} />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[#060608] font-display font-bold text-xs uppercase tracking-[0.14em] shadow-2xl"
                  style={{ backgroundColor: project.accent }}
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span>Click to Interact With Live Website</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Client Action Bar right on every project card */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-display font-bold text-base text-white">{project.title}</span>
            <span className="text-xs text-white/50 ml-2">— {project.category}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenInquiry({
                inspiration: `${project.title} (${project.category})`,
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider hover:underline"
            style={{ color: project.accent }}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Want a website like this? Get a Quote →</span>
          </button>
        </div>
      </motion.article>
    </div>
  );
}

export default function WorkStageShowcase({
  activeProject,
  onOpenTheater,
  onOpenInquiry,
  onActiveChange,
}) {
  const current = activeProject || PORTFOLIO_PROJECTS[0];

  return (
    <section id="work" className="relative py-20 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#E2D9C8] block mb-3">
            // SELECTED CLIENT &amp; CONCEPT WORKS (01 — 04)
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5F4F0]">
            Websites built to{' '}
            <span className="font-serif italic font-normal text-[#E2D9C8]">
              stand apart.
            </span>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenInquiry()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#E2D9C8] text-[#060608] font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors self-start md:self-end"
        >
          <span>Start Your Website Project</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Split-Stage Sticky Exhibition */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left 5 Cols: Pinned Project Details & Direct Client CTA */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 self-start">
          <div className="rounded-[28px] bg-[#0D0E12]/95 border border-white/10 p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                  WORK
                </span>
                <div className="h-12 overflow-hidden flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.number}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display font-extrabold text-4xl tracking-tight block"
                      style={{ color: current.accent }}
                    >
                      {current.number}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="font-mono text-xs text-white/30">/ 04</span>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-wider text-white/75">
                {current.category}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display font-extrabold text-3xl text-[#F5F4F0] tracking-tight">
                    {current.title}
                  </h3>
                  <p
                    className="font-serif italic text-xl mt-0.5"
                    style={{ color: current.accent }}
                  >
                    {current.subtitle}
                  </p>
                </div>

                <p className="text-sm text-white/70 leading-relaxed">{current.summary}</p>

                <ul className="space-y-2 pt-1">
                  {current.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs text-white/75">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: current.accent }}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {current.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl bg-[#060608] border border-white/10 p-2.5"
                    >
                      <div className="text-[9px] font-mono uppercase text-white/45">{m.label}</div>
                      <div
                        className="font-display font-bold text-sm mt-0.5"
                        style={{ color: current.accent }}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Client Conversion Buttons */}
                <div className="pt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenInquiry({
                        inspiration: `${current.title} (${current.category})`,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-display font-bold uppercase tracking-wider text-[#060608] transition-transform active:scale-95 shadow-lg"
                    style={{ backgroundColor: current.accent }}
                  >
                    <span>Build a Website Like {current.title}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenTheater(current)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-white transition-colors"
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      <span>Fullscreen Demo</span>
                    </button>

                    <a
                      href={current.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-white transition-colors"
                    >
                      <span>Open Tab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right 7 Cols: Vertical Stream of Interactive Browser Stages */}
        <div className="lg:col-span-7 space-y-14 sm:space-y-20">
          {PORTFOLIO_PROJECTS.map((project) => (
            <ProjectScrollPlate
              key={project.id}
              project={project}
              onOpenTheater={onOpenTheater}
              onOpenInquiry={onOpenInquiry}
              onActiveChange={onActiveChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
