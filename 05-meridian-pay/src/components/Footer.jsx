import React from 'react';

const FOOTER_LINKS = {
  Platform: ['Multi-Currency Accounts', 'Global FX Conversion', 'Corporate Cards', 'Treasury Yield'],
  Solutions: ['Enterprise SaaS', 'Global Marketplaces', 'Venture-Backed Startups', 'Multi-Entity'],
  Developers: ['REST API Reference', 'Webhooks & Events', 'Sandbox Environment', 'Status Page'],
  Company: ['Security & Compliance', 'SOC 2 Report', 'Careers', 'Legal & Privacy'],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-slate-100">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center">
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
              <span className="text-base font-bold tracking-tight text-[#0F172A]">Meridian</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              Borderless treasury, multi-currency accounts, and automated spend for modern
              global enterprises.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-xs font-mono text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-3.5">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#fx-calculator"
                      className="text-xs sm:text-sm text-slate-500 hover:text-[#0F172A] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Meridian Financial Technologies Inc. All rights reserved.</p>
          <p className="max-w-lg sm:text-right">
            Meridian is a financial technology company, not a bank. Banking services provided by
            regulated tier-1 partner institutions, Members FDIC.
          </p>
        </div>
      </div>
    </footer>
  );
}
