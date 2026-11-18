import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileCheck2, KeyRound, ArrowRight } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const COMPLIANCE_CARDS = [
  {
    code: 'SOC 2 Type II',
    title: 'Continuous Independent Audits',
    desc: 'Real-time cryptographic attestation across security, availability, and atomic settlement integrity controls.',
    badge: 'AUDITED 2026',
    icon: ShieldCheck,
  },
  {
    code: 'ISO 27001 & 20022',
    title: 'Global ISMS & Swift Telemetry',
    desc: 'Certified information security management and native ISO-20022 messaging across all central bank corridors.',
    badge: 'CERTIFIED',
    icon: FileCheck2,
  },
  {
    code: 'PCI-DSS Level 1',
    title: 'Zero-Knowledge Card Vaults',
    desc: 'Hardware-tokenized PAN storage and isolated card issuing enclaves compliant with global card networks.',
    badge: 'LEVEL 1',
    icon: KeyRound,
  },
  {
    code: 'FIPS 140-3 Level 4',
    title: 'MPC Hardware Key Quorums',
    desc: 'Multi-party computation HSM key rotation with end-to-end post-quantum TLS 1.3 encryption.',
    badge: 'HSM ENCLAVE',
    icon: Lock,
  },
];

export default function SecurityGrid({ onOpenAccount }) {
  return (
    <section id="security" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>05 // ZERO-KNOWLEDGE SECURITY &amp; CUSTODY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            <ScrambleText text="Engineered for Sovereign Custody." />
          </h2>
          <p className="text-base text-slate-400 mt-3">
            Safeguarded funds in segregated Tier-1 central-bank-linked partner vaults, MPC
            hardware approval quorums, and zero-trust cryptographic infrastructure.
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
                whileHover={{ y: -6 }}
                onMouseEnter={() => soundEngine.playHover(1 + idx * 0.05)}
                data-cursor={`VERIFY: ${card.code}`}
                className="bg-[#070D19]/90 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#10B981]/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#10B981]">
                      {card.badge}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                    {card.code}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{card.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
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
          className="mt-14 rounded-3xl bg-gradient-to-r from-[#0B1325] via-[#070D19] to-[#0B1325] border border-[#10B981]/40 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_0_60px_rgba(16,185,129,0.15)]"
        >
          <div className="max-w-xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#10B981] mb-1.5">
              INSTITUTIONAL ONBOARDING // 10-MINUTE KYB
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to unify your global quantum treasury?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Provision multi-currency IBANs, 4.85% U.S. Treasury repos, and atomic FX rails or
              schedule a dedicated engineering walkthrough.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              data-cursor="BOOK DEMO"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playClick();
                onOpenAccount('demo');
              }}
              className="px-5 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-colors"
            >
              Book Architecture Demo
            </button>
            <button
              type="button"
              data-cursor="OPEN VAULT"
              onMouseEnter={() => soundEngine.playHover(1.2)}
              onClick={() => {
                soundEngine.playConfirm();
                onOpenAccount('account');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-[#030712] bg-[#10B981] hover:bg-[#34D399] shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-colors"
            >
              <span>Open Institutional Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
