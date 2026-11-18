import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, MonitorPlay, Sparkles, Code2, Layers, Compass } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';

export default function HeroPortfolio({
  onOpenTheater,
  onScrollTo,
  onHoverProject,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Unique Portfolio Scroll Transition:
  // As you scroll down from the hero, the 4 stacked site cards fan out horizontally and zoom slightly
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.12]);
  const deckY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const deckScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.05, 0.95]);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-16 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      <div className="my-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Editorial & Kinetic Column */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="lg:col-span-7 will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#101116] border border-white/10 mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/80">
              Selected Works Exhibition · 4 Flagship Builds Live
            </span>
          </motion.div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-[68px] leading-[1.02] tracking-[-0.03em] text-white mb-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                 interactive web
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="block font-serif italic font-normal text-5xl sm:text-7xl lg:text-[78px] text-sky-300"
              >
                architecture &amp; motion
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                engineered to perform.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-9"
          >
            I design and engineer production-grade web applications where **bespoke visual
            identities**, **60fps scroll choreography**, and **resilient full-stack architecture**
            converge. Explore four distinct flagship platforms below—each running live with its own
            unique motion language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => onScrollTo('#work')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black font-display font-bold text-sm hover:bg-sky-300 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All 4 Websites</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenTheater(PORTFOLIO_PROJECTS[hoveredIdx])}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#101116] border border-white/15 text-white font-medium text-sm hover:border-white/40 transition-colors"
            >
              <MonitorPlay className="w-4 h-4 text-sky-400" />
              <span>Launch Live Interactive Theater</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: Interactive 4-Site Spatial Deck Selector */}
        <motion.div
          style={{ y: deckY, scale: deckScale }}
          className="lg:col-span-5 will-change-transform"
        >
          <div className="rounded-3xl bg-[#101116] border border-white/10 p-5 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/55">
                // LIVE PORTFOLIO INDEX (01 — 04)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                4 SERVERS ONLINE
              </span>
            </div>

            <div className="space-y-2.5">
              {PORTFOLIO_PROJECTS.map((proj, idx) => {
                const active = hoveredIdx === idx;
                return (
                  <motion.div
                    key={proj.id}
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      if (onHoverProject) onHoverProject(proj);
                    }}
                    onClick={() => onScrollTo(`#project-${proj.id}`)}
                    animate={{
                      x: active ? 6 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                      active
                        ? 'bg-white/[0.06] border-white/25'
                        : 'bg-[#070709]/70 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold text-black shrink-0"
                          style={{ backgroundColor: proj.accent }}
                        >
                          {proj.number}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-base text-white truncate">
                              {proj.title}
                            </h3>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/60 shrink-0">
                              {proj.category.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-white/55 truncate mt-0.5">
                            {proj.motionIdentity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTheater(proj);
                          }}
                          title="Interact Live inside Portfolio"
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white text-[10px] font-mono uppercase tracking-wider text-white hover:text-black transition-colors"
                        >
                          Preview
                        </button>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open Standalone Live Site"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/45">
              <span>HOVER TO SHIFT AMBIENT PALETTE</span>
              <span>CLICK TO INSPECT</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/10">
        {[
          { label: 'Featured Platforms', value: '04 Live Sites' },
          { label: 'Motion Systems', value: '100% Bespoke' },
          { label: 'Frame Budget', value: '< 1.0ms GPU' },
          { label: 'Core Web Vitals', value: '100 / 100' },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/45">
              {item.label}
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-white mt-0.5">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
