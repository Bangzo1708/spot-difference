// Beda Gambar! — bootstrap: size the canvas, wire input and sound, stage a screenshot scene
// when ?shot= is present, then run the loop (tick the timer, age the effects, draw the frame).

import { VIEW } from './config.js';
import { SpotState } from './state.js';
import { draw } from './render.js';
import { attachInput } from './input.js';
import { SoundBank } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = VIEW.width;
canvas.height = VIEW.height;
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const state = new SpotState();
const sound = new SoundBank();
sound.muted = state.muted;
attachInput(canvas, state, sound);

const params = new URLSearchParams(window.location.search);
if (params.has('shot')) {
  stageShot(params.get('shot'), state);
}

// Exposed for play-testing from the console: window.__bedaGambar.state.
window.__bedaGambar = { state, sound };

// Mirror the live state into the aria-live status line (screen readers, and a DOM hook
// for automated play-tests): "play | level 1 | found 3/7 | score 350 | time 87".
let lastStatus = '';
function syncStatus() {
  const text = `${state.screen} | level ${state.levelIndex + 1} | found ${state.foundCount}/${state.scene.differences.length} | score ${state.score} | total ${state.totalScore} | time ${Math.ceil(state.timeLeft)}`;
  if (text !== lastStatus) {
    lastStatus = text;
    statusEl.textContent = text;
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  state.tick(dt);
  state.updateEffects(dt);
  draw(ctx, state, now / 1000);
  syncStatus();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
