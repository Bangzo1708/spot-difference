// Beda Gambar! — everything on screen: the HUD, the two picture panels with their markers,
// the bottom controls and the title / clear / win / game-over overlays.
// One job only: drawing. It reads the state and never changes it.

import { VIEW, PANELS, SCENE, LEVELS, POINTS, COLOURS, panelSceneRect, sceneToCanvas } from './config.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_CLEAR, SCREEN_WIN, SCREEN_OVER } from './state.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, fill, align = 'center', weight = 'bold') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function button(ctx, rect, label, enabled = true) {
  ctx.fillStyle = enabled ? COLOURS.accent : '#555b70';
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.strokeStyle = enabled ? COLOURS.accentDark : '#3a3f55';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1, 17, COLOURS.ink);
}

/** Clickable rectangles for the current screen, in canvas coordinates. */
export function hitAreas(state) {
  const areas = [];
  if (state.screen === SCREEN_TITLE) {
    areas.push({ id: 'start', x: 490, y: 470, w: 300, h: 62 });
    LEVELS.forEach((level, i) => {
      areas.push({ id: `level-${i}`, x: 380 + i * 180, y: 560, w: 160, h: 44 });
    });
  } else if (state.screen === SCREEN_PLAY) {
    areas.push({ id: 'hint', x: 1060, y: 615, w: 200, h: 52 });
    areas.push({ id: 'mute', x: 840, y: 615, w: 200, h: 52 });
    areas.push({ id: 'restart', x: 620, y: 615, w: 200, h: 52 });
  } else if (state.screen === SCREEN_CLEAR) {
    areas.push({ id: 'next', x: 490, y: 470, w: 300, h: 62 });
  } else if (state.screen === SCREEN_WIN || state.screen === SCREEN_OVER) {
    areas.push({ id: 'again', x: 490, y: 480, w: 300, h: 62 });
  }
  return areas;
}

function drawPanelFrame(ctx, side, label) {
  const x = side === 0 ? PANELS.leftX : PANELS.rightX;
  ctx.strokeStyle = COLOURS.panelEdge;
  ctx.lineWidth = 4;
  ctx.strokeRect(x - 2, PANELS.y - 2, PANELS.width + 4, PANELS.height + 4);
  ctx.fillStyle = COLOURS.hud;
  roundRect(ctx, x, PANELS.y - 30, 150, 24, 8);
  ctx.fill();
  text(ctx, label, x + 75, PANELS.y - 17, 14, '#fff');
}

function drawFoundMarker(ctx, side, diff, pulse) {
  const p = sceneToCanvas(side, diff.x, diff.y);
  const r = diff.r * 0.62 + pulse * 4;
  ctx.strokeStyle = COLOURS.good;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  text(ctx, '✓', p.x, p.y + 1, Math.max(16, r), COLOURS.good);
}

