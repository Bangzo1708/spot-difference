// Beda Gambar! — the three scenes. Each painter draws the same picture twice: side 0 is the
// original, side 1 is the altered twin. A difference is one hotspot {x, y, r, name} in scene
// coordinates plus the branch inside the painter that changes that spot on the right panel.
// Nothing here is copied from anywhere: every shape is drawn from scratch with canvas paths.

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function text(ctx, str, x, y, size, fill, align = 'center', weight = 'bold') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------------------
// Level 1 — Taman Senja (garden at dusk). Warm, busy, easiest to read: the hero scene.
// ---------------------------------------------------------------------------
function paintGarden(ctx, side) {
  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#ff9e5e');
  sky.addColorStop(0.55, '#f76d8a');
  sky.addColorStop(1, '#7b5ea7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 400);
  // Sun with rays — difference 1: the right sun lost half its rays.
  circle(ctx, 82, 66, 34, '#ffd60a');
  ctx.strokeStyle = '#ffd60a';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const rays = side === 1 ? 4 : 8;
  for (let i = 0; i < rays; i += 1) {
    const a = (i * Math.PI * 2) / 8;
    ctx.beginPath();
    ctx.moveTo(82 + Math.cos(a) * 44, 66 + Math.sin(a) * 44);
    ctx.lineTo(82 + Math.cos(a) * 58, 66 + Math.sin(a) * 58);
    ctx.stroke();
  }
  // Clouds — difference 2: the middle cloud is gone on the right.
  ellipse(ctx, 210, 58, 46, 18, '#fff3e0');
  ellipse(ctx, 236, 50, 34, 15, '#fff3e0');
  if (side === 0) {
    ellipse(ctx, 330, 74, 42, 16, '#ffe8d6');
    ellipse(ctx, 352, 66, 30, 13, '#ffe8d6');
  }
  ellipse(ctx, 480, 46, 40, 15, '#fff3e0');
  // Bird — difference 7: the high bird is missing on the right.
  if (side === 0) {
    ctx.strokeStyle = '#3d2b4f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(520, 74, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(538, 74, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3d2b4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(560, 110, 9, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(576, 110, 9, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  // Rolling hills.
  ellipse(ctx, 120, 400, 260, 90, '#5da271');
  ellipse(ctx, 520, 410, 300, 100, '#4c8a5f');
  // Big tree — difference 3: two of the five apples are missing on the right.
  rect(ctx, 148, 210, 22, 110, '#7a4a2b');
  circle(ctx, 159, 165, 78, '#2f9e44');
  circle(ctx, 110, 195, 48, '#37b24d');
  circle(ctx, 208, 195, 48, '#2f9e44');
  circle(ctx, 130, 150, 12, '#e03131');
  circle(ctx, 185, 140, 12, '#e03131');
  circle(ctx, 205, 180, 12, '#e03131');
  if (side === 0) {
    circle(ctx, 150, 195, 12, '#e03131');
    circle(ctx, 185, 205, 12, '#e03131');
  }
  // Pond with ducks — difference 6: one duck is gone on the right.
  ellipse(ctx, 520, 345, 105, 38, '#4dabf7');
  ellipse(ctx, 520, 345, 88, 28, '#74c0fc');
  ellipse(ctx, 495, 340, 16, 11, '#fff');
  circle(ctx, 512, 332, 9, '#fff');
  circle(ctx, 515, 330, 2, '#1d2433');
  poly(ctx, [[520, 332], [528, 335], [520, 338]], '#f08c00');
  if (side === 0) {
    ellipse(ctx, 555, 352, 14, 10, '#fff');
    circle(ctx, 570, 345, 8, '#fff');
    circle(ctx, 573, 343, 2, '#1d2433');
    poly(ctx, [[577, 345], [584, 347], [577, 350]], '#f08c00');
  }
  // Bench with a cat — difference 5: the cat went home on the right.
  rect(ctx, 430, 268, 110, 10, '#8d5a2b');
  rect(ctx, 430, 288, 110, 10, '#8d5a2b');
  rect(ctx, 438, 278, 8, 44, '#6b4423');
  rect(ctx, 524, 278, 8, 44, '#6b4423');
  if (side === 0) {
    ellipse(ctx, 478, 256, 22, 15, '#ff922b');
    circle(ctx, 494, 240, 11, '#ff922b');
    poly(ctx, [[488, 232], [491, 222], [496, 231]], '#ff922b');
    poly(ctx, [[498, 231], [503, 222], [505, 232]], '#ff922b');
    circle(ctx, 497, 239, 1.6, '#1d2433');
    ctx.strokeStyle = '#ff922b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(458, 250, 12, Math.PI * 0.9, Math.PI * 1.7);
    ctx.stroke();
  }
  // Flower bed — difference 4: the red tulip turned yellow on the right.
  for (let i = 0; i < 7; i += 1) {
    const fx = 300 + i * 26;
    ctx.strokeStyle = '#2f9e44';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, 372);
    ctx.lineTo(fx, 348);
    ctx.stroke();
    const isRed = i === 4 && side === 0;
    circle(ctx, fx, 340, 9, isRed ? '#e03131' : '#ffd43b');
  }
  // Butterfly.
  ellipse(ctx, 610, 300, 8, 11, '#b197fc');
  ellipse(ctx, 622, 300, 8, 11, '#9775fa');
  text(ctx, 'TAMAN SENJA', 320, 392, 13, 'rgba(255,255,255,0.85)', 'center', 'bold');
}

// ---------------------------------------------------------------------------
// Level 2 — Kota Neon (neon city at night). Darker, trickier: windows and lights.
// ---------------------------------------------------------------------------
function paintCity(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#0b0d2a');
  sky.addColorStop(1, '#2b2d5c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 400);
  // Stars, the same on both panels.
  star(ctx, 80, 200, 7, '#fff3bf');
  star(ctx, 108, 214, 6, '#fff3bf');
  star(ctx, 94, 226, 5, '#fff3bf');
  star(ctx, 580, 60, 6, '#fff3bf');
  star(ctx, 610, 90, 5, '#fff3bf');
  // Moon — difference 1: full moon on the left, crescent on the right.
  circle(ctx, 92, 66, 30, '#fff9db');
  if (side === 1) circle(ctx, 106, 58, 26, '#0b0d2a');
  circle(ctx, 82, 58, 5, '#e9e2b8');
  circle(ctx, 100, 74, 4, '#e9e2b8');
  // Skyline.
  const buildings = [
    { x: 30, y: 150, w: 90, h: 250, c: '#1f2440' },
    { x: 140, y: 110, w: 80, h: 290, c: '#2a2f55' },
    { x: 240, y: 170, w: 100, h: 230, c: '#1f2440' },
    { x: 360, y: 120, w: 90, h: 280, c: '#2a2f55' },
    { x: 470, y: 160, w: 110, h: 240, c: '#1f2440' },
  ];
  for (const b of buildings) rect(ctx, b.x, b.y, b.w, b.h, b.c);
  // Antenna — difference 6: the antenna is missing on the right.
  if (side === 0) {
    ctx.strokeStyle = '#868e96';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(180, 110);
    ctx.lineTo(180, 74);
    ctx.stroke();
    circle(ctx, 180, 70, 5, '#ff6b6b');
  }
  // Windows: a grid of lit and dark panes. Difference 2: one pane is dark on the right.
  for (const b of buildings) {
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const wx = b.x + 14 + col * 26;
        const wy = b.y + 18 + row * 34;
        const isTarget = b.x === 240 && row === 1 && col === 1;
        const lit = isTarget ? side === 0 : (row + col + b.x) % 3 !== 0;
        rect(ctx, wx, wy, 16, 20, lit ? '#ffd43b' : '#12152e');
      }
    }
  }
  // Billboard — difference 5: the wording changes on the right.
  rect(ctx, 440, 84, 130, 44, '#ff6b9d');
  rect(ctx, 440, 84, 130, 6, '#ffd43b');
  text(ctx, side === 0 ? 'KOTA' : 'KOTA!', 505, 108, 24, '#fff', 'center', 'bold');
  // Street.
  rect(ctx, 0, 330, 640, 70, '#14162e');
  ctx.strokeStyle = '#ffd43b';
  ctx.lineWidth = 4;
  ctx.setLineDash([26, 22]);
  ctx.beginPath();
  ctx.moveTo(0, 366);
  ctx.lineTo(640, 366);
  ctx.stroke();
  ctx.setLineDash([]);
  // Streetlamp — difference 7: the lamp is on on the left, off on the right.
  rect(ctx, 116, 250, 8, 82, '#495057');
  circle(ctx, 120, 246, 12, side === 0 ? '#ffe066' : '#343a40');
  if (side === 0) {
    ctx.fillStyle = 'rgba(255, 224, 102, 0.25)';
    ctx.beginPath();
    ctx.moveTo(120, 250);
    ctx.lineTo(70, 330);
    ctx.lineTo(170, 330);
    ctx.closePath();
    ctx.fill();
  }
  // Car — difference 4: red on the left, blue on the right.
  const carColour = side === 0 ? '#e03131' : '#1971c2';
  poly(ctx, [[300, 330], [316, 306], [372, 306], [392, 330]], carColour);
  rect(ctx, 292, 328, 108, 20, carColour);
  circle(ctx, 316, 350, 11, '#212529');
  circle(ctx, 376, 350, 11, '#212529');
  circle(ctx, 316, 350, 4, '#adb5bd');
  circle(ctx, 376, 350, 4, '#adb5bd');
  circle(ctx, 394, 334, 5, '#fff9db');
  // Traffic light — difference 3: green on the left, red on the right.
  rect(ctx, 552, 226, 26, 62, '#212529');
  circle(ctx, 565, 240, 8, side === 0 ? '#343a40' : '#fa5252');
  circle(ctx, 565, 258, 8, '#868e96');
  circle(ctx, 565, 276, 8, side === 0 ? '#40c057' : '#343a40');
  rect(ctx, 561, 288, 8, 44, '#495057');
  text(ctx, 'KOTA NEON', 320, 392, 13, 'rgba(255,255,255,0.85)', 'center', 'bold');
}

