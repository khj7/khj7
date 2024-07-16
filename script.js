const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Target {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
  }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'white');
const projectiles = [];
const targets = [];

function spawnTarget() {
  const radius = 20;
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  const y = Math.random() * (canvas.height - radius * 2) + radius;
  const color = 'red';
  targets.push(new Target(x, y, radius, color));
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, pIndex) => {
    projectile.update();

    // Remove projectiles that leave the screen
    if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width ||
      projectile.y - projectile.radius < 0 || projectile.y + projectile.radius > canvas.height) {
      setTimeout(() => {
        projectiles.splice(pIndex, 1);
      }, 0);
    }
  });

  targets.forEach((target, tIndex) => {
    target.update();

    projectiles.forEach((projectile, pIndex) => {
      const dist = Math.hypot(projectile.x - target.x, projectile.y - target.y);

      // When projectile hits target
      if (dist - target.radius - projectile.radius < 1) {
        setTimeout(() => {
          targets.splice(tIndex, 1);
          projectiles.splice(pIndex, 1);
          score += 10;
          scoreElement.innerText = `점수: ${score}`;
        }, 0);
      }
    });
  });
}

window.addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  };
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity));
});

// 일정 시간마다 목표물 생성
setInterval(spawnTarget, 1000);

animate();
