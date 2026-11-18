import React from 'react';
import { Sun } from 'lucide-react';
import { LIGHTING_MODES } from './ArchitecturalShaderCanvas';
import { soundEngine } from '../utils/soundEngine';

/**
 * Persistent peripheral Spatial Telemetry HUD Frame inspired by Active Theory.
 * Displays live solar azimuth, cursor elevation, scroll inertia velocity, and
 * interactive WebGL lighting preset switcher.
 */
export default function SpatialHud({
  telemetry,
  lightingMode,
  onChangeLightingMode,
  activeSectionLabel = '01 // STUDIO & ETHOS',
}) {
  const currentLight = LIGHTING_MODES[lightingMode] || LIGHTING_MODES[0];
  const azimuthDeg = (110 + (telemetry?.mouseX || 0.5) * 140).toFixed(1);
  const elevationDeg = (18 + (telemetry?.mouseY || 0.5) * 52).toFixed(1);
  const velocityVal = ((telemetry?.velocity || 0) * 100).toFixed(0).padStart(3, '0');

  return (
    <>
      {/* Subtle Peripheral Architectural Corner Crosshairs (pointer-events-none) */}
      <div className="pointer-events-none fixed inset-3 sm:inset-5 z-30 border border-charcoal/10 hidden md:block">
        {/* Top-left corner reticle */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-bronze" />
        {/* Top-right corner reticle */}
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-bronze" />
        {/* Bottom-left corner reticle */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-bronze" />
        {/* Bottom-right corner reticle */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-bronze" />

        {/* Left vertical scale ticks */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pl-1.5 text-[8px] font-mono text-taupe/60">
          <span>+12.0M</span>
          <span className="w-2 h-[1px] bg-charcoal/20" />
          <span>+06.0M</span>
          <span className="w-3 h-[1px] bg-bronze/60" />
          <span>±00.0M</span>
        </div>
      </div>

      {/* Bottom Floating Telemetry & Lighting Preset Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-8 sm:right-8 z-30 pointer-events-none flex items-end justify-between gap-4">
        {/* Left Telemetry Readout */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-alabaster/95 border border-charcoal/15 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe pointer-events-auto shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bronze animate-pulse" />
            <span className="text-charcoal font-medium">{activeSectionLabel}</span>
          </div>
          <span className="text-charcoal/20">|</span>
          <div>
            <span>SOLAR AZIMUTH: </span>
            <span className="text-charcoal">{azimuthDeg}°</span>
          </div>
          <div>
            <span>ALT: </span>
            <span className="text-charcoal">{elevationDeg}°</span>
          </div>
          <div>
            <span>FLUX: </span>
            <span className="text-bronze">{velocityVal}</span>
          </div>
        </div>

        {/* Right Interactive Shader Lighting Mode Switcher */}
        <div
          className="ml-auto pointer-events-auto flex items-center gap-1 p-1 bg-alabaster/95 border border-charcoal/15 shadow-sm"
          role="group"
          aria-label="WebGL Architectural Lighting Mode"
        >
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-taupe">
            <Sun className="w-3 h-3 text-bronze" />
            <span>LIGHT:</span>
          </div>
          {LIGHTING_MODES.map((mode) => {
            const active = mode.id === lightingMode;
            return (
              <button
                key={mode.id}
                type="button"
                data-cursor="SHIFT SOLAR FIELD"
                onMouseEnter={() => soundEngine.playHoverTick(1.1)}
                onClick={() => {
                  soundEngine.playClick('stone');
                  onChangeLightingMode(mode.id);
                }}
                className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.18em] transition-all ${
                  active
                    ? 'bg-charcoal text-alabaster'
                    : 'text-taupe hover:text-charcoal hover:bg-stone/70'
                }`}
              >
                <span className="hidden md:inline">{mode.label}</span>
                <span className="md:hidden">{mode.code}</span>
              </button>
            );
          })}
          <div className="hidden xl:block px-2.5 text-[9px] font-mono text-bronze">
            {currentLight.kelvin}
          </div>
        </div>
      </div>
    </>
  );
}
