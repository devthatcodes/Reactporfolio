import React from 'react';
import { Layers, Sparkles, Volume2, VolumeX, Compass } from 'lucide-react';
import soundEngine from '../utils/soundEngine';

const SHADER_PRESETS = [
  { id: 0, name: 'OBSIDIAN PLASMA' },
  { id: 1, name: 'SDF WORK TUNNEL' },
  { id: 2, name: 'QUANTUM CONTOUR' },
];

export default function HudOverlay({
  telemetry,
  shaderPreset,
  onSelectShader,
  viewMode,
  onToggleViewMode,
  soundEnabled,
  onToggleSound,
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 hidden sm:flex flex-col justify-between p-5 lg:p-7 select-none">
      {/* Top Peripheral Corner Ticks */}
      <div className="flex items-start justify-between">
        <div className="w-4 h-4 border-t border-l border-ivory/25" />
        <div className="w-4 h-4 border-t border-r border-ivory/25" />
      </div>

      {/* Side Telemetry Rail (Left) */}
      <div className="my-auto flex items-center justify-between">
        <div className="flex flex-col gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-ivory/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            <span>FPS: {telemetry.fps || 60}</span>
          </div>
          <div>VEL: {telemetry.velocity || '0.00'}</div>
          <div>
            XY: {String(telemetry.mouseX || 50).padStart(2, '0')}:
            {String(telemetry.mouseY || 50).padStart(2, '0')}
          </div>
        </div>

        {/* Right Quick Portal Mode Indicator */}
        <div className="flex flex-col items-end gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-ivory/40">
          <span>GLSL // ACTIVE</span>
          <span className="text-lime/80">
            MODE: {viewMode === 'stream' ? '3D WORK STREAM' : 'STUDIO FULL'}
          </span>
        </div>
      </div>

      {/* Bottom Interactive HUD Bar */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: View Mode Switcher & Coordinates */}
        <div className="pointer-events-auto flex items-center gap-2 bg-obsidian/80 backdrop-blur-md border border-ivory/15 rounded-full px-3 py-1.5 shadow-xl">
          <button
            type="button"
            data-cursor="SWITCH VIEW MODE"
            onClick={() => {
              soundEngine.playClick();
              onToggleViewMode(viewMode === 'stream' ? 'full' : 'stream');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ivory/80 hover:text-lime transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-lime" />
            <span>
              {viewMode === 'stream'
                ? 'VIEW: INTERACTIVE WORK STREAM (ACTIVE THEORY MODE)'
                : 'VIEW: FULL STUDIO SCROLL'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-lime/15 text-lime border border-lime/30">
              SWITCH
            </span>
          </button>
        </div>

        {/* Bottom-Right: Real-Time WebGL Shader Switcher & Sound Synth Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-1 bg-obsidian/80 backdrop-blur-md border border-ivory/15 rounded-full p-1 shadow-xl">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 text-[10px] font-mono uppercase tracking-wider text-ivory/50">
              <Sparkles className="w-3 h-3 text-lime" />
              SHADER:
            </span>
            {SHADER_PRESETS.map((preset) => {
              const active = shaderPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  data-cursor={`SHADER: ${preset.name}`}
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectShader(preset.id);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-lime text-obsidian font-semibold shadow-[0_0_12px_rgba(200,255,50,0.35)]'
                      : 'text-ivory/60 hover:text-ivory'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            data-cursor={soundEnabled ? 'MUTE SYNTH' : 'ENABLE SYNTH'}
            onClick={onToggleSound}
            onMouseEnter={() => soundEngine.playHover()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-mono uppercase tracking-wider transition-all ${
              soundEnabled
                ? 'bg-obsidian/80 border-lime/50 text-lime'
                : 'bg-obsidian/80 border-ivory/15 text-ivory/50 hover:text-ivory'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-lime" />
                <span>AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
