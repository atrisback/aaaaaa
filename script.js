const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// =====================
// CONFIGURAÇÕES ROSA
// =====================
const STEP = 0.045;           // densidade dos pontos
const EMIT_PER_FRAME = 8;     // mais emissões = mais cheio
const MAX_PARTICLES = 10000;  // limite para não travar
const BASE_SIZE = 3;          // tamanho base das partículas
const TRAIL_ALPHA = 0.2;      // rastro (0 = sem rastro)
const GLOW = 25;              // brilho (shadowBlur)

// ===============
// GRADIENTE ROSA
// ===============
function randomPinkColor() {
  const colors = [
    "rgb(255,105,180)", // rosa choque
    "rgb(255,182,193)", // rosa claro
    "rgb(255,20,147)",  // rosa profundo
    "rgb(255,0,127)"    // magenta/rosa forte
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

let heartPoints = [];
function buildHeartPoints(step = STEP) {
  heartPoints = [];
  for (let t = 0; t < Math.PI * 2; t += step) {
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    heartPoints.push({ x, y });
  }
}
buildHeartPoints();

let particles = [];

// ===============
// PARTÍCULA
// ===============
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = BASE_SIZE + Math.random() * 2.2;
    this.vx = (Math.random() * 2 - 1) * 1.2;
    this.vy = (Math.random() * 2 - 1) * 1.2;
    this.life = 1;
    this.decay = 0.985;
    this.color = randomPinkColor();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.992;
    this.life *= this.decay;
  }
  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = GLOW;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ===============
// EMISSOR
// ===============
function emitHeart(scale) {
  for (let i = 0; i < heartPoints.length; i++) {
    const p = heartPoints[(Math.random() * heartPoints.length) | 0];
    const jx = (Math.random() * 2 - 1) * 2;
    const jy = (Math.random() * 2 - 1) * 2;
    const px = canvas.width / 2 + (p.x * scale) + jx;
    const py = canvas.height / 2 - (p.y * scale) + jy;
    particles.push(new Particle(px, py));
  }
}

// ===============
// TEXTO
// ===============
function drawText() {
  const size = Math.max(50, Math.floor(canvas.width * 0.065));
  ctx.font = `${size}px "Comic Sans MS", cursive, sans-serif`;
  ctx.fillStyle = "rgb(255,182,193)"; // rosa claro
  ctx.textAlign = "center";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgb(255,105,180)";
  ctx.fillText("Te Amo 💕", canvas.width / 2, canvas.height * 0.9);
  ctx.shadowBlur = 0;
}

// ===============
// LOOP
// ===============
function animate() {
  ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText();

  const scale = Math.min(canvas.width, canvas.height) / 34;
  for (let i = 0; i < EMIT_PER_FRAME; i++) {
    emitHeart(scale);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(ctx);
  }

  particles = particles.filter(p => p.size > 0.25 && p.life > 0.05);
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }

  requestAnimationFrame(animate);
}

animate();
