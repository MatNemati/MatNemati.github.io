/**
 * Interactive Background: Gemini Neural Constellation & Stardust Canvas
 * Reacts dynamically to mouse position, speed, and clicks.
 */

class GeminiBackgroundCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.sparks = [];
    this.shockwaves = [];
    this.particleCount = 75;
    this.connectDistance = 140;
    this.mouseRadius = 180;
    
    this.mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      isHovered: false
    };

    this.colors = [
      '#4285f4', // Google Blue
      '#8ab4f8', // Light Blue
      '#9333ea', // Deep Purple
      '#c084fc', // Violet
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#38bdf8'  // Sky
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse movement tracking with velocity
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      if (this.mouse.prevX !== -1000) {
        const dx = newX - this.mouse.prevX;
        const dy = newY - this.mouse.prevY;
        this.mouse.speed = Math.sqrt(dx * dx + dy * dy);

        // Emit spark trail if moving fast enough
        if (this.mouse.speed > 8 && Math.random() < 0.6) {
          this.addSpark(newX, newY, dx, dy);
        }
      }

      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = newX;
      this.mouse.y = newY;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovered = false;
    });

    // Click shockwave
    window.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.addShockwave(x, y);
    });

    // Create initial particle pool
    this.createParticles();
    this.animate();
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.spawnParticle());
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    
    // Scale particle count to screen size
    const targetCount = Math.floor((this.width * this.height) / 18000);
    this.particleCount = Math.min(Math.max(targetCount, 45), 110);
    
    if (this.particles.length < this.particleCount) {
      while (this.particles.length < this.particleCount) {
        this.particles.push(this.spawnParticle());
      }
    } else if (this.particles.length > this.particleCount) {
      this.particles.length = this.particleCount;
    }
  }

  spawnParticle(x, y) {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      baseRadius: Math.random() * 2 + 1,
      radius: Math.random() * 2 + 1,
      color: color,
      alpha: Math.random() * 0.5 + 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2
    };
  }

  addSpark(x, y, vx, vy) {
    if (this.sparks.length > 50) this.sparks.shift();
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.sparks.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: -vx * 0.15 + (Math.random() - 0.5) * 1.5,
      vy: -vy * 0.15 + (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 2.5 + 1.2,
      color: color,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.025
    });
  }

  addShockwave(x, y) {
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: 260,
      speed: 10,
      color: '#8ab4f8',
      alpha: 0.8
    });

    // Push nearby particles outward
    for (let p of this.particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 260 && dist > 0) {
        const force = (1 - dist / 260) * 8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha *= 0.94;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(138, 180, 248, ${sw.alpha})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      this.ctx.restore();

      if (sw.radius > sw.maxRadius || sw.alpha < 0.02) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update and draw sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.life;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Update and draw particles & connectors
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural movement
      p.x += p.vx;
      p.y += p.vy;

      // Friction / stabilization
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Keep minimum drift speed
      if (Math.abs(p.vx) < 0.1) p.vx = (Math.random() - 0.5) * 0.5;
      if (Math.abs(p.vy) < 0.1) p.vy = (Math.random() - 0.5) * 0.5;

      // Screen wrap
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;

      // Mouse gravitational attraction/interaction
      if (this.mouse.isHovered) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouseRadius && dist > 1) {
          // Gravitational pull towards cursor with gentle resistance
          const angle = Math.atan2(dy, dx);
          const force = (1 - dist / this.mouseRadius) * 0.45;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;

          // Draw filament to cursor
          const alpha = (1 - dist / this.mouseRadius) * 0.45;
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(138, 180, 248, ${alpha})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
          this.ctx.restore();
        }
      }

      // Gentle pulsing radius
      p.pulseAngle += p.pulseSpeed;
      p.radius = p.baseRadius + Math.sin(p.pulseAngle) * 0.6;

      // Draw particle
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
      this.ctx.restore();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectDistance) {
          const alpha = (1 - dist / this.connectDistance) * 0.18;
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          
          // Gradient line between the two particle colors
          const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, p2.color);
          
          this.ctx.strokeStyle = grad;
          this.ctx.globalAlpha = alpha;
          this.ctx.lineWidth = 0.9;
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.GeminiBackgroundCanvas = GeminiBackgroundCanvas;
