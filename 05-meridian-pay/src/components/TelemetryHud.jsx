import React from 'react';
import { soundEngine } from '../utils/soundEngine';

const SHADER_MODES = [
  { id: 0, label: 'FX CORRIDOR', short: 'FX' },
  { id: 1, label: 'TREASURY YIELD', short: 'YIELD' },
  { id: 2, label: 'ZERO-KNOWLEDGE VAULT', short: 'ZK-VAULT' },
];

export default function TelemetryHud({
  fps = 60,
  cursorTelemetry = { x: 0, y: 0, vel: '0.00' },
  networkMode = 0,
  onSelectNetworkMode,
  activeSection = '01 // LIQUIDITY STREAM',
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden xl:flex flex-col justify-between p-4 select-none">
      {/* Top-Left & Top-Right Corner Brackets below Navbar */}
      <div className="mt-16 flex items-start justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030712]/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-white font-semibold">{activeSection}</span>
          <span className="text-slate-600">|</span>
          <span className="text-[#10B981]">FX SPREAD: 0.01%</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#030712]/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase text-slate-400">
          <span>
            SETTLEMENT FPS: <strong className="text-[#10B981]">{fps}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            SHADER ENGINE: <strong className="text-cyan-400">GLSL 300</strong>
          </span>
        </div>
      </div>

      {/* Bottom HUD Bar: Interactive Shader Mode Switcher & Cursor Telemetry */}
      <div className="flex items-end justify-between">
        {/* Interactive Shader Field Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-xl bg-[#030712]/85 backdrop-blur-md border border-white/10 shadow-2xl">
          <span className="px-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            FIELD MODE:
          </span>
          {SHADER_MODES.map((m) => {
            const active = networkMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                data-cursor={`SHADER: ${m.short}`}
                onMouseEnter={() => soundEngine.playHover(1.1)}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectNetworkMode(m.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Live Cursor Vector Telemetry */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#030712]/75 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase text-slate-400 tabular-nums">
          <span>
            CURSOR TELEMETRY: X:{String(cursorTelemetry.x).padStart(4, '0')} Y:
            {String(cursorTelemetry.y).padStart(4, '0')}
          </span>
          <span className="text-slate-600">|</span>
          <span>
            VEL: <strong className="text-cyan-400">{cursorTelemetry.vel}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
