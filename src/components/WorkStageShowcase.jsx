import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  MonitorPlay,
  Sparkles,
  CheckCircle2,
  Eye,
  Code2,
  Globe,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';

// Bespoke Vector/UI Miniature Preview for each of the 4 sites (zero lag, instant render)
function ProjectStageArtwork({ project }) {
  if (project.id === 'aether-ai') {
    return (
      <div className="w-full h-full bg-[#090D16] p-6 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] font-mono text-sky-400">
          <span>AETHER // NEURAL CLUSTER TOPOLOGY</span>
          <span>P50: 0.42ms · 40K MSG/S</span>
        </div>

        {/* Animated SVG Synaptic Circuit Graph */}
        <svg viewBox="0 0 480 200" className="w-full h-44 my-auto" fill="none">
          <path
            d="M40 150 C 140 150, 140 50, 240 50 C 340 50, 340 130, 440 70"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />
          <path
            d="M40 90 C 150 90, 170 150, 240 120 C 310 90, 350 40, 440 130"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          {[
            { cx: 40, cy: 150, label: 'INGEST' },
            { cx: 240, cy: 50, label: 'TENSOR_ROUTER' },
            { cx: 240, cy: 120, label: 'KV_CACHE' },
            { cx: 440, cy: 70, label: 'EDGE_NODE' },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.cx} cy={n.cy} r="8" fill="#090D16" stroke="#38BDF8" strokeWidth="2.5" />
              <text
                x={n.cx - 24}
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
            <div className="text-white/45 text-[10px]">CLUSTER LOAD</div>
            <div className="text-sky-400 font-bold text-base mt-0.5">99.99% SLA</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-white/45 text-[10px]">MOTION ENGINE</div>
            <div className="text-white font-bold text-base mt-0.5">Spotlight + SVG</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-white/45 text-[10px]">ACTIVE NODES</div>
            <div className="text-violet-400 font-bold text-base mt-0.5">16,384 GPUs</div>
          </div>
        </div>
      </div>
    );
  }

  if (project.id === 'kanso-atelier') {
    return (
      <div className="w-full h-full bg-[#F6F4F0] text-[#1A1917] p-6 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1A1917]/15 pb-3 text-[11px] font-mono text-[#1A1917]/60">
          <span>PLATE I — KOMOREBI PAVILION · KYOTO</span>
          <span>SOLAR AZIMUTH: 14:30 ZENITH</span>
        </div>

        <svg viewBox="0 0 480 200" className="w-full h-44 my-auto" fill="none">
          {/* Warm Sun & Architectural Monolith */}
          <circle cx="370" cy="56" r="28" fill="#D4B483" fillOpacity="0.45" />
          <rect x="70" y="50" width="220" height="110" fill="#E5E0D8" stroke="#1A1917" strokeWidth="1.5" />
          <rect x="110" y="75" width="75" height="85" fill="#1A1917" fillOpacity="0.85" />
          <line x1="30" y1="160" x2="450" y2="160" stroke="#1A1917" strokeWidth="1.5" />
          <line x1="70" y1="30" x2="70" y2="180" stroke="#1A1917" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="290" y1="30" x2="290" y2="180" stroke="#1A1917" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x="145" y="42" fill="#1A1917" fontSize="9" fontFamily="monospace">
            ELEVATION 1:100 — 14,200mm
          </text>
        </svg>

        <div className="flex items-center justify-between border-t border-[#1A1917]/15 pt-3 text-xs">
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
      <div className="w-full h-full bg-[#1C120D] text-[#FBF7F0] p-6 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#FBF7F0]/15 pb-3 text-[11px] font-mono text-[#E05A37]">
          <span>SOLSTICE ROASTERS · FANNED LETTERPRESS DECK</span>
          <span>LOT #04 · GEDEB ETHIOPIA</span>
        </div>

        {/* Fanned Tasting Cards Illustration */}
        <div className="my-auto flex items-center justify-center py-4">
          {[-14, -5, 5, 14].map((deg, i) => (
            <div
              key={deg}
              style={{ transform: `rotate(${deg}deg) translateY(${Math.abs(deg) * 0.6}px)` }}
              className="w-28 h-36 -mx-3 rounded-2xl bg-[#F5EFE6] text-[#1C120D] border border-[#1C120D]/15 p-3 shadow-xl flex flex-col justify-between"
            >
              <span className="text-[9px] font-mono uppercase text-[#E05A37] font-bold">
                LOT 0{i + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E05A37]/20 border border-[#E05A37] mx-auto" />
              <div className="text-[10px] font-bold leading-tight">
                {['Yirgacheffe', 'Huila Pink', 'Nyeri AA', 'Tarrazú'][i]}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#FBF7F0]/15 pt-3 text-xs font-mono">
          <span className="text-[#FBF7F0]/75">SCROLL-DRIVEN POUR-OVER STREAM + 6-AXIS RADAR</span>
          <span className="text-[#E05A37] font-bold">2120M MASL</span>
        </div>
      </div>
    );
  }

  // Meridian Pay
  return (
    <div className="w-full h-full bg-[#050D14] text-white p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] font-mono text-emerald-400">
        <span>MERIDIAN // TITANIUM HARDWARE &amp; FX RAILS</span>
        <span>POOL: $48.2B+ · 0.01% SPREAD</span>
      </div>

      <div className="my-auto grid grid-cols-12 gap-4 items-center py-2">
        {/* 3D Brushed Titanium Card Miniature */}
        <div className="col-span-7 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 border border-emerald-400/40 p-4 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 mb-6">
            <span>MERIDIAN QUANTUM TITANIUM</span>
            <span>GRADE-5</span>
          </div>
          <div className="font-mono text-sm tracking-widest text-white/90 mb-3">
            4829 •••• •••• 9014
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/55">
            <span>TREASURY EXEC</span>
            <span>ZERO-LATENCY RAIL</span>
          </div>
        </div>

        {/* Odometer Metrics */}
        <div className="col-span-5 space-y-2.5">
          <div className="rounded-xl bg-white/[0.04] border border-emerald-500/25 p-3">
            <div className="text-[10px] font-mono text-white/45">SETTLEMENT SPEED</div>
            <div className="font-display font-bold text-xl text-emerald-400">38ms finality</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
            <div className="text-[10px] font-mono text-white/45">CORRIDORS</div>
            <div className="font-display font-bold text-base text-white">TYO → LDN → NYC</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-white/55">
        <span>APPLE-STYLE SCROLL-DOCKING 3D CARD</span>
        <span className="text-emerald-400">LIVE BEZIER FX ARCS</span>
      </div>
    </div>
  );
}

function ProjectStageCard({ project, index, onOpenTheater, onActiveChange }) {
  const [embedLive, setEmbedLive] = useState(false);
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Smooth GPU-composited scroll entry/exit choreography
  const y = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [60, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.94, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.15, 1, 1, 0.2]);

  useEffect(() => {
    const el = cardRef.current;
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
    <div
      id={`project-${project.id}`}
      ref={cardRef}
      className="py-12 sm:py-16 scroll-mt-20"
    >
      <motion.article
        style={{ y, scale, opacity }}
        className="rounded-[32px] bg-[#101116] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-[0_35px_100px_rgba(0,0,0,0.75)] relative overflow-hidden will-change-transform"
      >
        {/* Top Browser Window Chrome Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <span
              className="ml-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-black"
              style={{ backgroundColor: project.accent }}
            >
              WORK {project.number} / 04
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-white/55">
              {project.category}
            </span>
          </div>

          {/* Interactive Stage Mode Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEmbedLive((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
                embedLive
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#070709] text-white/75 border-white/15 hover:border-white/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{embedLive ? 'Showing Live Iframe' : 'Embed Live Site Here'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenTheater(project)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-black transition-transform active:scale-95"
              style={{ backgroundColor: project.accent }}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Fullscreen Live Theater</span>
            </button>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-white transition-colors"
            >
              <span>{project.liveUrl.replace('http://', '')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main 12-Column Project Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left 5 Columns: Narrative, Unique Motion Identity & Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                {project.title}
              </h3>
              <p
                className="font-serif italic text-xl sm:text-2xl mt-1"
                style={{ color: project.accent }}
              >
                {project.subtitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {project.summary}
            </p>

            {/* Bespoke Motion Identity Badge */}
            <div className="rounded-2xl bg-[#070709] border border-white/10 p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/45 mb-1">
                <Sparkles className="w-3.5 h-3.5" style={{ color: project.accent }} />
                <span>Bespoke Motion &amp; Scroll Identity</span>
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-white">
                {project.motionIdentity}
              </div>
            </div>

            {/* Key Engineering Highlights */}
            <ul className="space-y-2.5">
              {project.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: project.accent }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Metrics & Stack */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-[#070709] border border-white/10 p-3"
                >
                  <div className="text-[10px] font-mono uppercase text-white/45">{m.label}</div>
                  <div
                    className="font-display font-bold text-base sm:text-lg mt-0.5"
                    style={{ color: project.accent }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right 7 Columns: Interactive Stage Viewport (Artwork OR Live Embedded Iframe!) */}
          <div className="lg:col-span-7">
            <div className="relative h-[380px] sm:h-[460px] rounded-2xl bg-[#070709] border border-white/15 overflow-hidden shadow-2xl group">
              {embedLive ? (
                <iframe
                  src={project.liveUrl}
                  title={project.title}
                  className="w-full h-full border-0 bg-black"
                />
              ) : (
                <div
                  onClick={() => onOpenTheater(project)}
                  className="w-full h-full cursor-pointer"
                >
                  <ProjectStageArtwork project={project} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-black font-display font-bold text-sm shadow-2xl"
                      style={{ backgroundColor: project.accent }}
                    >
                      <MonitorPlay className="w-4 h-4" />
                      <span>Click to Interact With Live Website</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function WorkStageShowcase({ onOpenTheater, onActiveChange }) {
  return (
    <section id="work" className="relative py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-sky-400 block mb-3">
            // Selected Production Works (01 — 04)
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white">
            Four distinct worlds.
            <br />
            <span className="font-serif italic font-normal text-white/75">
              Zero shared templates.
            </span>
          </h2>
        </div>
        <p className="text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
          Every project below is running live on its own local port (`5174`–`5177`). Click{' '}
          <strong className="text-white">Fullscreen Live Theater</strong> or{' '}
          <strong className="text-white">Embed Live Site Here</strong> on any card to interact with
          the full application directly.
        </p>
      </div>

      <div>
        {PORTFOLIO_PROJECTS.map((project, idx) => (
          <ProjectStageCard
            key={project.id}
            project={project}
            index={idx}
            onOpenTheater={onOpenTheater}
            onActiveChange={onActiveChange}
          />
        ))}
      </div>
    </section>
  );
}
