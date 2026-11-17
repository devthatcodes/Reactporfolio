import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { index: '01', label: 'Studio', href: '#studio' },
  { index: '02', label: 'Works', href: '#works' },
  { index: '03', label: 'Philosophy', href: '#philosophy' },
  { index: '04', label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-alabaster/90 backdrop-blur-md border-b border-charcoal/10 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Kanso Atelier Home"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-charcoal transition-transform duration-500 group-hover:rotate-90"
            >
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1" />
              <line x1="2" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1" />
              <line x1="12" y1="2" x2="12" y2="14" stroke="#9A7B4F" strokeWidth="1" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl md:text-2xl tracking-[0.14em] uppercase text-charcoal">
                Kanso Atelier
              </span>
              <span className="text-[9px] uppercase tracking-[0.26em] text-taupe mt-0.5">
                Kyoto · Copenhagen
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative flex items-baseline gap-2 text-xs uppercase tracking-[0.2em] text-charcoal/80 hover:text-charcoal transition-colors py-1"
              >
                <span className="text-[10px] font-mono text-bronze/80 group-hover:text-bronze transition-colors">
                  {item.index}
                </span>
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-bronze transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -mr-2 text-charcoal hover:text-bronze transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.25]" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[84%] max-w-sm bg-alabaster border-l border-charcoal/10 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-charcoal/10">
                  <span className="font-serif text-lg tracking-[0.16em] uppercase text-charcoal">
                    Index
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 -mr-2 text-charcoal hover:text-bronze transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5 stroke-[1.25]" />
                  </button>
                </div>

                <nav className="mt-10 flex flex-col gap-6">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + idx * 0.05 }}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between py-2 border-b border-charcoal/10"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="text-xs font-mono text-bronze">{item.index}</span>
                        <span className="font-serif text-3xl text-charcoal group-hover:text-bronze transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-taupe group-hover:text-bronze transition-colors" />
                    </motion.a>
                  ))}
                </nav>
              </div>

              <div className="pt-8 border-t border-charcoal/10 space-y-3 text-xs text-taupe">
                <p className="uppercase tracking-[0.2em] text-charcoal/70">Ateliers</p>
                <p>Nakagyo-ku, Kyoto 604-8006</p>
                <p>Bredgade 45, 1260 København K</p>
                <p className="text-bronze pt-1">studio@kansoatelier.com</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
