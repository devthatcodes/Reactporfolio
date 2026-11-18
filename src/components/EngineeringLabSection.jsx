import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2, ArrowUpRight, Sparkles, Layers, ShoppingBag, Rocket } from 'lucide-react';
import soundEngine from '../utils/soundEngine';

const PACKAGES = [
  {
    id: 'business-site',
    badge: 'MOST POPULAR',
    title: 'Custom Business & Brand Website',
    priceRange: '$1,500 – $3,500',
    timeline: '2–4 Weeks',
    accent: '#E2D9C8',
    icon: Sparkles,
    description:
      'A bespoke, high-converting website tailored to your brand—engineered with smooth animations, mobile responsiveness, and fast SEO performance.',
    features: [
      'Custom UI/UX Design (No Cookie-Cutter Templates)',
      'Smooth Scroll Animations & Interactive Sections',
      'Lead Capture Forms, Booking & CRM Integration',
      'Mobile-First & 100/100 Google PageSpeed Optimization',
    ],
  },
  {
    id: 'ecommerce-store',
    badge: 'CONVERSION FOCUSED',
    title: 'Interactive E-Commerce & Product Site',
    priceRange: '$3,000 – $6,500',
    timeline: '3–6 Weeks',
    accent: '#E05A37',
    icon: ShoppingBag,
    description:
      'Turn browsers into buyers with tactile product showcases, custom configurators, slide-over shopping carts, and frictionless checkout flows.',
    features: [
      'Interactive Product Showcases & Filtering',
      'Custom Slide-Over Cart & Checkout Experience',
      'Inventory, Stripe / Shopify & Analytics Setup',
      'High-Craft Brand Storytelling & Micro-Interactions',
    ],
  },
  {
    id: 'webapp-saas',
    badge: 'FULL-STACK & UI',
    title: 'Web App, SaaS Interface or Redesign',
    priceRange: '$5,000+',
    timeline: '4–8 Weeks',
    accent: '#38BDF8',
    icon: Rocket,
    description:
      'Production-grade React & TypeScript interfaces for startups and growing businesses—from interactive dashboards to complete frontend overhauls.',
    features: [
      'Scalable React, Next.js & TypeScript Architecture',
      'Reusable Component Library & Design System',
      'Real-Time Dashboards, APIs & Authentication',
      'Dedicated Post-Launch Support & Documentation',
    ],
  },
];

export default function EngineeringLabSection({ onOpenInquiry }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineScaleX = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);

  return (
    <section
      id="engineering-lab"
      ref={sectionRef}
      className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Scroll-Driven Self-Drawing Hairline */}
      <div className="w-full h-[1px] bg-white/10 mb-16 overflow-hidden">
        <motion.div
          style={{ scaleX: lineScaleX, transformOrigin: 'left' }}
          className="w-full h-full bg-[#E2D9C8] will-change-transform"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#E2D9C8] block mb-3">
            // SERVICES &amp; TRANSPARENT PACKAGES
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5F4F0]">
            Ways we can{' '}
            <span className="font-serif italic font-normal text-[#E2D9C8]">
              work together.
            </span>
          </h2>
        </div>
        <p className="text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
          Clear scope, fast communication, and direct collaboration with{' '}
          <strong className="text-white">Deontae Word</strong> from initial concept to launch.
        </p>
      </div>

      {/* 3 Clear Client Service Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {PACKAGES.map((pkg, idx) => {
          const Icon = pkg.icon;
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-[28px] bg-[#0D0E12] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-white/25 transition-colors shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#060608]"
                    style={{ backgroundColor: pkg.accent }}
                  >
                    {pkg.badge}
                  </span>
                  <Icon className="w-5 h-5" style={{ color: pkg.accent }} />
                </div>

                <h3 className="font-display font-extrabold text-2xl text-white leading-snug mb-2">
                  {pkg.title}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span
                    className="font-display font-bold text-2xl sm:text-3xl"
                    style={{ color: pkg.accent }}
                  >
                    {pkg.priceRange}
                  </span>
                  <span className="text-xs font-mono text-white/45">· {pkg.timeline}</span>
                </div>

                <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-2.5 border-t border-white/10 pt-5 mb-8">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: pkg.accent }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenInquiry({
                    type: pkg.title,
                    budget: pkg.priceRange,
                  });
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-display font-bold uppercase tracking-wider text-[#060608] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: pkg.accent }}
              >
                <span>Inquire About This Package</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
