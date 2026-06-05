/* ═══════════════════════════════════════════════════════════════
   @megs.e30  ·  script.js

   1. iMac "Drift" screensaver — Lissajous light arms on canvas
   2. Schwarzschild black hole ring drawn into the same canvas
   3. Scroll-driven 3D Y-axis rotation on the @megs.e30 handle
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Canvas setup ────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // Re-fill black so resize doesn't leave blank white flash
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
}
resize();
window.addEventListener('resize', resize, { passive: true });


/* ═══════════════════════════════════════════════════════════════
   BLACK HOLE
   ─ A dark void at canvas centre with a rotating accretion ring.
   ═══════════════════════════════════════════════════════════════ */

function drawBlackHole(t) {
  const cx = W * 0.5;
  const cy = H * 0.5;
  const R  = Math.min(W, H) * 0.20;   // event-horizon radius

  ctx.save();
  ctx.translate(cx, cy);

  // ── Outer soft glow layers (warm amber + red) ──
  const glows = [
    { stop: R * 2.4, alpha: 0.022, hue: 28  },
    { stop: R * 1.9, alpha: 0.042, hue: 20  },
    { stop: R * 1.4, alpha: 0.08,  hue: 10  },
    { stop: R * 1.1, alpha: 0.14,  hue:  0  },
  ];
  glows.forEach(({ stop, alpha, hue }) => {
    const g = ctx.createRadialGradient(0, 0, R * 0.85, 0, 0, stop);
    g.addColorStop(0, `hsla(${hue}, 100%, 60%, ${alpha})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, stop, 0, Math.PI * 2);
    ctx.fill();
  });

  // ── Rotating accretion ring — bright arc segments ──
  ctx.save();
  ctx.rotate(t * 0.22);                // slow clockwise spin
  const segments = 120;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Brightness peaks on one side (gravitational lensing illusion)
    const bright = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.cos(angle - Math.PI * 0.3), 2.5);
    const hue    = 22 + 16 * Math.sin(angle * 2 + t * 0.4);   // amber → orange cycle
    const alpha  = bright * 0.85;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.97, angle, angle + (Math.PI * 2) / segments + 0.01);
    ctx.strokeStyle = `hsla(${hue}, 95%, 65%, ${alpha})`;
    ctx.lineWidth   = 3.5 + bright * 3;
    ctx.stroke();
  }
  ctx.restore();

  // ── Event horizon — absolute black fills the centre ──
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.9);
  core.addColorStop(0.0, '#000000');
  core.addColorStop(0.85,'#000000');
  core.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.90, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


/* ═══════════════════════════════════════════════════════════════
   iMAC "DRIFT" SCREENSAVER
   ─ Lissajous light arms with long glowing trails.
     The shape emerges from two independent sine/cosine
     oscillators at irrational frequency ratios — gives the
     organic "never quite repeating" look of the Apple screensaver.
   ═══════════════════════════════════════════════════════════════ */

// 6 arms, distributed in phase, colours spread across spectrum
const NUM_ARMS  = 6;
const TRAIL_LEN = 200;   // points kept per arm
const SPEED     = 0.0055;

const ARMS = Array.from({ length: NUM_ARMS }, (_, i) => ({
  phase: (i / NUM_ARMS) * Math.PI * 2,
  hue:   (i / NUM_ARMS) * 360,        // starting hue (degrees)
  trail: [],
  t:     (i / NUM_ARMS) * 80,         // stagger so arms start spread out
}));

/**
 * Lissajous-ish parametric path.
 *
 *   x = A·sin(p·t + φ)  +  B·sin(q·t)
 *   y = A·cos(r·t + φ)  +  B·cos(s·t)
 *
 * Chosen frequency ratios (2.1/1.7, 7.3/5.1) produce a slowly
 * precessing flower-star shape — same feel as the Drift screensaver.
 */
function armPos(t, phase) {
  const A = Math.min(W, H) * 0.32;
  const B = Math.min(W, H) * 0.09;
  return {
    x: W * 0.5 + A * Math.sin(2.1 * t + phase) + B * Math.sin(7.3 * t + phase * 0.4),
    y: H * 0.5 + A * Math.cos(1.7 * t + phase) + B * Math.cos(5.1 * t + phase * 0.4),
  };
}

function drawArms() {
  ARMS.forEach(arm => {
    arm.t += SPEED;
    const pt = armPos(arm.t, arm.phase);
    arm.trail.push(pt);
    if (arm.trail.length > TRAIL_LEN) arm.trail.shift();

    const len = arm.trail.length;
    if (len < 3) return;

    // ── Trail — draw as individual line segments, alpha fades with age ──
    ctx.save();
    ctx.globalCompositeOperation = 'screen';  // additive blending = natural glow

    for (let i = 2; i < len; i++) {
      const frac  = i / len;
      const width = frac * 2.8;
      const alpha = frac * 0.75;
      ctx.beginPath();
      ctx.moveTo(arm.trail[i - 1].x, arm.trail[i - 1].y);
      ctx.lineTo(arm.trail[i].x,     arm.trail[i].y);
      ctx.strokeStyle = `hsla(${arm.hue}, 100%, 68%, ${alpha})`;
      ctx.lineWidth   = width;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // ── Bright tip glow ──
    const tip  = arm.trail[len - 1];
    const glow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 14);
    glow.addColorStop(0, `hsla(${arm.hue}, 100%, 88%, 0.95)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Very slow hue drift — colours shift across the spectrum
    arm.hue = (arm.hue + 0.07) % 360;
  });
}


/* ═══════════════════════════════════════════════════════════════
   MAIN ANIMATION LOOP
   ═══════════════════════════════════════════════════════════════ */

let animT = 0;

// Seed initial black fill
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, W, H);

function loop() {
  animT += SPEED;

  /*
    Semi-transparent black overlay every frame.
    Alpha = 0.032 ≈ trail persists ~30 frames before fully fading.
    Lower  → longer ghost trails.
    Higher → sharper, shorter trails.
  */
  ctx.fillStyle = 'rgba(0,0,0,0.032)';
  ctx.fillRect(0, 0, W, H);

  drawBlackHole(animT);
  drawArms();

  requestAnimationFrame(loop);
}

loop();


/* ═══════════════════════════════════════════════════════════════
   SCROLL-DRIVEN 3-D ROTATION
   ─ The @megs.e30 handle rotates 360° on the Y-axis as the user
     scrolls from top to bottom of the page.
   ═══════════════════════════════════════════════════════════════ */

const handle = document.getElementById('handle');

function onScroll() {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const progress = scrolled / maxScroll;          // 0 → 1
  const deg      = progress * 360;                // 0° → 360°

  handle.style.transform =
    `perspective(900px) rotateY(${deg}deg)`;
}

window.addEventListener('scroll', onScroll, { passive: true });
