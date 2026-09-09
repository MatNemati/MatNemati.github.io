/**
 * Gemini Pro System Experience Orchestrator
 * Integrates Background Canvas, System Topology, Terminal, 3D Card Tilt,
 * Custom Cursor, Audio Feedback, and Micro-Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Background Canvas
  if (window.GeminiBackgroundCanvas) {
    new GeminiBackgroundCanvas('gemini-bg-canvas');
  }

  // 2. Initialize Interactive System Topology Canvas
  if (window.GeminiSystemTopology) {
    new GeminiSystemTopology('topology-canvas-container');
  }

  // 3. Initialize Interactive Terminal
  if (window.GeminiTerminal) {
    new GeminiTerminal('terminal-container');
  }

  // 4. Custom Gemini Cursor Follower
  initCustomCursor();

  // 5. 3D Mouse Tilt Effect for Glass Cards
  init3DCardTilt();

  // 6. Sound Effects via Web Audio API (zero audio file dependencies)
  const soundFX = initAudioSynth();

  // 7. Live System Metrics & Clock
  initLiveSystemMetrics();

  // 8. Clipboard & Toast System
  initClipboardAndToasts(soundFX);

  // 9. Contact Form Simulation
  initContactForm(soundFX);

  // 10. Sound Toggle Button
  const soundToggle = document.getElementById('sound-toggle-btn');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundFX.enabled = !soundFX.enabled;
      soundToggle.innerHTML = soundFX.enabled 
        ? `<svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg><span class="hidden sm:inline">Audio On</span>`
        : `<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg><span class="hidden sm:inline">Muted</span>`;
      if (soundFX.enabled) soundFX.playTone(600, 0.08, 'sine');
    });
  }
});

/**
 * Custom Lerp Cursor with Hover Expansion
 */
function initCustomCursor() {
  const follower = document.getElementById('gemini-cursor-follower');
  const dot = document.getElementById('gemini-cursor-dot');
  if (!follower || !dot) return;

  // Check if touch device; disable if so
  if (window.matchMedia('(pointer: coarse)').matches) {
    follower.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lerp loop for outer follower ring
  function renderCursor() {
    followerX += (mouseX - followerX) * 0.22;
    followerY += (mouseY - followerY) * 0.22;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expand cursor on interactive hover
  const interactives = 'a, button, input, textarea, .interactive-card, .term-chip, canvas';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovered'));
  });
}

/**
 * 3D Card Tilt on Mouse Move
 */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.interactive-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight reflection
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate rotation angles (-8deg to +8deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });
}

/**
 * High-Tech Browser Audio Synthesizer via Web Audio API
 */
function initAudioSynth() {
  let ctx = null;
  const sound = {
    enabled: false,
    playTone: (freq = 440, duration = 0.08, type = 'sine') => {
      if (!sound.enabled) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (err) {
        // Ignore audio policy issues
      }
    }
  };

  // Play subtle blips on interactive button clicks
  document.querySelectorAll('button, .term-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTone(880, 0.06, 'triangle');
    });
  });

  return sound;
}

/**
 * Live System Telemetry & Dynamic Clock
 */
function initLiveSystemMetrics() {
  // Live Clock
  function updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const tzShort = tz.split('/').pop().replace('_', ' ');
    clockEl.textContent = `${hrs}:${mins}:${secs} (${tzShort})`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Dynamic P99 Latency fluctuations (14.2ms to 17.8ms)
  const latencyEl = document.getElementById('metric-p99');
  if (latencyEl) {
    setInterval(() => {
      const lat = (14.2 + Math.random() * 3.6).toFixed(1);
      latencyEl.textContent = `${lat}ms`;
    }, 2800);
  }

  // Dynamic QPS counter
  const qpsEl = document.getElementById('metric-qps');
  if (qpsEl) {
    setInterval(() => {
      const qps = (24.2 + (Math.random() - 0.5) * 1.8).toFixed(1);
      qpsEl.textContent = `${qps}k`;
    }, 3400);
  }
}

/**
 * Toast System & Email Copy
 */
function initClipboardAndToasts(soundFX) {
  const toast = document.getElementById('gemini-toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(text, isSuccess = true) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = text;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (soundFX) soundFX.playTone(isSuccess ? 1200 : 320, 0.1, 'sine');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    }, 3000);
  }

  window.showToast = showToast;

  async function copyText(str) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(str);
      } else {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(`Copied ${str} to clipboard!`, true);
    } catch (e) {
      showToast(`Value: ${str}`, true);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.getAttribute('data-copy');
      if (val) copyText(val);
    });
  });
}

/**
 * Interactive Contact Form
 */
function initContactForm(soundFX) {
  const form = document.getElementById('dispatch-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-name')?.value.trim();
    const email = document.getElementById('input-email')?.value.trim();
    const topic = document.getElementById('input-topic')?.value.trim();
    const message = document.getElementById('input-message')?.value.trim();

    if (!name || !email || !message) {
      window.showToast('Please fill all required channels', false);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-2">⚙️</span> Encrypting &amp; Dispatching...`;

    if (soundFX) {
      soundFX.playTone(520, 0.1, 'triangle');
      setTimeout(() => soundFX.playTone(780, 0.1, 'sine'), 150);
      setTimeout(() => soundFX.playTone(1040, 0.15, 'sine'), 300);
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      window.showToast('Payload dispatched! Opening mail client...', true);

      // Open mailto link
      const subject = encodeURIComponent(`[Gemini Pro Dispatch: ${topic || 'Collaboration'}] from ${name}`);
      const body = encodeURIComponent(`From: ${name} (${email})\nTopic: ${topic}\n\n${message}`);
      window.location.href = `mailto:hello@matnemati.dev?subject=${subject}&body=${body}`;

      form.reset();
    }, 1100);
  });
}
