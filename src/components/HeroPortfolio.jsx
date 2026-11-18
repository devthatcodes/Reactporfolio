import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, MonitorPlay, ArrowDownRight, Sparkles } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

export default function HeroPortfolio({
  onOpenTheater,
  onNavigate,
  onHoverProject,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Signature Deontae Work Hero Scroll Choreography:
  // As you scroll down, "DEONTAE" and "WORK" part horizontally like architectural stage curtains
  // while the interactive work index rises and scales smoothly.
  const firstNameX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const lastNameX = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.12]);
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, -55]);

  const activeProj = PORTFOLIO_PROJECTS[hoveredIdx] || PORTFOLIO_PROJECTS[0];

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Top Architectural Status Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65">
            DEONTAE WORK — PORTFOLIO EDITION 2026
          </span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">
          <span>ROLE: FRONT END ENGINEER</span>
          <span className="hidden sm:inline">FOCUS: UI ARCHITECTURE &amp; 60FPS MOTION</span>
        </div>
      </div>

      {/* Center Oversized Editorial + Kinetic Stage */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="my-auto py-10 sm:py-14 will-change-transform"
      >
        {/* Giant Split-Curtain Name Display */}
        <div className="mb-10 select-none">
          <motion.div
            style={{ x: firstNameX }}
            className="flex flex-wrap items-baseline justify-between gap-4 will-change-transform"
          >
            <h1 className="font-display font-extrabold text-5xl sm:text-8xl lg:text-[116px] leading-[0.92] tracking-[-0.04em] text-[#F5F4F0] uppercase">
              Deontae
            </h1>
            <span className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-[#E2D9C8]/85">
              Front End Engineer
            </span>
          </motion.div>

          <motion.div
            style={{ x: lastNameX }}
            className="flex flex-wrap items-baseline justify-between gap-4 mt-1 sm:mt-2 will-change-transform"
          >
            <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.26em] text-white/50 max-w-xs">
              // INTERACTIVE SYSTEMS, DESIGN ENGINEERING &amp; CREATIVE TECH
            </span>
            <div className="font-display font-extrabold text-5xl sm:text-8xl lg:text-[116px] leading-[0.92] tracking-[-0.04em] uppercase flex items-baseline gap-3">
              <span className="font-serif italic font-normal text-white/70 lowercase">
                &amp;
              </span>
              <span style={{ color: activeProj.accent }} className="transition-colors duration-500">
                Work.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Lower Hero Grid: Editorial Bio + Interactive 4-Work Preview Selector */}
        <motion.div
          style={{ y: showcaseY }}
          className="grid lg:grid-cols-12 gap-10 items-end pt-6 border-t border-white/10 will-change-transform"
        >
          {/* Left 5 Cols: Statement & Primary Actions */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              I&apos;m <strong className="text-white font-semibold">Deontae Work</strong>, a Front
              End Engineer specializing in high-craft React architectures, tactile scroll
              choreography, and sub-second web applications that bridge design precision with
              production engineering.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                data-cursor="SCROLL WORKS"
                onClick={() => {
                  soundEngine.playClick();
                  onNavigate('#work', 'Selected Works', 'EXHIBITION 01 — 04');
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#F5F4F0] text-[#060608] font-display font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#E2D9C8] transition-colors"
              >
                <span>Explore Selected Works</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                data-cursor="LAUNCH THEATER"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenTheater(activeProj);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#0D0E12] border border-white/15 text-xs font-mono uppercase tracking-[0.16em] text-white hover:border-white/40 transition-colors"
              >
                <MonitorPlay className="w-3.5 h-3.5" style={{ color: activeProj.accent }} />
                <span>Live Site Theater</span>
              </button>
            </div>
          </div>

          {/* Right 7 Cols: Horizontal Accordion / Spatial Strip of the 4 Live Portfolio Websites */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 mb-3">
              <span>// FEATURED LIVE PRODUCTION BUILDS (HOVER TO EXPAND)</span>
              <span style={{ color: activeProj.accent }}>
                ACTIVE: {activeProj.number} / 04
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {PORTFOLIO_PROJECTS.map((proj, idx) => {
                const isActive = hoveredIdx === idx;
                return (
                  <motion.div
                    key={proj.id}
                    layout
                    data-cursor={`INSPECT ${proj.number}`}
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      soundEngine.playHover();
                      if (onHoverProject) onHoverProject(proj);
                    }}
                    onClick={() => {
                      soundEngine.playClick();
                      onNavigate(`#project-${proj.id}`, proj.title, `WORK ${proj.number}`);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-colors min-h-[148px] ${
                      isActive
                        ? 'bg-[#12141C] border-white/30 sm:col-span-2'
                        : 'bg-[#0B0C10]/85 border-white/10 hover:border-white/20 sm:col-span-1'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: proj.accent }}
                      >
                        {proj.number}
                      </span>
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/45 hover:text-white transition-colors"
                        title={`Open ${proj.title}`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="mt-4">
                      <div className="font-display font-bold text-base text-white leading-snug">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                        {proj.category}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/70"
                        >
                          <span className="truncate">{proj.motionIdentity.split('&')[0]}</span>
                          <span
                            className="underline shrink-0 ml-2"
                            style={{ color: proj.accent }}
                          >
                            VIEW →
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
