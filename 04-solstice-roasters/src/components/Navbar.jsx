import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Volume2, VolumeX, Flame } from 'lucide-react';
import soundEngine from '../utils/soundEngine';
import { ROAST_MODES } from './SensoryHud';

export function SolsticeCrest({ className = 'w-9 h-9', light = false }) {
  const strokeColor = light ? '#FBF8F3' : '#1E1612';
  const accentColor = '#C85A32';
  const sageColor = '#5E7461';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer stamp ring */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <circle cx="24" cy="24" r="18" stroke={strokeColor} strokeWidth="1" opacity="0.35" />
      {/* Rising solstice sun */}
      <circle cx="24" cy="20" r="6.5" fill={accentColor} />
      {/* Sun rays */}
      <path
        d="M24 9.5V11.5M14.5 13.5L16 15M33.5 13.5L32 15M11 21H13M35 21H37"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Mountain horizon / coffee bean curve */}
      <path
        d="M9 28.5C14.5 23.5 19.5 24 24 27C28.5 30 33.5 28.5 39 24.5"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 33.5C17 30.5 21 31 24 32.5C27 34 31.5 33.5 36 30.5"
        stroke={sageColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar({
  cartCount,
  onOpenCart,
  roastMode = 0,
  onCycleRoastMode,
  onPortalNavigate,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(soundEngine.isEnabled());

  useEffect(() => {
    return soundEngine.subscribe(setAudioEnabled);
  }, []);

  const navLinks = [
    {
      code: '01',
      label: 'Single Origins',
      href: '#origins',
      portalTitle: '01 // MICRO-LOT REEL',
      subtitle: '3D TERROIR SHOWCASE • SEASONAL HARVEST',
      viewMode: 'reel',
    },
    {
      code: '02',
      label: 'Flavor Matrix',
      href: '#origins',
      portalTitle: '02 // SENSORY FLAVOR MATRIX',
      subtitle: 'ACIDITY × SWEETNESS SPECTROGRAPHY',
      viewMode: 'matrix',
    },
    {
      code: '03',
      label: 'Brew Guide',
      href: '#brew-guide',
      portalTitle: '03 // EXTRACTION LAB',
      subtitle: 'REAL-TIME POUR TELEMETRY & RATIOS',
    },
    {
      code: '04',
      label: 'Tasting Room',
      href: '#tasting-room',
      portalTitle: '04 // TASTING ROOM',
      subtitle: 'PORTLAND SLOW BAR & CUPPING RESERVATIONS',
    },
  ];

  const handleNavClick = (e, link) => {
    if (onPortalNavigate) {
      e.preventDefault();
      soundEngine.playPortalWipe();
      onPortalNavigate({
        id: link.href.replace('#', ''),
        code: `PORTAL ${link.code}`,
        title: link.portalTitle,
        subtitle: link.subtitle,
        viewMode: link.viewMode,
      });
    }
    setMobileOpen(false);
  };

  const modeInfo = ROAST_MODES[roastMode % ROAST_MODES.length];

  return (
    <header className="sticky top-0 z-40 bg-cream/95 border-b border-espresso/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="#"
            data-cursor="HOME // TOP"
            onMouseEnter={() => soundEngine.playHover(0)}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <SolsticeCrest className="w-10 h-10" />
            </motion.div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-espresso block leading-none">
                Solstice
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-umber/70 font-medium">
                Sensory Lab // PDX
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                data-cursor={`PORTAL ${link.code}`}
                onMouseEnter={() => soundEngine.playHover(idx)}
                onClick={(e) => handleNavClick(e, link)}
                className="group text-sm font-medium text-umber hover:text-terracotta transition-colors relative py-1 flex items-center gap-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
              >
                <span className="text-[10px] font-mono text-terracotta/75 group-hover:text-terracotta">
                  {link.code}
                </span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Actions: Thermal Shader Pill + Audio Synth Equalizer + Bag */}
          <div className="flex items-center gap-2.5">
            {/* Thermal Shader Mode Quick Switcher */}
            <button
              type="button"
              data-cursor="THERMAL SHADER"
              onClick={() => {
                soundEngine.playRoastShift((roastMode + 1) % 3);
                if (onCycleRoastMode) onCycleRoastMode();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-cream-dark/90 border border-espresso/15 text-[11px] font-mono uppercase tracking-wider text-espresso hover:border-terracotta transition-colors"
              title="Switch WebGL Thermal Shader Roast Profile"
            >
              <Flame className="w-3.5 h-3.5 text-terracotta" />
              <span>{modeInfo.code.split(' ')[0]}</span>
            </button>

            {/* Web Audio API Synth Equalizer Toggle */}
            <button
              type="button"
              data-cursor="SYNTH AUDIO"
              onClick={() => soundEngine.toggle()}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[11px] font-mono uppercase tracking-wider transition-colors ${
                audioEnabled
                  ? 'bg-cream-dark/90 border-espresso/15 text-espresso hover:border-terracotta'
                  : 'bg-cream border-espresso/10 text-umber/50 hover:text-espresso'
              }`}
              aria-label="Toggle Web Audio Sensory Synthesizer"
            >
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-terracotta" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-umber/50" />
              )}
              <span className="hidden md:inline">
                AUDIO [{audioEnabled ? 'ON' : 'OFF'}]
              </span>
              {/* Live Equalizer Bars */}
              <span className="inline-flex items-end gap-0.5 h-3">
                {[0, 1, 2].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={
                      audioEnabled
                        ? { height: ['35%', '100%', '45%'] }
                        : { height: '25%' }
                    }
                    transition={{
                      duration: 0.55 + bar * 0.15,
                      repeat: audioEnabled ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    className={`w-0.5 rounded-full ${
                      audioEnabled ? 'bg-terracotta' : 'bg-umber/30'
                    }`}
                  />
                ))}
              </span>
            </button>

            {/* Shopping Bag Button */}
            <motion.button
              type="button"
              data-cursor="ROASTERY BAG"
              onClick={() => {
                soundEngine.playClick();
                onOpenCart();
              }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-espresso text-cream text-sm font-medium hover:bg-umber transition-colors shadow-sm"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-terracotta" />
              <span>Bag</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-terracotta text-cream text-xs font-bold"
                >
                  {cartCount}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-full border border-espresso/15 text-espresso hover:bg-cream-dark transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-espresso/10 bg-cream"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="py-2 px-3 rounded-lg text-base font-medium text-umber hover:bg-cream-dark hover:text-terracotta transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-terracotta">{link.code}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