function drawHintRing(ctx, side, diff, now) {
  const p = sceneToCanvas(side, diff.x, diff.y);
  const pulse = 6 + 4 * Math.sin(now * 6);
  ctx.strokeStyle = COLOURS.hint;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(p.x, p.y, diff.r * 0.7 + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawWrongMark(ctx, side, effect) {
  const p = sceneToCanvas(side, effect.x, effect.y);
  const alpha = Math.max(0, 1 - effect.age / 1.2);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = COLOURS.bad;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(p.x - 12, p.y - 12);
  ctx.lineTo(p.x + 12, p.y + 12);
  ctx.moveTo(p.x + 12, p.y - 12);
  ctx.lineTo(p.x - 12, p.y + 12);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawPanels(ctx, state, now, dimmed) {
  const scene = state.scene;
  for (let side = 0; side < 2; side += 1) {
    const rect = panelSceneRect(side);
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
    ctx.translate(rect.x, rect.y);
    ctx.scale(rect.scale, rect.scale);
    scene.paint(ctx, side);
    ctx.restore();
    drawPanelFrame(ctx, side, side === 0 ? 'GAMBAR A' : 'GAMBAR B');
  }
  if (dimmed) {
    ctx.fillStyle = 'rgba(16, 20, 42, 0.55)';
    ctx.fillRect(0, PANELS.y, VIEW.width, PANELS.height);
    return;
  }
  // Markers on the differences already found, on both pictures.
  state.scene.differences.forEach((diff, i) => {
    if (!state.found.has(i)) return;
    const effect = state.effects.find((e) => e.kind === 'found' && e.diff === i);
    const pulse = effect ? Math.max(0, 1 - effect.age / 0.6) : 0;
    drawFoundMarker(ctx, 0, diff, pulse);
    drawFoundMarker(ctx, 1, diff, pulse);
  });
  // Hint flash, on both pictures.
  if (state.hintFlash) {
    const diff = state.scene.differences[state.hintFlash.diff];
    drawHintRing(ctx, 0, diff, now);
    drawHintRing(ctx, 1, diff, now);
  }
  // Wrong-click crosses, on the panel that was clicked.
  for (const e of state.effects) {
    if (e.kind === 'wrong') {
      drawWrongMark(ctx, 0, e);
      drawWrongMark(ctx, 1, e);
    }
  }
  // Floating "+100" texts.
  for (const e of state.effects) {
    if (e.kind !== 'found') continue;
    const diff = state.scene.differences[e.diff];
    const p = sceneToCanvas(0, diff.x, diff.y - diff.r - 8 - e.age * 30);
    ctx.globalAlpha = Math.max(0, 1 - e.age / 1.1);
    text(ctx, `+${e.gained}`, p.x, p.y, 22, COLOURS.accent);
    ctx.globalAlpha = 1;
  }
}

function drawHud(ctx, state) {
  ctx.fillStyle = COLOURS.hud;
  ctx.fillRect(0, 0, VIEW.width, 84);
  ctx.fillStyle = COLOURS.accent;
  ctx.fillRect(0, 84, VIEW.width, 4);
  text(ctx, 'BEDA GAMBAR!', 24, 30, 28, COLOURS.accent, 'left');
  text(ctx, `Level ${state.levelIndex + 1} — ${state.level.name}`, 24, 62, 15, '#cdd3ea', 'left');
  // Counter: the heart of the game, big and central.
  const found = state.foundCount;
  const total = state.scene.differences.length;
  text(ctx, `Ditemukan ${found} dari ${total}  •  Sisa ${state.remaining}`, 640, 28, 24, '#fff');
  // Progress dots.
  for (let i = 0; i < total; i += 1) {
    const x = 640 - (total * 26) / 2 + i * 26 + 13;
    ctx.fillStyle = state.found.has(i) ? COLOURS.good : '#4a5170';
    ctx.beginPath();
    ctx.arc(x, 62, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  // Timer bar + score.
  const frac = Math.max(0, state.timeLeft / state.level.time);
  ctx.fillStyle = '#12152e';
  roundRect(ctx, 980, 22, 220, 16, 8);
  ctx.fill();
  if (frac > 0) {
    ctx.fillStyle = frac > 0.33 ? COLOURS.good : COLOURS.bad;
    roundRect(ctx, 980, 22, 220 * frac, 16, 8);
    ctx.fill();
  }  text(ctx, `${Math.ceil(state.timeLeft)} dtk`, 1090, 52, 16, '#fff');
  text(ctx, `Skor ${state.score}`, 1230, 30, 22, '#fff', 'right');
  text(ctx, `Total ${state.totalScore}`, 1230, 58, 14, '#cdd3ea', 'right');
  if (state.combo >= 2) {
    text(ctx, `Kombo x${state.combo}!`, 1230, 76, 14, COLOURS.accent, 'right');
  }
}

function drawLevelStrip(ctx, state) {
  ctx.fillStyle = COLOURS.hud;
  ctx.fillRect(0, 500, VIEW.width, 220);
  ctx.fillStyle = COLOURS.accent;
  ctx.fillRect(0, 500, VIEW.width, 3);
  LEVELS.forEach((level, i) => {
    const x = 60 + i * 34;
    ctx.fillStyle = i < state.levelIndex ? COLOURS.good : i === state.levelIndex ? COLOURS.accent : '#4a5170';
    ctx.beginPath();
    ctx.arc(x, 530, 11, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, String(i + 1), x, 531, 13, COLOURS.ink);
  });
  text(ctx, state.level.tagline, 170, 530, 15, '#cdd3ea', 'left');
}

function drawBottomBar(ctx, state) {
  ctx.fillStyle = COLOURS.hud;
  ctx.fillRect(0, 500, VIEW.width, 220);
  ctx.fillStyle = COLOURS.accent;
  ctx.fillRect(0, 500, VIEW.width, 3);
  // Level dots.
  LEVELS.forEach((level, i) => {
    const x = 60 + i * 34;
    ctx.fillStyle = i < state.levelIndex ? COLOURS.good : i === state.levelIndex ? COLOURS.accent : '#4a5170';
    ctx.beginPath();
    ctx.arc(x, 530, 11, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, String(i + 1), x, 531, 13, COLOURS.ink);
  });
  text(ctx, state.level.tagline, 170, 530, 15, '#cdd3ea', 'left');
  // Message line.
  const now = performance.now() / 1000;
  const msg = now < state.messageUntil ? state.message : 'Klik perbedaan di salah satu gambar — klik kanan juga boleh!';
  text(ctx, msg, 640, 530, 17, '#fff');
  // Buttons.
  const areas = hitAreas(state);
  const hint = areas.find((a) => a.id === 'hint');
  const mute = areas.find((a) => a.id === 'mute');
  const restart = areas.find((a) => a.id === 'restart');
  if (hint) button(ctx, hint, `Hint (${state.hintsLeft})  [H]`, state.hintsLeft > 0);
  if (mute) button(ctx, mute, state.muted ? 'Suara: Mati  [M]' : 'Suara: Nyala  [M]');
  if (restart) button(ctx, restart, 'Ulang Level  [R]');
}

function drawOverlayCard(ctx, y, h) {
  ctx.fillStyle = 'rgba(10, 13, 30, 0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = COLOURS.paper;
  roundRect(ctx, 340, y, 600, h, 18);
  ctx.fill();
  ctx.strokeStyle = COLOURS.accent;
  ctx.lineWidth = 4;
  ctx.stroke();
}

export function draw(ctx, state, now) {
  ctx.fillStyle = COLOURS.sky;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  const screen = state.screen;
  if (screen === SCREEN_TITLE) {
    drawPanels(ctx, state, now, true);
    drawOverlayCard(ctx, 130, 400);
    text(ctx, 'BEDA GAMBAR!', 640, 185, 52, COLOURS.ink);
    text(ctx, 'Cari 7 perbedaan di dua gambar yang nyaris sama', 640, 235, 19, '#495057');
    text(ctx, 'Klik perbedaan yang kamu temukan — di gambar A atau B.', 640, 268, 16, '#6c757d');
    text(ctx, 'Klik yang salah: -25 poin & -3 detik. Hint (H): -50 poin.', 640, 296, 16, '#6c757d');
    text(ctx, '3 level: Taman Senja • Kota Neon • Stasiun Angkasa', 640, 330, 16, '#6c757d');
    const areas = hitAreas(state);
    button(ctx, areas.find((a) => a.id === 'start'), '▶  MULAI BERMAIN');
    text(ctx, 'atau pilih level:', 640, 548, 14, '#6c757d');
    LEVELS.forEach((level, i) => {
      button(ctx, areas.find((a) => a.id === `level-${i}`), level.name);
    });
    text(ctx, 'Enter = mulai • game jalan offline, tanpa internet', 640, 686, 14, '#8a91b5');
    return;
  }
  drawHud(ctx, state);
  drawPanels(ctx, state, now, false);
  if (screen === SCREEN_PLAY) {
    drawBottomBar(ctx, state);
    return;
  }
  drawLevelStrip(ctx, state);
  if (screen === SCREEN_CLEAR) {
    drawOverlayCard(ctx, 150, 330);
    text(ctx, 'LEVEL SELESAI!', 640, 205, 40, COLOURS.goodDark);
    text(ctx, `Semua 7 perbedaan di ${state.level.name} ketemu!`, 640, 255, 18, '#495057');
    text(ctx, `Skor level ${state.score}  +  bonus waktu ${state.levelBonus}  =  ${state.score + state.levelBonus}`, 640, 295, 19, COLOURS.ink);
    text(ctx, `Total skor: ${state.totalScore}   •   Kombo terbaik: x${state.bestCombo}`, 640, 330, 16, '#6c757d');
    const next = hitAreas(state).find((a) => a.id === 'next');
    button(ctx, next, state.levelIndex + 1 < LEVELS.length ? 'LANJUT ▶  [N]' : 'LIHAT HASIL ▶  [N]');
    text(ctx, 'N = lanjut • R = ulang level', 640, 686, 14, '#8a91b5');
  } else if (screen === SCREEN_WIN) {
    drawOverlayCard(ctx, 140, 360);
    text(ctx, 'KAMU MENANG!', 640, 195, 44, COLOURS.accentDark);
    text(ctx, 'Ketiga level selesai — mata elang sejati!', 640, 248, 19, '#495057');
    text(ctx, `Skor akhir: ${state.totalScore}`, 640, 295, 26, COLOURS.ink);
    text(ctx, `Kombo terbaik: x${state.bestCombo}`, 640, 332, 16, '#6c757d');
    text(ctx, 'Terima kasih sudah bermain Beda Gambar!', 640, 362, 16, '#6c757d');
    const again = hitAreas(state).find((a) => a.id === 'again');
    button(ctx, again, 'MAIN LAGI  [R]');
    text(ctx, 'R = main lagi dari level 1', 640, 686, 14, '#8a91b5');
  } else if (screen === SCREEN_OVER) {
    drawOverlayCard(ctx, 150, 330);
    text(ctx, 'WAKTU HABIS!', 640, 205, 40, COLOURS.bad);
    text(ctx, `Di ${state.level.name} kamu menemukan ${state.foundCount} dari 7 perbedaan.`, 640, 255, 18, '#495057');
    text(ctx, `Sisa ${state.remaining} perbedaan belum ketemu — coba lagi!`, 640, 295, 18, '#495057');
    text(ctx, `Skor level: ${state.score}`, 640, 330, 16, '#6c757d');
    const again = hitAreas(state).find((a) => a.id === 'again');
    button(ctx, again, 'COBA LAGI  [R]');
    text(ctx, 'R = coba lagi level ini', 640, 686, 14, '#8a91b5');
  }
}
