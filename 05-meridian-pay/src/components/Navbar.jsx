import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  Globe2,
  CreditCard,
  Layers,
  ShieldCheck,
  Menu,
  X,
  Volume2,
  VolumeX,
  Cpu,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const PLATFORM_ITEMS = [
  {
    title: '01 // Multi-Currency FX Stream',
    desc: 'Hold & convert 140+ currencies at 0.01%–0.15% institutional spread',
    href: '#fx-calculator',
    sectionLabel: '01 // LIQUIDITY STREAM',
    icon: Globe2,
    accent: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30',
  },
  {
    title: '02 // Global Corridor Case Reel',
    desc: 'Interactive 3D velocity-tilted institutional settlement corridors',
    href: '#corridors',
    sectionLabel: '02 // CORRIDOR CASE REEL',
    icon: Cpu,
    accent: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30',
  },
  {
    title: '03 // Holographic Corporate Cards',
    desc: 'Issue titanium & virtual cards with <200ms spend guardrails',
    href: '#cards',
    sectionLabel: '03 // HOLOGRAPHIC METAL CARD',
    icon: CreditCard,
    accent: 'text-[#3B82F6] bg-[#3B82F6]/15 border-[#3B82F6]/30',
  },
  {
    title: '04 // Autonomous Treasury Engine',
    desc: 'Automated global vendor payouts & 4.85% U.S. T-Bill yield',
    href: '#workflows',
    sectionLabel: '04 // WORKFLOW ENGINE',
    icon: Layers,
    accent: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30',
  },
  {
    title: '05 // Zero-Knowledge Security',
    desc: 'SOC 2 Type II, ISO 27001, PCI-DSS Level 1 & FIPS 140-3 HSM',
    href: '#security',
    sectionLabel: '05 // ZK-SECURITY MESH',
    icon: ShieldCheck,
    accent: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30',
  },
];

export default function Navbar({ onOpenSignIn, onOpenAccount, onNavigatePortal }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(soundEngine.enabled);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsub = soundEngine.subscribe((state) => setAudioOn(state));
    return unsub;
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e, href, label) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMobileOpen(false);
    soundEngine.playPortal();
    if (onNavigatePortal) {
      onNavigatePortal(href, label);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#030712]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#top"
          data-cursor="HOME PORTAL"
          onClick={(e) => handleNavClick(e, '#top', '01 // LIQUIDITY STREAM')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0B1325] border border-[#10B981]/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:border-[#10B981] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 18V6L12 13L20 6V18"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-bold tracking-tight text-white">Meridian</span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest uppercase text-[#10B981] px-1.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
              QUANTUM OS
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-300">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              data-cursor="ARCHITECTURE"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playClick();
                setDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-1 py-2 text-slate-300 hover:text-white transition-colors"
            >
              <span>00 // Architecture</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#10B981]' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-0 mt-2 w-[450px] rounded-2xl bg-[#070D19]/95 backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-3 grid grid-cols-1 gap-1"
                >
                  {PLATFORM_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onMouseEnter={() => soundEngine.playHover(1.1)}
                        onClick={(e) => handleNavClick(e, item.href, item.sectionLabel)}
                        className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${item.accent}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="normal-case font-sans">
                          <div className="text-sm font-semibold text-white group-hover:text-[#10B981] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                        </div>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#corridors"
            data-cursor="CORRIDOR REEL"
            onMouseEnter={() => soundEngine.playHover(1.05)}
            onClick={(e) => handleNavClick(e, '#corridors', '02 // CORRIDOR CASE REEL')}
            className="hover:text-[#10B981] transition-colors"
          >
            02 // Corridors
          </a>
          <a
            href="#cards"
            data-cursor="3D METAL CARD"
            onMouseEnter={() => soundEngine.playHover(1.1)}
            onClick={(e) => handleNavClick(e, '#cards', '03 // HOLOGRAPHIC METAL CARD')}
            className="hover:text-[#10B981] transition-colors"
          >
            03 // Cards
          </a>
          <a
            href="#workflows"
            data-cursor="WORKFLOW OS"
            onMouseEnter={() => soundEngine.playHover(1.15)}
            onClick={(e) => handleNavClick(e, '#workflows', '04 // WORKFLOW ENGINE')}
            className="hover:text-[#10B981] transition-colors"
          >
            04 // Workflows
          </a>
          <a
            href="#security"
            data-cursor="ZK SECURITY"
            onMouseEnter={() => soundEngine.playHover(1.2)}
            onClick={(e) => handleNavClick(e, '#security', '05 // ZK-SECURITY MESH')}
            className="hover:text-[#10B981] transition-colors"
          >
            05 // Security
          </a>
        </nav>

        {/* Desktop CTAs + Web Audio Synth Toggle */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Procedural Web Audio Synth Toggle */}
          <button
            type="button"
            data-cursor={audioOn ? 'MUTE SYNTH' : 'ENABLE SYNTH'}
            onClick={() => soundEngine.toggle()}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] tracking-wider uppercase transition-all ${
              audioOn
                ? 'bg-[#10B981]/15 border-[#10B981]/50 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {audioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>AUDIO [{audioOn ? 'ON' : 'OFF'}]</span>
            {/* Animated spectrum bars */}
            <span className="flex items-end gap-0.5 h-3">
              {[0, 1, 2].map((b) => (
                <span
                  key={b}
                  className={`w-0.5 rounded-full transition-all ${
                    audioOn ? 'bg-[#10B981] animate-pulse h-3' : 'bg-slate-600 h-1'
                  }`}
                  style={{ animationDelay: `${b * 120}ms` }}
                />
              ))}
            </span>
          </button>

          <button
            type="button"
            data-cursor="SIGN IN"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onOpenSignIn();
            }}
            className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            data-cursor="OPEN ACCOUNT"
            onMouseEnter={() => soundEngine.playHover(1.2)}
            onClick={() => {
              soundEngine.playConfirm();
              onOpenAccount('account');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold text-[#030712] bg-[#10B981] hover:bg-[#34D399] rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
          >
            <span>Open Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu & Audio Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => soundEngine.toggle()}
            className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10px] ${
              audioOn
                ? 'bg-[#10B981]/15 border-[#10B981]/50 text-[#10B981]'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            AUDIO {audioOn ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#070D19]"
          >
            <div className="px-4 py-4 space-y-2">
              {PLATFORM_ITEMS.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.sectionLabel)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-mono text-slate-200 hover:bg-white/5 hover:text-[#10B981]"
                >
                  {item.title}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full py-2.5 text-xs font-mono uppercase text-white border border-white/15 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAccount('account');
                  }}
                  className="w-full py-2.5 text-xs font-mono uppercase font-bold text-[#030712] bg-[#10B981] rounded-lg"
                >
                  Open Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
