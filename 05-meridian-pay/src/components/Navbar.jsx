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
} from 'lucide-react';

const PLATFORM_ITEMS = [
  {
    title: 'Multi-Currency FX',
    desc: 'Hold & convert 140+ currencies at 0.15% spread',
    href: '#fx-calculator',
    icon: Globe2,
    accent: 'text-[#10B981] bg-[#10B981]/10',
  },
  {
    title: 'Corporate Cards',
    desc: 'Issue virtual & metal cards with live spend rules',
    href: '#cards',
    icon: CreditCard,
    accent: 'text-[#2563EB] bg-[#2563EB]/10',
  },
  {
    title: 'Treasury & Payouts',
    desc: 'Automated global vendor payouts & 4.85% APY yield',
    href: '#workflows',
    icon: Layers,
    accent: 'text-[#0F172A] bg-slate-100',
  },
  {
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II, ISO 27001 & PCI-DSS Level 1',
    href: '#security',
    icon: ShieldCheck,
    accent: 'text-[#10B981] bg-[#10B981]/10',
  },
];

export default function Navbar({ onOpenSignIn, onOpenAccount }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center shadow-sm group-hover:bg-[#1E293B] transition-colors">
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
          <span className="text-[17px] font-bold tracking-tight text-[#0F172A]">
            Meridian
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 py-2 text-slate-600 hover:text-[#0F172A] transition-colors"
            >
              <span>Platform</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#2563EB]' : ''
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
                  className="absolute left-0 mt-2 w-[440px] rounded-2xl bg-white border border-slate-200 shadow-card-elevated p-3 grid grid-cols-1 gap-1"
                >
                  {PLATFORM_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.accent}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#cards" className="hover:text-[#0F172A] transition-colors">
            Cards
          </a>
          <a href="#workflows" className="hover:text-[#0F172A] transition-colors">
            Workflows
          </a>
          <a href="#security" className="hover:text-[#0F172A] transition-colors">
            Security
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-[#0F172A] rounded-lg hover:bg-slate-100/80 transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onOpenAccount('account')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Open Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {PLATFORM_ITEMS.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                >
                  {item.title}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full py-2.5 text-sm font-medium text-[#0F172A] border border-slate-200 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAccount('account');
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg"
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
