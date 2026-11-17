import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const STUDIOS = [
  { city: 'San Francisco', address: '548 Market St, Suite 410', tz: 'PST · UTC-8' },
  { city: 'London', address: '18 Finsbury Square, EC2A', tz: 'GMT · UTC+0' },
  { city: 'Tokyo', address: 'Shibuya Scramble Sq, 19F', tz: 'JST · UTC+9' },
];

export default function Footer({ onOpenInquiry }) {
  return (
    <footer className="border-t border-ivory/10 bg-surface/40 pt-16 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 pb-14 border-b border-ivory/10">
          {/* Brand Summary */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-display font-bold text-2xl tracking-tight text-ivory">
                Vespera<span className="text-lime">.</span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-obsidian border border-ivory/10 text-ivory/60">
                Digital Studio
              </span>
            </div>
            <p className="text-sm text-ivory/65 max-w-sm leading-relaxed mb-6">
              Digital Product &amp; Web Engineering Studio crafting resilient software, design
              systems, and kinetic web experiences.
            </p>
            <button
              type="button"
              onClick={() => onOpenInquiry()}
              className="inline-flex items-center gap-2 text-sm font-display font-semibold text-lime hover:text-ivory transition-colors"
            >
              Book a Q1 2027 Discovery Call
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Studio Locations */}
          <div className="md:col-span-7 grid sm:grid-cols-3 gap-6">
            {STUDIOS.map((studio) => (
              <div key={studio.city}>
                <div className="font-display font-semibold text-sm text-ivory mb-1.5">
                  {studio.city}
                </div>
                <div className="text-xs text-ivory/55 leading-relaxed mb-2">
                  {studio.address}
                </div>
                <div className="text-[11px] font-mono text-lime/80">{studio.tz}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/45">
          <div>© {new Date().getFullYear()} Vespera Digital LLC. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#services" className="hover:text-ivory transition-colors">
              Capabilities
            </a>
            <a href="#work" className="hover:text-ivory transition-colors">
              Outcomes
            </a>
            <a href="#process" className="hover:text-ivory transition-colors">
              Process
            </a>
            <a href="#estimator" className="hover:text-ivory transition-colors">
              Estimator
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
