// Procedural Web Audio API Sound Engine — Zero external audio assets
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.listeners = new Set();
    this.lastHoverTime = 0;
  }

  init() {
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

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.muted));
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (!this.muted) {
      this.playClick();
    }
    this.notify();
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Subtle high-tech cybernetic chirp on hover
  playHover() {
    if (this.muted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 45) return;
    this.lastHoverTime = nowMs;

    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1240, t);
      osc.frequency.exponentialRampToValueAtTime(1880, t + 0.042);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.setValueAtTime(4, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.025, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.052);
    } catch {
      // Ignore audio context autoplay errors prior to gesture
    }
  }

  // Crisp mechanical lock + harmonic sub-pulse on click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // High transient click
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(680, t);
      osc1.frequency.exponentialRampToValueAtTime(220, t + 0.065);

      gain1.gain.setValueAtTime(0.001, t);
      gain1.gain.linearRampToValueAtTime(0.055, t + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.075);

      // Harmonic overtone ping
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2150, t + 0.01);
      osc2.frequency.exponentialRampToValueAtTime(2680, t + 0.08);

      gain2.gain.setValueAtTime(0.0001, t + 0.01);
      gain2.gain.linearRampToValueAtTime(0.02, t + 0.018);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(t + 0.01);
      osc2.stop(t + 0.095);
    } catch {
      // Ignore
    }
  }

  // Deep sci-fi portal warp sweep on transition / takeover
  playTransition() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Sub-bass frequency sweep
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(75, t);
      sub.frequency.exponentialRampToValueAtTime(210, t + 0.22);
      sub.frequency.exponentialRampToValueAtTime(52, t + 0.55);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(240, t);
      lp.frequency.exponentialRampToValueAtTime(1100, t + 0.22);
      lp.frequency.exponentialRampToValueAtTime(160, t + 0.55);

      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.048, t + 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.58);

      sub.connect(lp);
      lp.connect(subGain);
      subGain.connect(this.ctx.destination);

      sub.start(t);
      sub.stop(t + 0.6);

      // Shimmering crystalline arpeggio chord
      const freqs = [528, 792, 1056, 1584];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        const start = t + idx * 0.045;
        osc.frequency.setValueAtTime(f, start);
        osc.frequency.exponentialRampToValueAtTime(f * 1.12, start + 0.28);

        g.gain.setValueAtTime(0.0001, start);
        g.gain.linearRampToValueAtTime(0.014, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
export const playHover = () => soundEngine.playHover();
export const playClick = () => soundEngine.playClick();
export const playTransition = () => soundEngine.playTransition();
export const toggleMute = () => soundEngine.toggleMute();
