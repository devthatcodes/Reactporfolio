import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Check, Github, Sparkles, Send } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';

export default function ContactFooter({ onOpenTheater }) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('hello@devthatcodes.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setSubmitted(true);
  };

  return (
    <footer
      id="contact"
      className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left CTA Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AVAILABLE FOR FULL-TIME ROLES &amp; SELECT BUILDS</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.03]">
            Let&apos;s build something{' '}
            <span className="font-serif italic font-normal text-sky-300">unforgettable.</span>
          </h2>

          <p className="text-base text-white/65 max-w-md leading-relaxed">
            Whether you&apos;re hiring a senior frontend / full-stack engineer or commissioning a
            flagship web platform, I&apos;d love to connect.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-display font-bold text-sm hover:bg-sky-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span>{copied ? 'Email Copied!' : 'hello@devthatcodes.com'}</span>
            </button>

            <a
              href="https://github.com/devthatcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#101116] border border-white/15 text-sm font-medium text-white hover:border-white/40 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>github.com/devthatcodes</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Quick Message Card */}
        <div className="lg:col-span-6 rounded-3xl bg-[#101116] border border-white/10 p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Message Received</h3>
              <p className="text-sm text-white/65">
                Thanks for reaching out, {formState.name}. I&apos;ll get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', email: '', message: '' });
                }}
                className="text-xs font-mono uppercase tracking-wider text-sky-400 underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                // Direct Dispatch
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Alex Rivera"
                    className="w-full rounded-xl bg-[#070709] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl bg-[#070709] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1.5">Project or Role Details</label>
                <textarea
                  rows={3}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Tell me about your team, timeline, or product goals..."
                  className="w-full rounded-xl bg-[#070709] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-sky-400 text-black font-display font-bold text-sm hover:bg-white transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Quick-Launch Directory */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono uppercase tracking-wider text-white/60">LIVE BUILDS:</span>
          {PORTFOLIO_PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenTheater(p)}
              className="hover:text-white transition-colors font-mono"
            >
              {p.number} {p.title}
            </button>
          ))}
        </div>
        <div className="font-mono">
          © {new Date().getFullYear()} devthatcodes · Built with React, Vite &amp; Framer Motion
        </div>
      </div>
    </footer>
  );
}
