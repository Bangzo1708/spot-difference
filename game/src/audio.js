// Beda Gambar! — tiny synthesized sounds, no audio files: a chime for a find, a buzz for a
// miss, a little arpeggio for a win. The context is created on the first user gesture, so the
// game stays silent until the player interacts.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (err) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, at, dur, type, vol) {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(vol, this.ctx.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + at);
    osc.stop(this.ctx.currentTime + at + dur + 0.05);
  }

  click() {
    if (!this.ensure()) return;
    this.tone(660, 0, 0.07, 'sine', 0.08);
  }

  found() {
    if (!this.ensure()) return;
    this.tone(523, 0, 0.14, 'triangle', 0.16);
    this.tone(784, 0.09, 0.2, 'triangle', 0.16);
  }

  wrong() {
    if (!this.ensure()) return;
    this.tone(160, 0, 0.18, 'sawtooth', 0.07);
  }

  hint() {
    if (!this.ensure()) return;
    this.tone(880, 0, 0.1, 'sine', 0.1);
    this.tone(1175, 0.08, 0.12, 'sine', 0.1);
  }

  win() {
    if (!this.ensure()) return;
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.24, 'triangle', 0.15));
  }

  over() {
    if (!this.ensure()) return;
    [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.26, 'triangle', 0.12));
  }
}
