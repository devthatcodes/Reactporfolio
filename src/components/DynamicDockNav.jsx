import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

export default function DynamicDockNav({
  activeProject,
  onSelectProject,
  onOpenTheater,
  onNavigate,
  soundEnabled,
  onToggleSound,
}) {
  const accent = activeProject?.accent || '#E2D9C8';

  return (
    <header className="fixed top-5 inset-x-0 z-50 px-5 sm:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Deontae Work Signature Monogram & Identity */}
        <motion.button
          type="button"
          data-cursor="TOP"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            soundEngine.playClick();
            onNavigate('#top', 'Deontae Work', 'PORTFOLIO INDEX');
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="pointer-events-auto flex items-center gap-3 bg-[#0D0E12]/90 border border-white/10 rounded-full pl-2 pr-4 py-1.5 shadow-2xl group hover:border-white/25 transition-colors"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-xs text-[#060608] transition-colors duration-500"
            style={{ backgroundColor: accent }}
          >
            DW
          </span>
          <div className="text-left leading-tight">
            <div className="font-display font-bold text-xs sm:text-sm text-[#F5F4F0] tracking-tight">
              Deontae Work
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
              Front End Engineer
            </div>
          </div>
        </motion.button>

        {/* Center: Floating Project & Section Dock */}
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto hidden lg:flex items-center gap-1 bg-[#0D0E12]/90 border border-white/10 rounded-full p-1.5 shadow-2xl"
        >
          {PORTFOLIO_PROJECTS.map((proj) => {
            const isActive = activeProject?.id === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                data-cursor={`WORK ${proj.number}`}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectProject(proj);
                  onNavigate(`#project-${proj.id}`, proj.title, `SELECTED WORK ${proj.number}`);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`relative px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                  isActive ? 'text-[#060608] font-semibold' : 'text-white/60 hover:text-white'
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
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] opacity-75">{proj.number}</span>
                  <span>{proj.title}</span>
                </span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            data-cursor="ENGINEERING"
            onClick={() => {
              soundEngine.playClick();
              onNavigate('#engineering-lab', 'Engineering Craft', 'ARCHITECTURE & MOTION');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="px-3.5 py-1.5 rounded-full text-xs text-white/60 hover:text-white transition-colors"
          >
            Craft
          </button>
          <button
            type="button"
            data-cursor="CONTACT"
            onClick={() => {
              soundEngine.playClick();
              onNavigate('#contact', 'Initiate Dialogue', 'CONTACT DEONTAE');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="px-3.5 py-1.5 rounded-full text-xs text-white/60 hover:text-white transition-colors"
          >
            Contact
          </button>
        </motion.nav>

        {/* Right: Sound Toggle & Live Theater CTA */}
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center gap-2"
        >
          <button
            type="button"
            data-cursor={soundEnabled ? 'MUTE UI' : 'SOUND ON'}
            onClick={onToggleSound}
            onMouseEnter={() => soundEngine.playHover()}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-[#0D0E12]/90 border border-white/10 flex items-center justify-center text-white/65 hover:text-white hover:border-white/25 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            data-cursor="LIVE THEATER"
            onClick={() => {
              soundEngine.playClick();
              onOpenTheater(activeProject || PORTFOLIO_PROJECTS[0]);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#060608] transition-transform active:scale-95 shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Interactive Theater</span>
          </button>
        </motion.div>
      </div>
    </header>
  );
}
