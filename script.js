const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ------------------------------
// CONFIGS
// ------------------------------
const MAX_PARTICLES = 6000;   // limite p/ não pesar
const EMIT_TIMES = 4;         // quantas “levárias” por frame
const STEP = 0.06;            // quanto menor, mais pontos por coração
const HEART_COLOR = "rgba(255,0,150,0.95)"; // cor das partículas
const TRAIL_ALPHA = 0.25;     // 0 = sem rastro | 0.25 = rastro suave

let particles = [];

// ------------------------------
// Partícula
// ------------------------------
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;   // maior que antes
    this.color = color;
    this.vx = (Math.random() * 2 - 1) * 1.2;
    this.vy = (Math.random() * 2 - 1) * 1.2;
    this.life = 1; // 1 → 0
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.988;
    this.life *= 0.985;
  }
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ------------------------------
// Curva do coração (paramétrica)
// ------------------------------
function spawnHeartPoints(step = STEP, scale = 20) {
  for (let t = 0; t < Math.PI * 2; t += step) {
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const px = canvas.width / 2 + x * scale;
    const py = canvas.height / 2 - y * scale;

    particles.push(new Particle(px, py, HEART_COLOR));
  }
}

// ------------------------------
// Texto
// ------------------------------
function drawText() {
  const size = Math.max(46, Math.floor(canvas.width * 0.06));
  ctx.font = `${size}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Te Amo", canvas.width / 2, canvas.height * 0.9);
}

// ------------------------------
// Loop de animação
// ------------------------------
function animate() {
  // fundo com leve transparência para efeito de rastro
  ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText();

  // solta várias “passadas” do coração por frame
  const scale = Math.min(canvas.width, canvas.height) / 35;
  for (let i = 0; i < EMIT_TIMES; i++) {
    spawnHeartPoints(STEP, scale);
  }

  particles.forEach((p, i) => {
    p.update();
    p.draw();
  });

  // remove antigas / controla limite
  particles = particles.filter(p => p.size > 0.2 && p.life > 0.05);
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }

  requestAnimationFrame(animate);
}

animate();
