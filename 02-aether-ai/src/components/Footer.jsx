import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playHover, playClick } from '../utils/soundEngine';

export default function Footer({ onOpenModal, onNavigatePortal }) {
  const links = [
    { id: 'telemetry', code: '01', label: 'NEURAL STREAM', href: '#telemetry' },
    { id: 'reel', code: '02', label: 'ARCHITECTURE REEL', href: '#reel' },
    { id: 'platform', code: '03', label: 'CORE BENTO', href: '#platform' },
    { id: 'sdk', code: '04', label: 'LIVE SANDBOX', href: '#sdk' },
    { id: 'pricing', code: '05', label: 'COMPUTE PRICING', href: '#pricing' },
  ];

  return (
    <footer className="relative z-10 border-t border-[#27272A] bg-[#09090B]/90 pb-20 pt-14 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold tracking-tight text-[#FAFAFA]">
                aether<span className="text-cyan-400">.</span>
              </span>
              <span className="rounded-full border border-[#27272A] bg-[#111115] px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                GLSL // ACTIVE THEORY EDITION
              </span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Autonomous neural compute, real-time WebGL telemetry, semantic caching, and multi-model routing for production AI teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-400">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onMouseEnter={playHover}
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  if (onNavigatePortal) onNavigatePortal(link);
                }}
                className="transition-colors hover:text-cyan-300"
              >
                {link.code} // {link.label}
              </a>
            ))}
            <button
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                onOpenModal();
              }}
              className="inline-flex items-center gap-1 font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <span>Request Sandbox Key</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#27272A]/80 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aether Systems Inc. (aether.dev). All rights reserved.</p>
          <p className="font-mono">ENGINEERED FOR SUB-10MS EDGE INFERENCE // 60FPS GLSL</p>
        </div>
      </div>
    </footer>
  );
}
