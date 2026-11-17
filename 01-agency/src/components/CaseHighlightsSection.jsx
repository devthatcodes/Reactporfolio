import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, ShieldCheck, Gauge, Layers } from 'lucide-react';

const CASES = [
  {
    id: 'kinetix',
    client: 'Kinetix Commerce',
    sector: 'Headless Retail Platform',
    metric: '+142%',
    metricLabel: 'Checkout Conversion Lift',
    summary:
      'Re-architected a monolithic storefront into a streaming edge React app with sub-100ms cart mutations and bespoke product configurator.',
    span: 'lg:col-span-7',
    icon: TrendingUp,
    accent: 'lime',
    visual: (
      <svg viewBox="0 0 340 120" className="w-full h-28 mt-4" fill="none">
        <defs>
          <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8FF32" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C8FF32" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M10 100 C 70 96, 110 82, 160 66 C 210 50, 250 28, 330 14 L 330 115 L 10 115 Z"
          fill="url(#limeGrad)"
        />
        <path
          d="M10 100 C 70 96, 110 82, 160 66 C 210 50, 250 28, 330 14"
          stroke="#C8FF32"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="330" cy="14" r="4.5" fill="#C8FF32" />
        <line x1="10" y1="115" x2="330" y2="115" stroke="rgba(245,242,235,0.1)" />
      </svg>
    ),
  },
  {
    id: 'aether',
    client: 'Aether Cloud',
    sector: 'Enterprise Observability SaaS',
    metric: '99.98%',
    metricLabel: 'Multi-Region Uptime',
    summary:
      'Designed and engineered a real-time telemetry console handling 40k+ WebSocket events/sec with zero frame drops.',
    span: 'lg:col-span-5',
    icon: ShieldCheck,
    accent: 'indigo',
    visual: (
      <div className="mt-5 grid grid-cols-12 gap-1.5 items-end h-20">
        {[65, 82, 74, 95, 88, 92, 99, 96, 100, 94, 98, 100].map((val, idx) => (
          <div
            key={idx}
            className="rounded-sm bg-indigoGlow/30 border-t-2 border-indigoGlow transition-all duration-300 group-hover:bg-indigoGlow/50"
            style={{ height: `${val}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'solis',
    client: 'Solis Biotech',
    sector: 'Editorial Flagship & Data Portal',
    metric: '0.4s',
    metricLabel: 'Global Largest Contentful Paint',
    summary:
      'Bespoke WebGL molecular storytelling paired with an edge-cached research repository scoring 100 across all Core Web Vitals.',
    span: 'lg:col-span-5',
    icon: Gauge,
    accent: 'indigo',
    visual: (
      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-obsidian/70 border border-ivory/10 p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-lime flex items-center justify-center font-mono text-xs font-bold text-lime">
            100
          </div>
          <div>
            <div className="text-xs font-medium text-ivory">Perf Score</div>
            <div className="text-[11px] text-ivory/50">TTFB 48ms · CLS 0.00</div>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-1 rounded bg-lime/10 text-lime">
          PASS
        </span>
      </div>
    ),
  },
  {
    id: 'nordic',
    client: 'Nordic FinTech',
    sector: 'Multi-Brand Design System',
    metric: '3.8x',
    metricLabel: 'Feature Release Velocity',
    summary:
      'Unified 4 regional banking apps under a single tokenized React & Figma system with automated visual regression testing.',
    span: 'lg:col-span-7',
    icon: Layers,
    accent: 'lime',
    visual: (
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {['Tokens v2.4', '68 Primitives', 'WCAG AA'].map((pill, i) => (
          <div
            key={pill}
            className="rounded-lg bg-obsidian/75 border border-ivory/10 px-3 py-2.5 flex flex-col justify-between"
          >
            <span className="text-[10px] font-mono text-ivory/45">0{i + 1}</span>
            <span className="text-xs font-medium text-ivory mt-1">{pill}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function CaseHighlightsSection({ onOpenInquiry }) {
  return (
    <section id="work" className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      >
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-lime block mb-3">
            // Selected Outcomes
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
            Measured impact,
            <br />
            not vanity metrics.
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenInquiry()}
          className="inline-flex items-center gap-2 text-sm font-display font-semibold text-ivory hover:text-lime transition-colors self-start md:self-end"
        >
          Request full case dossier
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {CASES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${item.span} group relative rounded-2xl bg-surface border border-ivory/10 p-6 sm:p-8 overflow-hidden transition-colors hover:border-ivory/25`}
            >
              {/* Hover Spotlight Glow */}
              <div
                className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  item.accent === 'lime' ? 'bg-lime/15' : 'bg-indigoGlow/20'
                }`}
              />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-ivory/50 block">
                        {item.sector}
                      </span>
                      <h3 className="font-display font-semibold text-lg text-ivory mt-0.5">
                        {item.client}
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-obsidian border border-ivory/10 flex items-center justify-center text-ivory/70 group-hover:text-lime group-hover:border-lime/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div
                      className={`font-display font-bold text-4xl sm:text-5xl tracking-tight ${
                        item.accent === 'lime' ? 'text-lime' : 'text-ivory'
                      }`}
                    >
                      {item.metric}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-ivory/55 mt-1">
                      {item.metricLabel}
                    </div>
                  </div>

                  <p className="text-sm text-ivory/70 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="relative z-10">{item.visual}</div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
