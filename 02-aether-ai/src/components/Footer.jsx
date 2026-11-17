import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="border-t border-[#27272A] bg-[#09090B] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold tracking-tight text-[#FAFAFA]">
                aether<span className="text-cyan-400">.</span>
              </span>
              <span className="rounded-full border border-[#27272A] bg-[#111115] px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                99.99% Uptime
              </span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Real-time observability, semantic caching, and multi-model routing for production AI teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <a href="#telemetry" className="transition-colors hover:text-white">
              Telemetry
            </a>
            <a href="#platform" className="transition-colors hover:text-white">
              Platform
            </a>
            <a href="#sdk" className="transition-colors hover:text-white">
              SDK
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-1 font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <span>Request Sandbox Key</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#27272A]/80 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aether Systems Inc. (aether.dev). All rights reserved.</p>
          <p className="font-mono">Built for sub-10ms edge inference.</p>
        </div>
      </div>
    </footer>
  );
}
