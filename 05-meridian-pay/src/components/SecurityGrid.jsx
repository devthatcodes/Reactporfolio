import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileCheck2, KeyRound, ArrowRight } from 'lucide-react';

const COMPLIANCE_CARDS = [
  {
    code: 'SOC 2 Type II',
    title: 'Continuous Independent Audits',
    desc: 'Annual third-party attestation across security, availability, and processing integrity controls.',
    badge: 'Audited 2026',
    icon: ShieldCheck,
  },
  {
    code: 'ISO 27001',
    title: 'Global ISMS Certified',
    desc: 'Certified information security management system governing infrastructure, access, and incident response.',
    badge: 'Certified',
    icon: FileCheck2,
  },
  {
    code: 'PCI-DSS Level 1',
    title: 'Highest Cardholder Standard',
    desc: 'Tokenized PAN storage and isolated card issuing vaults compliant with global payment networks.',
    badge: 'Level 1',
    icon: KeyRound,
  },
  {
    code: '256-Bit Encryption',
    title: 'AES-256 & TLS 1.3',
    desc: 'Hardware-backed KMS key rotation with end-to-end encryption in transit and at rest.',
    badge: 'FIPS 140-3',
    icon: Lock,
  },
];

export default function SecurityGrid({ onOpenAccount }) {
  return (
    <section id="security" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 lg:mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB] mb-2.5">
            Institutional Security &amp; Compliance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Engineered for regulated global finance.
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Safeguarded funds in segregated tier-1 partner banks, multi-party approval
            quorums, and zero-trust cryptographic infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COMPLIANCE_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle hover:shadow-card-elevated hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-[#10B981] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#059669]">
                      {card.badge}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-[#2563EB] uppercase tracking-wide">
                    {card.code}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mt-1">{card.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Enterprise CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-14 rounded-2xl bg-[#0F172A] p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-card-elevated"
        >
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to unify your global treasury?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Open a multi-currency Meridian account in 10 minutes or schedule a tailored
              walkthrough with our treasury specialists.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAccount('demo')}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
            >
              Book a Demo
            </button>
            <button
              type="button"
              onClick={() => onOpenAccount('account')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-[#10B981] hover:bg-[#059669] transition-colors"
            >
              <span>Open Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
