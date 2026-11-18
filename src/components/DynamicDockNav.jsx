import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers, Sparkles, MonitorPlay } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';

export default function DynamicDockNav({
  activeProject,
  onSelectProject,
  onOpenTheater,
  onScrollTo,
}) {
  const accent = activeProject?.accent || '#38BDF8';

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 pointer-events-none flex justify-center">
      <motion.div
        layout
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-[#101116]/95 border border-white/10 rounded-full px-3 sm:px-4 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
      >
        {/* Developer Brand Pill */}
        <button
          type="button"
          onClick={() => onScrollTo('#top')}
          className="flex items-center gap-2.5 pr-2 sm:pr-3 border-r border-white/10 text-left group"
        >
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
          />
          <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-white">
            DEV<span className="font-serif italic font-normal text-white/70">.folio</span>
          </span>
        </button>

        {/* 4 Portfolio Project Quick-Jump Pills */}
        <nav className="hidden md:flex items-center gap-1">
          {PORTFOLIO_PROJECTS.map((proj) => {
            const isActive = activeProject?.id === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  onSelectProject(proj);
                  onScrollTo(`#project-${proj.id}`);
                }}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive ? 'text-black font-semibold' : 'text-white/65 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dockActivePill"
                    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: proj.accent }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] opacity-75">{proj.number}</span>
                  <span>{proj.title}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Links */}
        <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-white/10">
          <button
            type="button"
            onClick={() => onScrollTo('#engineering-lab')}
            className="px-3 py-1.5 rounded-full text-xs text-white/65 hover:text-white transition-colors"
          >
            Craft &amp; Stack
          </button>
          <button
            type="button"
            onClick={() => onScrollTo('#contact')}
            className="px-3 py-1.5 rounded-full text-xs text-white/65 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Live Theater Button */}
        <button
          type="button"
          onClick={() => onOpenTheater(activeProject || PORTFOLIO_PROJECTS[0])}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-black transition-transform active:scale-95"
          style={{ backgroundColor: accent }}
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Live Theater</span>
        </button>
      </motion.div>
    </header>
  );
}
