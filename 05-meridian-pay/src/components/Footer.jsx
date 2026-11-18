import React from 'react';

const FOOTER_LINKS = {
  Platform: ['Atomic FX Corridors', 'Global IBAN Vaults', 'Holographic Cards', '4.85% T-Bill Repo'],
  Corridors: ['Tokyo ⇄ London Bridge', 'Autonomous Entity Sweep', 'Programmable Mint', 'Sovereign ZK Rail'],
  Developers: ['ISO-20022 REST API', 'Webhooks & Quorums', 'GLSL Telemetry HUD', 'System Status'],
  Compliance: ['SOC 2 Type II Attestation', 'FIPS 140-3 HSM Spec', 'PCI-DSS Level 1', 'Legal & Custody'],
};

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#030712]/90 backdrop-blur-xl border-t border-white/10 pt-14 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0B1325] border border-[#10B981]/40 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 18V6L12 13L20 6V18"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-white">Meridian</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
              Institutional quantum treasury, atomic multi-currency liquidity corridors, and
              hardware-enforced corporate spend.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>ALL 140+ CORRIDORS OPERATIONAL</span>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-3.5">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#fx-calculator"
                      className="text-xs sm:text-sm text-slate-400 hover:text-[#10B981] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} MERIDIAN QUANTUM TREASURY INC. ALL RIGHTS RESERVED.</p>
          <p className="max-w-lg sm:text-right">
            CUSTODY &amp; SETTLEMENT PROVIDED BY REGULATED TIER-1 PARTNER INSTITUTIONS · SIPC &amp;
            FDIC SAFEGUARDED.
          </p>
        </div>
      </div>
    </footer>
  );
}
