// Beda Gambar! — the staged scenes behind ?shot=cover|title|city|win. Each one sets the real
// state to a fixed, hand-picked moment (never random), so the same URL always renders the
// same frame: the cover shows a level mid-hunt with markers found and several still hidden.

import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_CLEAR, SCREEN_WIN, SCREEN_OVER } from './state.js';

/** Put `state` into the named scene and return the screen to draw. */
export function stageShot(name, state) {
  if (name === 'title') {
    state.screen = SCREEN_TITLE;
    state.levelIndex = 0;
    return SCREEN_TITLE;
  }
  if (name === 'city') {
    // Level 2 mid-hunt: two found, five still hidden, timer running.
    state.startLevel(1);
    state.found = new Set([0, 3]);
    state.score = 215;
    state.combo = 2;
    state.timeLeft = 74;
    state.screen = SCREEN_PLAY;
    state.setMessage('Ketemu! Warna mobil (+115) — sisa 5', 60);
    return SCREEN_PLAY;
  }
  if (name === 'over') {
    // The game-over screen: time ran out with three differences still hidden.
    state.startLevel(2);
    state.found = new Set([0, 1, 2, 5]);
    state.score = 460;
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    return SCREEN_OVER;
  }
  if (name === 'win') {
    // The win screen after all three levels, with a final tally.
    state.startLevel(2);
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 940;
    state.totalScore = 2840;
    state.bestCombo = 5;
    state.screen = SCREEN_WIN;
    return SCREEN_WIN;
  }
  if (name === 'clear') {
    state.startLevel(0);
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 805;
    state.levelBonus = 320;
    state.totalScore = 1125;
    state.bestCombo = 4;
    state.screen = SCREEN_CLEAR;
    return SCREEN_CLEAR;
  }
  // Default: the cover. Level 1 mid-hunt: three found (markers on both pictures), four still
  // hidden, counter reading "Ditemukan 3 dari 7 • Sisa 4".
  state.startLevel(0);
  state.found = new Set([0, 2, 4]);
  state.score = 350;
  state.combo = 2;
  state.timeLeft = 87;
  state.screen = SCREEN_PLAY;
  state.setMessage('Ketemu! Kucing di bangku (+115) — sisa 4', 60);
  return SCREEN_PLAY;
}
