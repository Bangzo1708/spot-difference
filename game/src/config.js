// Beda Gambar! — shared constants: canvas size, panel geometry, levels and scoring.
// One job only: numbers every other module reads, so a tweak here retunes the whole game.

export const VIEW = { width: 1280, height: 720 };

/** A scene is painted in this logical space, then scaled into a panel. */
export const SCENE = { width: 640, height: 400 };

/** The two picture panels: same size, side by side under the HUD. */
export const PANELS = {
  y: 96,
  width: 600,
  height: 380,
  leftX: 20,
  rightX: 660,
};

/** Scale a scene into a panel (letterboxed, so the picture never stretches). */
export function panelScale() {
  return Math.min(PANELS.width / SCENE.width, PANELS.height / SCENE.height);
}

/** Where one scene is drawn inside its panel, in canvas coordinates. */
export function panelSceneRect(side) {
  const scale = panelScale();
  const width = SCENE.width * scale;
  const height = SCENE.height * scale;
  const x = side === 0 ? PANELS.leftX : PANELS.rightX;
  const y = PANELS.y + (PANELS.height - height) / 2;
  return { x, y, width, height, scale };
}

/** Canvas point -> scene point (or null when the click misses both panels). */
export function canvasToScene(px, py) {
  for (let side = 0; side < 2; side += 1) {
    const rect = panelSceneRect(side);
    if (px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height) {
      return { side, x: (px - rect.x) / rect.scale, y: (py - rect.y) / rect.scale };
    }
  }
  return null;
}

/** Scene point -> canvas point inside one panel. */
export function sceneToCanvas(side, sx, sy) {
  const rect = panelSceneRect(side);
  return { x: rect.x + sx * rect.scale, y: rect.y + sy * rect.scale };
}

/** The three rounds: same hunt, harder scenes and less time as you go. */
export const LEVELS = [
  { id: 'garden', name: 'Taman Senja', tagline: 'Taman di senja hari — 7 perbedaan', time: 120 },
  { id: 'city', name: 'Kota Neon', tagline: 'Kota di malam hari — 7 perbedaan', time: 100 },
  { id: 'space', name: 'Stasiun Angkasa', tagline: 'Stasiun luar angkasa — 7 perbedaan', time: 90 },
];

export const POINTS = {
  find: 100,
  comboStep: 15,
  hintCost: 50,
  wrongPenalty: 25,
  timeBonus: 5,
  hintsPerLevel: 3,
};

export const COLOURS = {
  ink: '#1d2433',
  paper: '#fff8e7',
  hud: '#20263a',
  hudEdge: '#3a4364',
  accent: '#ffb703',
  accentDark: '#e07b00',
  good: '#2fbf71',
  goodDark: '#1d7a48',
  bad: '#ef476f',
  hint: '#ffd60a',
  panelEdge: '#10142a',
  sky: '#2b2d5c',
};
