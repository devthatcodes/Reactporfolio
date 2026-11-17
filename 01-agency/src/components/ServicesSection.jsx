import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    id: 'brand-systems',
    number: '01',
    title: 'Brand & Design Systems',
    tagline: 'Cohesive visual languages built as living, versioned code.',
    description:
      'We bridge brand identity and production engineering. From typographic scales and multi-brand design tokens to accessible React component libraries documented in Storybook, your product teams ship faster with zero visual drift.',
    deliverables: [
      'Design Tokens (JSON / CSS)',
      'Figma-to-Code Component Kit',
      'WCAG AA Accessibility Audit',
      'Interactive Brand Guidelines',
    ],
    timeline: '4–8 Weeks',
  },
  {
    id: 'fullstack-apps',
    number: '02',
    title: 'Full-Stack Web Apps',
    tagline: 'Resilient SaaS platforms, customer portals, and AI-native workflows.',
    description:
      'Architecting end-to-end TypeScript applications with modern React, Next.js, and distributed APIs. We obsess over optimistic UI states, real-time synchronization, role-based security, and clean data modeling.',
    deliverables: [
      'TypeScript & React Architecture',
      'PostgreSQL / Edge Data Layer',
      'Auth, Billing & Webhooks',
      'Automated E2E Test Suite',
    ],
    timeline: '8–16 Weeks',
  },
  {
    id: 'motion-webgl',
    number: '03',
    title: 'Motion & WebGL Experiences',
    tagline: 'Choreographed interactions and 60fps 3D storytelling.',
    description:
      'We craft memorable flagship launches and interactive product showcases using Framer Motion, custom GLSL shaders, and GPU-accelerated Canvas—always tuned to degrade gracefully and respect reduced-motion preferences.',
    deliverables: [
      'Custom Shader & 3D Scenes',
      'Choreographed Page Transitions',
      'Interactive Product Demos',
      '60fps Mobile Optimization',
    ],
    timeline: '4–10 Weeks',
  },
  {
    id: 'performance-edge',
    number: '04',
    title: 'Performance & Edge Architecture',
    tagline: 'Sub-second global delivery and rock-solid observability.',
    description:
      'Slow software leaks revenue. We audit, refactor, and re-platform legacy frontends onto globally distributed edge networks with streaming SSR, granular caching, and real-user Core Web Vitals telemetry.',
    deliverables: [
      'Core Web Vitals Overhaul',
      'Edge Caching & Middleware',
      'CI/CD & Preview Pipelines',
      'Real-User Telemetry Setup',
    ],
    timeline: '3–6 Weeks',
  },
];

export default function ServicesSection({ onInquireService }) {
  const [openId, setOpenId] = useState('brand-systems');

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      >
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-lime block mb-3">
            // Capabilities
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
            Precision craft across
            <br />
            the modern web stack.
          </h2>
        </div>
        <p className="text-ivory/65 max-w-md text-sm sm:text-base leading-relaxed">
          Every engagement is led by principal designers and staff engineers—no handoffs to junior
          tiers, no bloated retainers.
        </p>
      </motion.div>

      <div className="border-t border-ivory/10">
        {SERVICES.map((service) => {
          const isOpen = openId === service.id;
          return (
            <div
              key={service.id}
              className="border-b border-ivory/10 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(service.id)}
                aria-expanded={isOpen}
                className="w-full py-7 sm:py-8 flex items-center justify-between gap-6 text-left group focus:outline-none"
              >
                <div className="flex items-baseline gap-5 sm:gap-10">
                  <span
                    className={`font-mono text-xs sm:text-sm transition-colors ${
                      isOpen ? 'text-lime' : 'text-ivory/40 group-hover:text-ivory/70'
                    }`}
                  >
                    {service.number}
                  </span>
                  <div>
                    <h3
                      className={`font-display font-semibold text-xl sm:text-3xl tracking-tight transition-colors ${
                        isOpen ? 'text-ivory' : 'text-ivory/80 group-hover:text-ivory'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm text-ivory/55 mt-1 hidden sm:block">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isOpen
                      ? 'bg-lime border-lime text-obsidian'
                      : 'bg-surface border-ivory/15 text-ivory/75 group-hover:border-lime/50 group-hover:text-lime'
                  }`}
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-0 sm:pl-16 pr-2 grid lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-7">
                        <p className="text-ivory/75 text-sm sm:text-base leading-relaxed mb-6">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-xs font-mono text-ivory/50 uppercase tracking-wider">
                            Typical Sprint: <strong className="text-ivory">{service.timeline}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => onInquireService(service.title)}
                            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-lime hover:text-ivory transition-colors"
                          >
                            Scope this capability
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <div className="text-xs font-mono uppercase tracking-wider text-ivory/45 mb-3">
                          Key Deliverables
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.deliverables.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-lg bg-surface border border-ivory/10 text-xs text-ivory/85"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
