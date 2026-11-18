import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, MonitorPlay, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

export default function HeroPortfolio({
  onOpenTheater,
  onOpenInquiry,
  onScrollTo,
  onHoverProject,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Clean, smooth GPU scroll choreography that never blocks reading or clicking
  const firstNameX = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const lastNameX = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  const activeProj = PORTFOLIO_PROJECTS[hoveredIdx] || PORTFOLIO_PROJECTS[0];

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Top Availability & Client Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300 font-medium">
            Accepting New Website &amp; Front-End Projects
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenInquiry()}
          className="text-xs font-mono uppercase tracking-[0.18em] text-[#E2D9C8] hover:text-white underline transition-colors"
        >
          Request a Free Quote &amp; Proposal →
        </button>
      </div>

      {/* Center Editorial + Kinetic Stage */}
      <div className="my-auto py-8 sm:py-12">
        {/* Clean, Sophisticated Deontae Work Headline */}
        <div className="mb-8">
          <motion.div
            style={{ x: firstNameX }}
            className="flex flex-wrap items-baseline justify-between gap-4 will-change-transform"
          >
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[96px] leading-[0.95] tracking-[-0.04em] text-[#F5F4F0] uppercase">
              Deontae Work
            </h1>
            <span className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-[#E2D9C8]">
              Front End Engineer
            </span>
          </motion.div>

          <motion.div
            style={{ x: lastNameX }}
            className="mt-3 sm:mt-4 will-change-transform"
          >
            <p className="font-display font-semibold text-xl sm:text-3xl lg:text-4xl text-white/85 tracking-tight max-w-4xl leading-snug">
              I design and build{' '}
              <span
                className="font-serif italic font-normal underline decoration-1 underline-offset-8 transition-colors duration-500"
                style={{ color: activeProj.accent }}
              >
                high-converting, custom websites
              </span>{' '}
              &amp; modern web applications that make your brand unforgettable.
            </p>
          </motion.div>
        </div>

        {/* Lower Hero Grid: Clear Client CTAs + Interactive 4-Work Preview Selector */}
        <div className="grid lg:grid-cols-12 gap-10 items-end pt-6 border-t border-white/10">
          {/* Left 5 Cols: Client Value Prop & Primary Actions */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Whether you need a sleek website for your business, an interactive e-commerce
              storefront, or a full-scale SaaS interface, I handle everything from custom UI design
              and smooth animations to fast, mobile-ready deployment.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenInquiry();
                }}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-[#E2D9C8] text-[#060608] font-display font-bold text-xs sm:text-sm uppercase tracking-[0.12em] hover:bg-white transition-colors shadow-[0_0_30px_rgba(226,217,200,0.25)]"
              >
                <span>Get Your Website Built</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onScrollTo('#work');
                }}
                className="inline-flex items-center gap-2 px-5 py-4 rounded-full bg-[#0D0E12] border border-white/15 text-xs sm:text-sm font-medium text-white hover:border-white/40 transition-colors"
              >
                <span>View My Work</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Custom Design &amp; Code
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Mobile &amp; SEO Ready
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                24-Hour Quote Turnaround
              </span>
            </div>
          </div>

          {/* Right 7 Cols: Interactive 4-Site Showcase Strip */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-white/50 mb-3">
              <span>// RECENT WEBSITES BUILT BY DEONTAE (CLICK TO EXPLORE)</span>
              <span style={{ color: activeProj.accent }}>
                {activeProj.number} / 04 — {activeProj.title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {PORTFOLIO_PROJECTS.map((proj, idx) => {
                const isActive = hoveredIdx === idx;
                return (
                  <motion.div
                    key={proj.id}
                    layout
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      if (onHoverProject) onHoverProject(proj);
                    }}
                    onClick={() => {
                      soundEngine.playClick();
                      onScrollTo(`#project-${proj.id}`);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-colors min-h-[144px] ${
                      isActive
                        ? 'bg-[#12141C] border-white/30 sm:col-span-2'
                        : 'bg-[#0B0C10]/90 border-white/10 hover:border-white/20 sm:col-span-1'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: proj.accent }}
                      >
                        {proj.number}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTheater(proj);
                        }}
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                      >
                        Live Demo
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="font-display font-bold text-base text-white leading-snug">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-white/55 mt-0.5 line-clamp-1">
                        {proj.category}
                      </div>
                      {isActive && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenInquiry({
                                inspiration: `${proj.title} (${proj.category})`,
                              });
                            }}
                            className="font-medium hover:underline"
                            style={{ color: proj.accent }}
                          >
                            Build a site like this →
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
