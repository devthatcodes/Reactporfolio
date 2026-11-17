import React from 'react';
import { SolsticeCrest } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream/85 border-t border-cream/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-cream/10">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <SolsticeCrest className="w-9 h-9" light />
              <div>
                <span className="font-serif text-xl text-cream block leading-none">
                  Solstice Roasters
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-cream/50">
                  Portland • Est. 2019
                </span>
              </div>
            </div>
            <p className="text-sm text-cream/65 max-w-sm leading-relaxed">
              Small-batch, high-altitude single-origin coffee roasted with transparency, precision,
              and respect for every producer along the equator.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-cream/50 font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#origins" className="hover:text-terracotta transition-colors">
                  Single Origins
                </a>
              </li>
              <li>
                <a href="#brew-guide" className="hover:text-terracotta transition-colors">
                  Brew Guide
                </a>
              </li>
              <li>
                <a href="#tasting-room" className="hover:text-terracotta transition-colors">
                  Tasting Room
                </a>
              </li>
              <li>
                <a href="#subscribe" className="hover:text-terracotta transition-colors">
                  Subscriptions
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-cream/50 font-semibold">
              Roast Schedule
            </h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>Mon &amp; Thu Production</li>
              <li>48h Dispatch Window</li>
              <li>Fri/Sat Public Cuppings</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-cream/50 font-semibold">
              Visit Us
            </h4>
            <p className="text-sm text-cream/70 leading-relaxed">
              1420 SE Alder St
              <br />
              Portland, OR 97214
              <br />
              hello@solsticeroasters.com
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Solstice Roasters. All rights reserved.</p>
          <p>Roasted in small 12kg batches • Direct Trade</p>
        </div>
      </div>
    </footer>
  );
}
