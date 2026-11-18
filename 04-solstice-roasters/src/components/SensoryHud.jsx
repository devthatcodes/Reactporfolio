import React from 'react';
import { Flame, Activity, Compass } from 'lucide-react';
import soundEngine from '../utils/soundEngine';

export const ROAST_MODES = [
  { id: 0, code: 'LIGHT FLORAL', temp: '196.4°C', tds: '1.38%', ext: '20.4%' },
  { id: 1, code: 'MEDIUM CARAMEL', temp: '204.5°C', tds: '1.44%', ext: '21.2%' },
  { id: 2, code: 'DARK OBSIDIAN', temp: '212.8°C', tds: '1.52%', ext: '21.9%' },
];

export const PORTAL_SECTIONS = [
  {
    id: 'origins',
    code: '01 // MICRO-LOT REEL',
    short: '01 // REEL',
    title: '01 // MICRO-LOT REEL',
    subtitle: '3D TERROIR SHOWCASE • SINGLE-ORIGIN HARVEST',
    viewMode: 'reel',
  },
  {
    id: 'origins',
    code: '02 // SENSORY FLAVOR MATRIX',
    short: '02 // MATRIX',
    title: '02 // SENSORY FLAVOR MATRIX',
    subtitle: 'ACIDITY × SWEETNESS × BODY SPECTROGRAPHY',
    viewMode: 'matrix',
  },
  {
    id: 'brew-guide',
    code: '03 // EXTRACTION LAB',
    short: '03 // LAB',
    title: '03 // EXTRACTION LAB',
    subtitle: 'DIALED-IN RATIOS • REAL-TIME POUR TELEMETRY',
  },
  {
    id: 'tasting-room',
    code: '04 // TASTING ROOM',
    short: '04 // ROOM',
    title: '04 // TASTING ROOM',
    subtitle: 'PORTLAND SLOW BAR • GUIDED PUBLIC CUPPINGS',
  },
];

export default function SensoryHud({
  roastMode = 0,
  onCycleRoastMode,
  cursorVelocity = 0,
  onPortalJump,
}) {
  const modeInfo = ROAST_MODES[roastMode % ROAST_MODES.length];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 pointer-events-none hidden lg:flex items-center justify-between gap-4">
      {/* Left Telemetry Cluster: Thermal Shader Mode + TDS + Velocity */}
      <div className="pointer-events-auto inline-flex items-center gap-3 px-4 py-2 rounded-full bg-espresso/90 text-cream backdrop-blur-md border border-cream/15 shadow-lg text-[11px] font-mono tracking-wider uppercase">
        <button
          type="button"
          data-cursor="THERMAL SHIFT"
          onClick={() => {
            soundEngine.playRoastShift((roastMode + 1) % 3);
            if (onCycleRoastMode) onCycleRoastMode();
          }}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-terracotta/25 text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream transition-colors"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>THERMAL SHADER: {modeInfo.code}</span>
        </button>

        <span className="h-3.5 w-[1px] bg-cream/15" />

        <div className="flex items-center gap-1.5 text-cream/75">
          <span className="text-cream/45">DRUM:</span>
          <span className="text-cream font-semibold">{modeInfo.temp}</span>
        </div>

        <span className="h-3.5 w-[1px] bg-cream/15" />

        <div className="flex items-center gap-1.5 text-cream/75">
          <span className="text-cream/45">EXTRACTION TDS:</span>
          <span className="text-sage font-semibold">
            {modeInfo.tds} ({modeInfo.ext})
          </span>
        </div>

        <span className="h-3.5 w-[1px] bg-cream/15" />

        <div className="flex items-center gap-1.5 text-cream/75 min-w-[115px]">
          <Activity className="w-3 h-3 text-terracotta" />
          <span className="text-cream/45">VEL:</span>
          <span className="text-cream tabular-nums">
            {String(cursorVelocity).padStart(4, '0')} px/s
          </span>
        </div>
      </div>

      {/* Right Quick Portal Jump Matrix */}
      <div className="pointer-events-auto inline-flex items-center gap-1.5 p-1.5 rounded-full bg-espresso/90 text-cream backdrop-blur-md border border-cream/15 shadow-lg text-[11px] font-mono tracking-wider uppercase">
        <span className="px-2.5 py-1 text-cream/45 inline-flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-terracotta" />
          <span>PORTALS</span>
        </span>
        {PORTAL_SECTIONS.map((sec) => (
          <button
            key={sec.code}
            type="button"
            data-cursor="PORTAL WIPE"
            onClick={() => onPortalJump && onPortalJump(sec)}
            onMouseEnter={() => soundEngine.playHover(1)}
            className="px-3 py-1 rounded-full text-cream/80 hover:text-cream hover:bg-terracotta transition-colors"
          >
            {sec.short}
          </button>
        ))}
      </div>
    </div>
  );
}
