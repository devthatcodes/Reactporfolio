// Procedural Web Audio API Sensory Synthesizer for Solstice Roasters
// Generates warm analog tactile clicks, frequency-swept steam/portal transitions,
// harmonic hover chimes, and roast thermal shifts with zero external audio assets.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.listeners = new Set();
  }

  initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isEnabled() {
    return this.enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.initContext();
      this.playSuccess();
    }
    this.notify();
    return this.enabled;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  // Subtle warm wooden/analog micro-tick on hover
  playHover(pitchOffset = 0) {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      const baseFreq = 520 + pitchOffset * 35;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.045);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Ignore audio errors when tab is backgrounded
    }
  }

  // Crisp mechanical roaster relay click
  playClick() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.065);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.075, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Ignore
    }
  }

  // Frequency-swept steam & harmonic chord for portal curtain transitions
  playPortalWipe() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Filtered white noise burst (espresso steam hiss)
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, now);
      bandpass.frequency.exponentialRampToValueAtTime(2200, now + 0.22);
      bandpass.frequency.exponentialRampToValueAtTime(480, now + 0.44);
      bandpass.Q.value = 2.4;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.055, now + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Warm sub-harmonic sweep
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      sub.frequency.exponentialRampToValueAtTime(98, now + 0.42);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.06, now + 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.43);
    } catch {
      // Ignore
    }
  }

  // Thermal shader mode switch chord
  playRoastShift(modeIndex = 0) {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        [330, 415.3, 493.88, 659.25], // Light Floral (E major 7 bright)
        [261.63, 329.63, 392.0, 493.88], // Medium Caramel (C major 7 warm)
        [196.0, 246.94, 293.66, 369.99], // Dark Obsidian (G major 7 deep)
      ];
      const freqs = chords[modeIndex % chords.length];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.025);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.025);
        gain.gain.linearRampToValueAtTime(0.026, now + idx * 0.025 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 0.36);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.38);
      });
    } catch {
      // Ignore
    }
  }

  // Harmonious chime when adding to bag or completing action
  playSuccess() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.045 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.3);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
