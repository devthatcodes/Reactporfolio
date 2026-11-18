/**
 * Kanso Atelier — Procedural Web Audio Acoustic Synthesizer Engine
 * Generates minimalist Japanese/Nordic architectural resonance:
 * - Warm wooden/stone clicks on interactive actions
 * - Low-pass filtered spatial air sweep on portal/shutter transitions
 * - Micro-ticks on hover & solar path scrubbing
 * - Subtle ambient harmonic drone (optional/when sound enabled)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.ambientGain = null;
    this.ambientOscs = [];
    this.lastTickTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.enabled = !this.enabled;

    if (this.enabled) {
      this.playChordChime();
      this.startAmbientPad();
    } else {
      this.stopAmbientPad();
    }

    return this.enabled;
  }

  startAmbientPad() {
    if (!this.ctx || !this.enabled) return;
    this.stopAmbientPad();

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.018, now + 1.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, now);

      masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Tuning: Warm fifth + ninth interval (D2, A2, E3)
      const freqs = [73.42, 110.0, 164.81];
      this.ambientOscs = freqs.map((f, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx === 2 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(masterGain);
        osc.start(now);
        return osc;
      });

      this.ambientGain = masterGain;
    } catch {
      // Ignore audio errors on restricted devices
    }
  }

  stopAmbientPad() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value || 0.01, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      const oscs = this.ambientOscs;
      setTimeout(() => {
        oscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // noop
          }
        });
      }, 450);
    } catch {
      // noop
    }
    this.ambientOscs = [];
    this.ambientGain = null;
  }

  playHoverTick(pitchMod = 1) {
    if (!this.enabled || !this.ctx) return;
    const nowPerf = performance.now();
    if (nowPerf - this.lastTickTime < 45) return;
    this.lastTickTime = nowPerf;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620 * pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(210 * pitchMod, now + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // noop
    }
  }

  playClick(variant = 'stone') {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = variant === 'timber' ? 320 : 240;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(68, now + 0.11);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(baseFreq * 1.5, now);
      sub.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.12);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 0.13);
      sub.stop(now + 0.13);
    } catch {
      // noop
    }
  }

  playPortalSweep() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Filtered pink/white noise burst + harmonic sine sweep
      const bufferSize = this.ctx.sampleRate * 0.65;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(680, now + 0.32);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.64);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.055, now + 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.64);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);

      // Resonant architectural bell overtone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.45);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.04, now + 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.6);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    } catch {
      // noop
    }
  }

  playChordChime() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [293.66, 440.0, 659.25]; // D4, A4, E5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.0001, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.04, now + i * 0.05 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.05 + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.6);
      });
    } catch {
      // noop
    }
  }
}

export const soundEngine = new SoundEngine();
