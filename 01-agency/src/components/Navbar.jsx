import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const NAV_LINKS = [
  { label: 'Work Stream', href: '#work', shader: 1 },
  { label: 'Capabilities', href: '#services', shader: 0 },
  { label: 'Process', href: '#process', shader: 2 },
  { label: 'Estimator', href: '#estimator', shader: 0 },
];

export default function Navbar({
  onOpenInquiry,
  onTriggerPortal,
  onSelectShader,
  soundEnabled,
  onToggleSound,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    soundEngine.playTransition();

    if (onSelectShader && typeof item.shader === 'number') {
      onSelectShader(item.shader);
    }

    if (onTriggerPortal) {
      onTriggerPortal({
        label: item.label,
        sublabel: `PORTAL NAVIGATION // ${item.href.toUpperCase()}`,
        accent: '#C8FF32',
      });
    }

    setTimeout(() => {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 220);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-obsidian/80 backdrop-blur-xl border-b border-ivory/10 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#top"
          data-cursor="HOME PORTAL"
          onClick={(e) => handleLinkClick(e, { label: 'Vespera Studio', href: '#top', shader: 0 })}
          onMouseEnter={() => soundEngine.playHover()}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-lg bg-surface border border-ivory/15 flex items-center justify-center overflow-hidden group-hover:border-lime/60 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-lime transition-transform duration-300 group-hover:scale-110"
            >
              <path
                d="M4 5L12 19L20 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5L12 10.5L15 5"
                stroke="#F5F2EB"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-ivory">
              <ScrambleText text="Vespera" scrambleOnMount={false} />
              <span className="text-lime">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-ivory/50 hidden sm:block">
              WEBGL &amp; PRODUCT LAB
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/75 border border-ivory/10 rounded-full px-2 py-1.5 backdrop-blur-md">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor={`PORTAL: ${item.label.toUpperCase()}`}
              onClick={(e) => handleLinkClick(e, item)}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-ivory/75 hover:text-lime rounded-full hover:bg-ivory/5 transition-colors"
            >
              <ScrambleText text={item.label} scrambleOnMount={false} />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Audio Synth Pill (Mobile & Desktop) */}
          <button
            type="button"
            data-cursor={soundEnabled ? 'MUTE AUDIO' : 'ENABLE AUDIO'}
            onClick={onToggleSound}
            onMouseEnter={() => soundEngine.playHover()}
            aria-label="Toggle Sound"
            className={`p-2.5 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-surface/90 border-lime/40 text-lime'
                : 'bg-surface/60 border-ivory/15 text-ivory/50 hover:text-ivory'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            data-cursor="INITIATE BRIEF"
            onClick={() => {
              soundEngine.playClick();
              onOpenInquiry();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime text-obsidian font-display font-semibold text-xs uppercase tracking-wider hover:bg-ivory transition-colors shadow-[0_0_24px_rgba(200,255,50,0.25)]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-lg bg-surface border border-ivory/10 text-ivory hover:border-lime/50 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-b border-ivory/10"
          >
            <div className="px-5 py-6 flex flex-col gap-3">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item)}
                  className="py-2.5 px-3 rounded-lg text-sm font-mono uppercase tracking-wider text-ivory/85 hover:text-lime hover:bg-ivory/5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenInquiry();
                }}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-lime text-obsidian font-display font-semibold text-sm"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
