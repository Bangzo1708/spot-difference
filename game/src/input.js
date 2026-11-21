// Beda Gambar! — mouse and keyboard input: clicks on pictures and buttons, and the
// shortcuts (Enter start, H hint, R restart, M mute, N next). One job only: translating a
// pointer or key press into a call on the state, then playing the matching sound.

import { canvasToScene } from './config.js';
import { hitAreas } from './render.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_CLEAR, SCREEN_WIN, SCREEN_OVER } from './state.js';

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function inside(point, area) {
  return (
    point.x >= area.x &&
    point.x <= area.x + area.w &&
    point.y >= area.y &&
    point.y <= area.y + area.h
  );
}

export function attachInput(canvas, state, sound) {
  canvas.addEventListener('pointerdown', (event) => {
    const point = canvasPoint(canvas, event);
    const areas = hitAreas(state);
    for (const area of areas) {
      if (!inside(point, area)) continue;
      if (area.id === 'start' || area.id === 'again') {
        sound.ensure();
        sound.click();
        state.startGame();
        return;
      }
      if (area.id.startsWith('level-')) {
        sound.ensure();
        sound.click();
        state.startGame();
        state.startLevel(Number(area.id.slice('level-'.length)));
        return;
      }
      if (area.id === 'next') {
        sound.ensure();
        sound.click();
        state.nextLevel();
        return;
      }
      if (area.id === 'hint') {
        const result = state.useHint();
        if (result === 'hint') sound.hint();
        else sound.click();
        return;
      }
      if (area.id === 'mute') {
        state.muted = !state.muted;
        sound.muted = state.muted;
        sound.click();
        return;
      }
      if (area.id === 'restart') {
        sound.click();
        state.startLevel(state.levelIndex);
        return;
      }
    }
    if (state.screen !== SCREEN_PLAY) return;
    const hit = canvasToScene(point.x, point.y);
    if (!hit) return;
    sound.ensure();
    const result = state.clickAt(hit.x, hit.y);
    if (result === 'found') sound.found();
    else if (result === 'wrong') sound.wrong();
    else sound.click();
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      if (state.screen === SCREEN_TITLE) {
        sound.ensure();
        state.startGame();
      } else if (state.screen === SCREEN_CLEAR) {
        state.nextLevel();
      } else if (state.screen === SCREEN_WIN || state.screen === SCREEN_OVER) {
        state.startGame();
      }
      event.preventDefault();
    } else if (key === 'h') {
      if (state.screen === SCREEN_PLAY && state.useHint() === 'hint') sound.hint();
    } else if (key === 'r') {
      if (state.screen === SCREEN_PLAY) state.startLevel(state.levelIndex);
      else if (state.screen === SCREEN_WIN || state.screen === SCREEN_OVER) state.startGame();
    } else if (key === 'm') {
      state.muted = !state.muted;
      sound.muted = state.muted;
    } else if (key === 'n') {
      if (state.screen === SCREEN_CLEAR) state.nextLevel();
    }
  });
}
