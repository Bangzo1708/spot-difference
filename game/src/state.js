// Beda Gambar! — the game state: screens, scoring, timer, hints and click verdicts.
// One job only: rules. It never draws anything and never touches the DOM.

import { LEVELS, POINTS } from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export class SpotState {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.totalScore = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.timeLeft = LEVELS[0].time;
    this.hintsLeft = POINTS.hintsPerLevel;
    this.muted = false;
    this.message = 'Klik MULAI, lalu cari 7 perbedaan di dua gambar!';
    this.messageUntil = 0;
    this.effects = [];
    this.hintFlash = null;
    this.levelBonus = 0;
    this.lastTick = 0;
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get remaining() {
    return this.scene.differences.length - this.found.size;
  }

  startGame() {
    this.totalScore = 0;
    this.startLevel(0);
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.timeLeft = this.level.time;
    this.hintsLeft = POINTS.hintsPerLevel;
    this.effects = [];
    this.hintFlash = null;
    this.levelBonus = 0;
    this.screen = SCREEN_PLAY;
    this.setMessage(`Level ${index + 1}: ${this.level.name} — cari 7 perbedaan!`);
  }

  setMessage(text, seconds = 4) {
    this.message = text;
    this.messageUntil = performance.now() / 1000 + seconds;
  }

  /** A click inside a picture, in scene coordinates. Returns what happened. */
  clickAt(sx, sy) {
    if (this.screen !== SCREEN_PLAY) return 'idle';
    const diffs = this.scene.differences;
    for (let i = 0; i < diffs.length; i += 1) {
      const d = diffs[i];
      const dx = sx - d.x;
      const dy = sy - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        if (this.found.has(i)) return 'already';
        this.found.add(i);
        this.combo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        const gained = POINTS.find + (this.combo - 1) * POINTS.comboStep;
        this.score += gained;
        this.effects.push({ kind: 'found', diff: i, age: 0, gained });
        this.setMessage(`Ketemu! ${d.name} (+${gained}) — sisa ${this.remaining}`, 2.5);
        if (this.found.size === diffs.length) this.clearLevel();
        return 'found';
      }
    }
    this.combo = 0;
    this.score = Math.max(0, this.score - POINTS.wrongPenalty);
    this.timeLeft = Math.max(0, this.timeLeft - 3);
    this.effects.push({ kind: 'wrong', x: sx, y: sy, age: 0 });
    this.setMessage('Bukan di situ! -25 poin, -3 detik. Perhatikan baik-baik.', 2.5);
    return 'wrong';
  }

  clearLevel() {
    this.levelBonus = Math.round(this.timeLeft) * POINTS.timeBonus;
    this.totalScore += this.score + this.levelBonus;
    this.screen = SCREEN_CLEAR;
    this.setMessage(`Level selesai! Bonus waktu +${this.levelBonus}`, 6);
  }

  nextLevel() {
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.screen = SCREEN_WIN;
      return;
    }
    this.startLevel(this.levelIndex + 1);
  }

  useHint() {
    if (this.screen !== SCREEN_PLAY) return null;
    if (this.hintsLeft <= 0) {
      this.setMessage('Hint habis! Cari sendiri, kamu pasti bisa.', 2.5);
      return 'none';
    }
    const unfound = this.scene.differences
      .map((d, i) => i)
      .filter((i) => !this.found.has(i));
    if (unfound.length === 0) return null;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - POINTS.hintCost);
    this.hintFlash = { diff: pick, until: performance.now() / 1000 + 2.2 };
    this.setMessage(`Hint: lihat baik-baik area yang berkedip! (-${POINTS.hintCost})`, 2.5);
    return 'hint';
  }

  tick(dt) {
    if (this.screen !== SCREEN_PLAY) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
      this.setMessage('Waktu habis!', 6);
    }
  }

  updateEffects(dt) {
    for (const e of this.effects) e.age += dt;
    this.effects = this.effects.filter((e) => e.age < 1.2);
    if (this.hintFlash && performance.now() / 1000 > this.hintFlash.until) this.hintFlash = null;
  }
}