// ---------------------------------------------------------------------------
// Level 3 — Stasiun Angkasa (space station). Deep space, small details, hardest.
// ---------------------------------------------------------------------------
function paintSpace(ctx, side) {
  ctx.fillStyle = '#050514';
  ctx.fillRect(0, 0, 640, 400);
  // Starfield.
  const stars = [
    [40, 40, 3], [150, 30, 2], [250, 60, 3], [360, 36, 2], [470, 50, 3], [580, 30, 2],
    [90, 120, 2], [200, 100, 3], [420, 90, 2], [600, 140, 3], [30, 250, 2], [620, 250, 2],
    [180, 330, 2], [480, 340, 2], [560, 300, 3],
  ];
  for (const [x, y, r] of stars) star(ctx, x, y, r, '#e7f5ff');
  // Star trio — difference 5: the third star is missing on the right.
  star(ctx, 70, 196, 6, '#fff3bf');
  star(ctx, 96, 208, 5, '#fff3bf');
  if (side === 0) star(ctx, 82, 222, 4, '#fff3bf');
  // Ringed planet — difference 1: the rings are gone on the right.
  circle(ctx, 320, 128, 52, '#ff8787');
  circle(ctx, 300, 112, 12, '#e599a0');
  circle(ctx, 338, 142, 8, '#e599a0');
  if (side === 0) {
    ctx.strokeStyle = '#ffd43b';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(320, 128, 84, 20, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Alien peeking behind the planet — difference 6: no alien on the right.
  if (side === 0) {
    circle(ctx, 420, 196, 16, '#69db7c');
    ellipse(ctx, 414, 192, 3, 6, '#1d2433');
    ellipse(ctx, 426, 192, 3, 6, '#1d2433');
    ctx.strokeStyle = '#69db7c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(414, 180);
    ctx.lineTo(410, 168);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(426, 180);
    ctx.lineTo(430, 168);
    ctx.stroke();
    circle(ctx, 410, 166, 3, '#ffd43b');
    circle(ctx, 430, 166, 3, '#ffd43b');
  }
  // Rocket — difference 2: big orange flame on the left, small blue flame on the right.
  poly(ctx, [[470, 250], [492, 218], [514, 250]], '#dee2e6');
  circle(ctx, 492, 250, 22, '#dee2e6');
  rect(ctx, 478, 248, 28, 22, '#fa5252');
  circle(ctx, 492, 238, 9, '#4dabf7');
  if (side === 0) {
    poly(ctx, [[482, 270], [492, 306], [502, 270]], '#ff922b');
    poly(ctx, [[486, 270], [492, 292], [498, 270]], '#ffd43b');
  } else {
    poly(ctx, [[486, 270], [492, 286], [498, 270]], '#4dabf7');
  }
  // Satellite — difference 4: the dish points the other way on the right.
  rect(ctx, 516, 96, 8, 60, '#868e96');
  circle(ctx, 520, 92, 10, '#adb5bd');
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 4;
  if (side === 0) {
    ctx.beginPath();
    ctx.arc(520, 92, 26, Math.PI * 0.9, Math.PI * 1.7);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(520, 92, 26, Math.PI * 1.3, Math.PI * 0.1);
    ctx.stroke();
  }
  // Astronaut with flag — difference 3: the flag is missing on the right.
  circle(ctx, 150, 280, 20, '#f8f9fa');
  circle(ctx, 150, 276, 14, '#a5d8ff');
  rect(ctx, 132, 300, 36, 44, '#f8f9fa');
  rect(ctx, 140, 300, 20, 12, '#4dabf7');
  circle(ctx, 128, 306, 7, '#f8f9fa');
  circle(ctx, 172, 306, 7, '#f8f9fa');
  if (side === 0) {
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(176, 300);
    ctx.lineTo(176, 262);
    ctx.stroke();
    poly(ctx, [[176, 262], [206, 270], [176, 280]], '#fa5252');
  }
  // Control panel — difference 7: the third light is red on the right.
  rect(ctx, 150, 336, 160, 34, '#343a40');
  circle(ctx, 176, 353, 7, '#40c057');
  circle(ctx, 204, 353, 7, '#40c057');
  circle(ctx, 232, 353, 7, side === 0 ? '#40c057' : '#fa5252');
  rect(ctx, 262, 346, 34, 14, '#1971c2');
  text(ctx, 'STASIUN ANGKASA', 320, 392, 13, 'rgba(255,255,255,0.85)', 'center', 'bold');
}

/** Every scene: id, painter, and its seven hotspots. */
export const SCENES = [
  {
    id: 'garden',
    paint: paintGarden,
    differences: [
      { x: 82, y: 66, r: 40, name: 'Sinar matahari' },
      { x: 340, y: 70, r: 36, name: 'Awan tengah' },
      { x: 168, y: 198, r: 34, name: 'Apel di pohon' },
      { x: 404, y: 340, r: 22, name: 'Tulip merah' },
      { x: 478, y: 252, r: 32, name: 'Kucing di bangku' },
      { x: 560, y: 348, r: 26, name: 'Bebek kedua' },
      { x: 529, y: 74, r: 24, name: 'Burung di langit' },
    ],
  },
  {
    id: 'city',
    paint: paintCity,
    differences: [
      { x: 92, y: 66, r: 36, name: 'Bulan purnama' },
      { x: 288, y: 232, r: 24, name: 'Jendela menyala' },
      { x: 565, y: 257, r: 26, name: 'Lampu lalu lintas' },
      { x: 344, y: 328, r: 36, name: 'Warna mobil' },
      { x: 505, y: 106, r: 34, name: 'Tulisan papan iklan' },
      { x: 180, y: 92, r: 24, name: 'Antena gedung' },
      { x: 120, y: 246, r: 26, name: 'Lampu jalan' },
    ],
  },
  {
    id: 'space',
    paint: paintSpace,
    differences: [
      { x: 320, y: 128, r: 46, name: 'Cincin planet' },
      { x: 492, y: 286, r: 28, name: 'Api roket' },
      { x: 190, y: 272, r: 30, name: 'Bendera astronot' },
      { x: 520, y: 92, r: 28, name: 'Arah antena' },
      { x: 84, y: 208, r: 24, name: 'Bintang ketiga' },
      { x: 420, y: 192, r: 26, name: 'Alien mengintip' },
      { x: 232, y: 353, r: 22, name: 'Lampu panel' },
    ],
  },
];
