const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.color = color;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.life = 1; // 1 → 0
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.985;
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

// curva do coração (paramétrica)
function spawnHeartPoints(step = 0.12, scale = 20) {
  for (let t = 0; t < Math.PI * 2; t += step) {
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    const px = canvas.width / 2 + x * scale;
    const py = canvas.height / 2 - y * scale;
    particles.push(new Particle(px, py, "rgba(255,0,150,0.9)"));
  }
}

// texto com “Te Amo”
function drawText() {
  const size = Math.max(40, Math.floor(canvas.width * 0.05));
  ctx.font = `${size}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Te Amo", canvas.width / 2, canvas.height * 0.85);
}

// loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText();

  // solta alguns pontos do coração continuamente
  if (Math.random() < 0.15) spawnHeartPoints(0.4, Math.min(canvas.width, canvas.height) / 40);

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.size < 0.2 || p.life < 0.05) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();
