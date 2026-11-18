import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-charcoal text-alabaster/80 py-16 pb-24 border-t border-charcoal">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-alabaster/10">
          <div className="md:col-span-5 space-y-3">
            <p className="font-serif text-2xl tracking-[0.14em] uppercase text-alabaster">
              Kanso Atelier
            </p>
            <p className="text-xs text-alabaster/60 max-w-sm leading-relaxed">
              Quiet spaces shaped by light, timber, and stone. Architecture, interiors, and bespoke
              spatial objects.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="uppercase tracking-[0.2em] text-bronze mb-3">Navigation</p>
            <ul className="space-y-2 text-alabaster/70">
              <li>
                <a href="#studio" className="hover:text-alabaster transition-colors">
                  01 · Studio
                </a>
              </li>
              <li>
                <a href="#works" className="hover:text-alabaster transition-colors">
                  02 · Selected Works
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-alabaster transition-colors">
                  03 · Philosophy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-alabaster transition-colors">
                  04 · Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end space-y-6">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-alabaster/70 hover:text-bronze transition-colors"
            >
              <span>Return to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
            <div className="text-left md:text-right text-xs text-alabaster/50 space-y-1">
              <p>Kyoto · 35°00&apos;N 135°46&apos;E</p>
              <p>Copenhagen · 55°40&apos;N 12°34&apos;E</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-alabaster/45 tracking-[0.12em] uppercase">
          <p>© {new Date().getFullYear()} Kanso Atelier. All rights reserved.</p>
          <p>MAA · JIA Registered Architectural Practice</p>
        </div>
      </div>
    </footer>
  );
}
