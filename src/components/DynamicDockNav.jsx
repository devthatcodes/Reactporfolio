import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Sparkles, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

export default function DynamicDockNav({
  activeProject,
  onSelectProject,
  onOpenTheater,
  onOpenInquiry,
  onScrollTo,
}) {
  const accent = activeProject?.accent || '#E2D9C8';

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Deontae Word Identity */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onScrollTo('#top');
          }}
          className="pointer-events-auto flex items-center gap-3 bg-[#0D0E12]/95 border border-white/10 rounded-full pl-2 pr-4 py-1.5 shadow-xl hover:border-white/25 transition-colors"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-xs text-[#060608] transition-colors duration-500"
            style={{ backgroundColor: accent }}
          >
            DW
          </span>
          <div className="text-left leading-tight">
            <div className="font-display font-bold text-xs sm:text-sm text-[#F5F4F0] tracking-tight">
              Deontae Word
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50">
              Front End Engineer
            </div>
          </div>
        </button>

        {/* Center Navigation Dock */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 bg-[#0D0E12]/95 border border-white/10 rounded-full p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => onScrollTo('#work')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/75 hover:text-white transition-colors"
          >
            Selected Work
          </button>

          {PORTFOLIO_PROJECTS.map((proj) => {
            const isActive = activeProject?.id === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onSelectProject(proj);
                  onScrollTo(`#project-${proj.id}`);
                }}
                className={`relative px-3 py-1.5 rounded-full text-xs transition-colors ${
                  isActive ? 'text-[#060608] font-semibold' : 'text-white/55 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="deontaeDockActive"
                    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: proj.accent }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className="font-mono text-[10px] opacity-75">{proj.number}</span>
                  <span>{proj.title}</span>
                </span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            onClick={() => onScrollTo('#engineering-lab')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/75 hover:text-white transition-colors"
          >
            Services &amp; Pricing
          </button>
          <button
            type="button"
            onClick={() => onScrollTo('#contact')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/75 hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right: Clear Client Inquiry CTA + Live Preview */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenTheater(activeProject || PORTFOLIO_PROJECTS[0]);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0D0E12]/95 border border-white/15 text-xs font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
          >
            <MonitorPlay className="w-3.5 h-3.5" style={{ color: accent }} />
            <span>Live Demo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenInquiry();
            }}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#E2D9C8] hover:bg-white text-[#060608] font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <span>Get Your Website Built</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
