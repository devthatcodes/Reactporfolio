import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export function SignInModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    soundEngine.playConfirm();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-3xl bg-[#070D19] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-8 z-10 text-white"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Sign In"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Hardware Passkey Dispatched</h3>
                <p className="text-sm text-slate-300">
                  We sent a FIDO2 / HSM-verified sign-in challenge to{' '}
                  <span className="font-mono font-semibold text-[#10B981]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-[#030712] text-xs font-mono font-bold uppercase"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#10B981]">
                      FIPS 140-3 ENCLAVE AUTH
                    </div>
                    <h3 className="text-lg font-bold text-white">Sign in to Meridian OS</h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cfo@globalholdings.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Hardware Token / Passphrase
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#030712] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    Authenticate Session
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AccountDemoModal({ isOpen, initialMode = 'account', onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState('$10M – $50M / yr');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [initialMode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company || !email) return;
    soundEngine.playConfirm();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#070D19] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-8 z-10 text-white"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Modal"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {mode === 'account' ? 'Institutional Vault Initialized' : 'Architecture Demo Confirmed'}
                </h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-white">{company}</span>. Your
                  dedicated Meridian quantum onboarding key has been dispatched to{' '}
                  <span className="font-mono text-[#10B981]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#10B981] text-[#030712] text-xs font-mono font-bold uppercase"
                >
                  Return to Meridian OS
                </button>
              </div>
            ) : (
              <>
                {/* Mode Toggle */}
                <div className="inline-flex p-1 rounded-xl bg-[#030712] border border-white/10 mb-5">
                  <button
                    type="button"
                    onClick={() => setMode('account')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase transition-colors ${
                      mode === 'account'
                        ? 'bg-[#10B981] text-[#030712]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Open Vault
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('demo')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase transition-colors ${
                      mode === 'demo'
                        ? 'bg-[#10B981] text-[#030712]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Book Demo
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {mode === 'account'
                    ? 'Provision Your Meridian Quantum Treasury'
                    : 'Schedule a 1-on-1 Liquidity Engineering Demo'}
                </h3>
                <p className="text-sm text-slate-400 mt-1 mb-5">
                  {mode === 'account'
                    ? 'Get local multi-currency IBANs, 4.85% U.S. T-Bill yield, and titanium cards.'
                    : 'See atomic FX routing, ERP sync, and multi-entity sweeps in action.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Entity Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Global Holdings Inc."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Executive / Treasury Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="treasury@acmeglobal.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Annual FX &amp; Settlement Volume
                    </label>
                    <select
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#10B981]"
                    >
                      <option>$1M – $10M / yr</option>
                      <option>$10M – $50M / yr</option>
                      <option>$50M – $250M / yr</option>
                      <option>$250M+ / yr</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#030712] text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>
                      {mode === 'account' ? 'Initialize Institutional KYB' : 'Dispatch Demo Invite'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
