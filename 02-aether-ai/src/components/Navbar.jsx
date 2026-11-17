import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onOpenModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const navLinks = [
    { label: 'Telemetry', href: '#telemetry' },
    { label: 'Platform', href: '#platform' },
    { label: 'SDK', href: '#sdk' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272A]/80 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Status Pill */}
        <div className="flex items-center gap-4">
          <a href="#" className="group flex items-center gap-2.5 focus:outline-none">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] bg-[#111115] shadow-inner transition-colors group-hover:border-cyan-400/50">
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
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setStatusOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-[#27272A] bg-[#111115]/90 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-tight">
                All Systems Operational • 99.99%
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

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-[#FAFAFA]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#sdk"
            className="hidden items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-flex"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span>Docs</span>
          </a>

          <button
            type="button"
            onClick={onOpenModal}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-[#FAFAFA] px-3.5 py-2 text-xs font-semibold text-[#09090B] transition-all hover:bg-white sm:text-sm"
          >
            <span>Get API Key</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272A] bg-[#111115] text-zinc-300 md:hidden"
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
            className="overflow-hidden border-t border-[#27272A] bg-[#09090B] md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#111115] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs text-zinc-300">All Systems Operational • 99.99%</span>
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-[#111115] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
