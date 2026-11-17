import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
  {
    name: 'Vanguard',
    svg: (
      <svg viewBox="0 0 140 28" className="h-6 w-auto" fill="none" aria-label="Vanguard">
        <path d="M4 6L12 22L20 6H16.2L12 15.2L7.8 6H4Z" fill="currentColor" />
        <text x="27" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="14" letterSpacing="0.06em">
          VANGUARD
        </text>
      </svg>
    ),
  },
  {
    name: 'Synthetix',
    svg: (
      <svg viewBox="0 0 146 28" className="h-6 w-auto" fill="none" aria-label="Synthetix">
        <rect x="4" y="6" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="13" y="15" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.6" />
        <rect x="13" y="6" width="7" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.75" />
        <text x="28" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="14" letterSpacing="0.06em">
          SYNTHETIX
        </text>
      </svg>
    ),
  },
  {
    name: 'Orbital',
    svg: (
      <svg viewBox="0 0 130 28" className="h-6 w-auto" fill="none" aria-label="Orbital">
        <circle cx="13" cy="14" r="7.5" stroke="currentColor" strokeWidth="1.75" />
        <ellipse cx="13" cy="14" rx="11" ry="3.5" transform="rotate(-25 13 14)" stroke="currentColor" strokeWidth="1.5" />
        <text x="30" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="14" letterSpacing="0.08em">
          ORBITAL
        </text>
      </svg>
    ),
  },
  {
    name: 'Nexus',
    svg: (
      <svg viewBox="0 0 120 28" className="h-6 w-auto" fill="none" aria-label="Nexus">
        <path d="M5 21V7L13 17V7M13 17L21 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="29" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="14" letterSpacing="0.08em">
          NEXUS
        </text>
      </svg>
    ),
  },
  {
    name: 'Hyperion',
    svg: (
      <svg viewBox="0 0 142 28" className="h-6 w-auto" fill="none" aria-label="Hyperion">
        <polygon points="13,4 21,14 13,24 5,14" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="13" cy="14" r="2.5" fill="currentColor" />
        <text x="29" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="14" letterSpacing="0.07em">
          HYPERION
        </text>
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-[#27272A]/80 bg-[#09090B] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-7 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Powering 4.2B+ monthly inference requests across engineering teams
        </p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="text-zinc-500 transition-colors duration-200 hover:text-zinc-200"
            >
              {logo.svg}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
