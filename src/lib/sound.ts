// Pure Web Audio API Sound Synthesizer (Zero External Audio Files)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sound_enabled");
      this.isEnabled = saved !== null ? saved === "true" : true;
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("sound_enabled", String(this.isEnabled));
      window.dispatchEvent(new CustomEvent("sound_toggle", { detail: this.isEnabled }));
    }
    if (this.isEnabled) {
      this.playHover();
    }
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // 1. Mechanical Keyboard Click (Tactile pitch-shifted impulse)
  public playClick(pitchMultiplier: number = 1.0) {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(450 * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // 2. Cybernetic Hover Blip (High-frequency resonant blip)
  public playHover() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.03);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 3. Nodal Circuit Pulse / Hum
  public playNodePulse() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // 4. Success Harmonic Chime (Two-tone chord)
  public playSuccess() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.08, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.25);
    });
  }

  // 5. Security Constraint Lock / Error Buzz
  public playError() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.06);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // 6. Procedural Liquid Coffee Sip & Gulp (100% Web Audio Synthesized)
  public playSip() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    try {
      // Layer 1: Filtered Noise Sweep (Liquid Inhale / Slurp)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.32);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.setValueAtTime(3.2, t);
      bandpass.frequency.setValueAtTime(600, t);
      bandpass.frequency.exponentialRampToValueAtTime(2600, t + 0.28);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.30);

      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(t);
      noiseSource.stop(t + 0.32);

      // Layer 2: Resonant Throat / Ceramic Swallow Gulp
      const gulpOsc = this.ctx.createOscillator();
      const gulpGain = this.ctx.createGain();

      gulpOsc.type = "sine";
      gulpOsc.frequency.setValueAtTime(300, t + 0.16);
      gulpOsc.frequency.exponentialRampToValueAtTime(130, t + 0.30);

      gulpGain.gain.setValueAtTime(0.001, t);
      gulpGain.gain.setValueAtTime(0.001, t + 0.16);
      gulpGain.gain.linearRampToValueAtTime(0.12, t + 0.20);
      gulpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      gulpOsc.connect(gulpGain);
      gulpGain.connect(this.ctx.destination);

      gulpOsc.start(t + 0.16);
      gulpOsc.stop(t + 0.32);
    } catch {
      // Fallback simple click if noise buffer fails on unsupported envs
      this.playClick(0.9);
    }
  }

  // 7. Ceramic Clink / Empty Mug Tap
  public playClink() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }
}


export const sound = new SoundEngine();
