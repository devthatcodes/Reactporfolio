import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react';

export default function SandboxModal({ isOpen, onClose, initialPlan = 'Pro' }) {
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [provider, setProvider] = useState('Multi-Model (OpenAI + Anthropic)');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const randomHex = Math.random().toString(16).substring(2, 10);
    setGeneratedKey(`ae_live_sbx_${randomHex}9f4c2a1b`);
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setEmail('');
    setOrg('');
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#27272A] bg-[#111115] p-6 shadow-2xl"
          >
            {/* Subtle top gradient line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6]" />

            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#FAFAFA]">
                    {submitted ? 'Sandbox Key Provisioned' : 'Request Sandbox API Key'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {submitted
                      ? 'Ready for immediate edge routing'
                      : `Instant 100k free trace credits • ${initialPlan} Tier`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-[#27272A] hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.ai"
                    className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2.5 text-sm text-[#FAFAFA] placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                    Organization / Project
                  </label>
                  <input
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Acme AI Labs"
                    className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2.5 text-sm text-[#FAFAFA] placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                    Primary Model Stack
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2.5 text-sm text-[#FAFAFA] focus:border-cyan-400 focus:outline-none"
                  >
                    <option>Multi-Model (OpenAI + Anthropic)</option>
                    <option>OpenAI GPT-4o / o1</option>
                    <option>Anthropic Claude 3.5 Sonnet</option>
                    <option>Self-Hosted vLLM / Llama 3.1</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-[#27272A]/80 bg-[#09090B] px-3 py-2 text-[11px] text-zinc-400">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>SOC 2 Type II compliant. Zero-data-retention mode enabled by default.</span>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#09090B] transition-opacity hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Sandbox Key</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                  <p className="text-xs text-emerald-300">
                    Provisioned for <span className="font-semibold text-white">{org}</span> ({email}).
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Your Aether Gateway Key
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2.5">
                    <code className="font-mono text-xs text-cyan-300">{generatedKey}</code>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="ml-2 inline-flex items-center gap-1 rounded-md border border-[#27272A] bg-[#111115] px-2 py-1 text-[11px] font-medium text-zinc-300 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3 font-mono text-[11px] leading-relaxed text-zinc-400">
                  <span className="text-zinc-500"># Quick test</span>
                  <br />
                  <span className="text-cyan-400">export</span> AETHER_API_KEY=&quot;{generatedKey}&quot;
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full rounded-lg border border-[#27272A] bg-[#09090B] py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
