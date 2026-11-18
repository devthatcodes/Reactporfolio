// Procedural Web Audio API Institutional Synth Engine
// Generates crystalline hover ticks, sub-bass portal sweeps, card gyro hums, and confirmation chords

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.listeners = new Set();
    this.ambientGain = null;
    this.ambientOsc = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.initContext();
      this.playConfirm();
    }
    this.notify();
    return this.enabled;
  }

  // High-precision crystalline tick on hover
  playHover(pitchMultiplier = 1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      const baseFreq = 1480 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio errors when not interacted
    }
  }

  // Crisp cybernetic click for buttons / toggles
  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.07);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Deep Active-Theory style sub-bass + harmonic sweep for portal/curtain transitions
  playPortal() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Sub-bass drop sweep
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.48);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.14, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.55);

      // High crystalline shimmer chord
      [880, 1318.5, 1760].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.85, now + idx * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.35 + idx * 0.03);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(0.025, now + 0.08 + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45 + idx * 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + 0.48 + idx * 0.03);
      });
    } catch {}
  }

  // Institutional confirmation pulse (e.g. FX lock, settlement execution)
  playConfirm() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880, 1174.66]; // D5, A5, D6 fifth interval chord
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.045);

        gain.gain.setValueAtTime(0.0001, now + i * 0.045);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.045 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.35);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
