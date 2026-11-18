import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine, playHover, playClick, toggleMute } from '../utils/soundEngine';

export default function Navbar({
  onOpenModal,
  onNavigatePortal,
  activeSection = 'telemetry',
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [muted, setMuted] = useState(soundEngine.isMuted());

  useEffect(() => {
    return soundEngine.subscribe((val) => setMuted(val));
  }, []);

  const navLinks = [
    { id: 'telemetry', code: '01', label: 'NEURAL STREAM', href: '#telemetry' },
    { id: 'reel', code: '02', label: 'ARCHITECTURE REEL', href: '#reel' },
    { id: 'platform', code: '03', label: 'CORE BENTO', href: '#platform' },
    { id: 'sdk', code: '04', label: 'LIVE SANDBOX', href: '#sdk' },
    { id: 'pricing', code: '05', label: 'COMPUTE PRICING', href: '#pricing' },
  ];

  const handleNavClick = (e, link) => {
    e.preventDefault();
    playClick();
    setMobileOpen(false);
    if (onNavigatePortal) {
      onNavigatePortal(link);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#27272A]/80 bg-[#09090B]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Status Pill */}
        <div className="flex items-center gap-4">
          <a
            href="#telemetry"
            onClick={(e) => handleNavClick(e, navLinks[0])}
            onMouseEnter={playHover}
            data-cursor="[ HOME PORTAL ]"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] bg-[#111115] shadow-inner transition-colors group-hover:border-cyan-400/60">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="aether-logo-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22D3EE" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                  stroke="url(#aether-logo-grad)"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6.5L16.5 14.5H7.5L12 6.5Z"
                  fill="url(#aether-logo-grad)"
                  fillOpacity="0.25"
                  stroke="url(#aether-logo-grad)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#FAFAFA]">
              aether<span className="text-cyan-400">.</span>
            </span>
          </a>

          {/* Status Pill */}
          <div className="relative hidden xl:block">
            <button
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setStatusOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-full border border-[#27272A] bg-[#111115]/90 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-white"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] tracking-wider">
                SYS.ONLINE • 99.99%
              </span>
            </button>

            <AnimatePresence>
              {statusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 mt-2 w-72 rounded-xl border border-[#27272A] bg-[#111115] p-3.5 shadow-2xl"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">Edge Gateway Health</span>
                    <span className="font-mono text-[10px] text-emerald-400">30d Uptime: 99.994%</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { region: 'us-east-1 (Virginia)', latency: '11ms' },
                      { region: 'eu-central-1 (Frankfurt)', latency: '14ms' },
                      { region: 'ap-northeast-1 (Tokyo)', latency: '19ms' },
                    ].map((node) => (
                      <div
                        key={node.region}
                        className="flex items-center justify-between rounded-lg bg-[#09090B] px-2.5 py-1.5 border border-[#27272A]/60"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span className="text-zinc-300">{node.region}</span>
                        </div>
                        <span className="font-mono text-[11px] text-cyan-400">{node.latency}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Desktop Cybernetic Nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onMouseEnter={playHover}
                onClick={(e) => handleNavClick(e, link)}
                data-cursor={`[ ${link.code} // ${link.label} ]`}
                className={`group flex items-center gap-1.5 font-mono text-[11px] tracking-wider transition-colors ${
                  isActive ? 'text-cyan-300' : 'text-zinc-400 hover:text-[#FAFAFA]'
                }`}
              >
                <span className="text-[10px] text-cyan-400/70">{link.code}//</span>
                <ScrambleText
                  text={link.label}
                  scrambleOnMount={false}
                  speed={18}
                  step={0.7}
                />
              </a>
            );
          })}
        </nav>

        {/* Right: Audio Synth Equalizer + Actions */}
        <div className="flex items-center gap-2.5">
          {/* Procedural Sound Toggle + Equalizer */}
          <button
            type="button"
            onMouseEnter={playHover}
            onClick={() => toggleMute()}
            data-cursor={muted ? '[ UNMUTE SYNTH ]' : '[ MUTE SYNTH ]'}
            className="inline-flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#111115] px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-white"
            aria-label="Toggle procedural audio synthesizer"
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            )}
            <div className="flex h-3 items-end gap-0.5">
              {[0, 1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  animate={
                    muted
                      ? { height: '3px' }
                      : { height: ['3px', '11px', '5px', '10px', '3px'] }
                  }
                  transition={{
                    duration: 0.9 + bar * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`w-0.5 rounded-full ${
                    muted ? 'bg-zinc-600' : 'bg-cyan-400'
                  }`}
                />
              ))}
            </div>
            <span className="hidden sm:inline">
              {muted ? 'SOUND [OFF]' : 'SOUND [ON]'}
            </span>
          </button>

          <button
            type="button"
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              onOpenModal();
            }}
            data-cursor="[ PROVISION KEY ]"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-[#FAFAFA] px-3.5 py-2 text-xs font-semibold text-[#09090B] transition-all hover:bg-cyan-300"
          >
            <span>Get API Key</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setMobileOpen((prev) => !prev);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272A] bg-[#111115] text-zinc-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#27272A] bg-[#09090B] lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-zinc-300 hover:bg-[#111115] hover:text-cyan-300"
                >
                  <span>
                    {link.code} // {link.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
