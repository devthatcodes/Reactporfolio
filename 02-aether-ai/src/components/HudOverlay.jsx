import React, { useEffect, useRef } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { playHover, playClick } from '../utils/soundEngine';

export const SHADER_MODES = [
  { id: 0, name: 'TENSOR FIELD', badge: 'GLSL // 01' },
  { id: 1, name: 'QUANTUM FLUX', badge: 'GLSL // 02' },
  { id: 2, name: 'SYNAPTIC GRID', badge: 'GLSL // 03' },
];

export default function HudOverlay({
  fps = 60,
  shaderMode = 0,
  onCycleShader,
  viewMode = 'overview',
  onToggleViewMode,
}) {
  const coordsRef = useRef(null);
  const velRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let decayTimer = null;

    const onMove = (e) => {
      if (coordsRef.current) {
        coordsRef.current.textContent = `${String(e.clientX).padStart(4, '0')},${String(
          e.clientY
        ).padStart(4, '0')}`;
      }
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (velRef.current) {
        const vel = Math.min(99, Math.round(dy * 1.4));
        velRef.current.textContent = `${String(vel).padStart(2, '0')}m/s`;
      }
      if (decayTimer) clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        if (velRef.current) velRef.current.textContent = '00m/s';
      }, 160);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (decayTimer) clearTimeout(decayTimer);
    };
  }, []);

  const currentShader = SHADER_MODES[shaderMode] || SHADER_MODES[0];

  return (
    <>
      {/* Subtle Peripheral Corner Brackets */}
      <div className="pointer-events-none fixed inset-3 z-30 hidden border border-zinc-800/30 lg:block">
        <span className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-cyan-400/60" />
        <span className="absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-cyan-400/60" />
        <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-cyan-400/60" />
        <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-cyan-400/60" />
      </div>

      {/* Bottom Floating Telemetry & Shader Controller Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Telemetry Readout (DOM Ref Driven - Zero React Re-renders) */}
        <div className="pointer-events-auto hidden items-center gap-3 rounded-xl border border-[#27272A]/90 bg-[#090D16]/95 px-3.5 py-2 font-mono text-[10px] tracking-wider text-zinc-400 shadow-2xl md:flex">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-200">{fps} FPS</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div>
            XY:{' '}
            <span ref={coordsRef} className="text-cyan-400">
              0540,0320
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <div>
            VEL:{' '}
            <span ref={velRef} className="text-violet-400">
              00m/s
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="hidden lg:block">
            CLUSTER: <span className="text-emerald-400">11ms P50</span>
          </div>
        </div>

        {/* Right Interactive Shader & View Mode Controls */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <button
            type="button"
            data-cursor="[ SWITCH VIEW ]"
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              onToggleViewMode();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#27272A] bg-[#090D16]/95 px-3 py-2 font-mono text-[10px] font-semibold tracking-wider text-zinc-300 shadow-xl transition-all hover:border-cyan-400/50 hover:text-white"
          >
            <Layers className="h-3.5 w-3.5 text-violet-400" />
            <span>
              MODE: {viewMode === 'reel' ? '[ BLADE RACK ]' : '[ FULL OVERVIEW ]'}
            </span>
          </button>

          <button
            type="button"
            data-cursor="[ MORPH SHADER ]"
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              onCycleShader();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#090D16]/95 px-3.5 py-2 font-mono text-[10px] font-semibold tracking-wider text-cyan-300 shadow-xl shadow-cyan-500/10 transition-all hover:border-cyan-300 hover:bg-[#16161E]"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>SHADER: {currentShader.name}</span>
            <span className="rounded bg-cyan-400/15 px-1.5 py-0.5 text-[9px] text-cyan-200">
              {currentShader.badge}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
