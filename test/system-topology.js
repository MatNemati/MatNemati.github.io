/**
 * Gemini Pro System Topology Canvas
 * An interactive, draggable, animated System Design architecture graph
 * with real-time packet flow, mouse attraction, and node telemetry inspection.
 */

class GeminiSystemTopology {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'w-full h-full block cursor-crosshair';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Active simulation modes
    this.stressTestActive = false;
    this.isTracing = false;
    this.activeTraceStep = 0;

    // Mouse & interaction state
    this.mouse = { x: -1000, y: -1000, isDown: false, hoveredNode: null, draggedNode: null };
    this.dragOffset = { x: 0, y: 0 };

    // Packets moving along links
    this.packets = [];

    // System Nodes Definition
    this.nodes = [
      {
        id: 'client',
        label: 'Client Mesh',
        sublabel: 'Web / CLI / Stream',
        icon: '💻',
        relX: 0.12,
        relY: 0.5,
        radius: 36,
        color: '#38bdf8',
        accent: '#0284c7',
        metrics: { throughput: '12.4k req/s', latency: '4ms', status: 'Optimal', load: '32%' },
        specs: 'Zero-latency WebSocket streams & HTTP/3 multiplexing with client-side speculative rendering.'
      },
      {
        id: 'ingress',
        label: 'Edge Ingress',
        sublabel: 'Cloudflare / GeoDNS',
        icon: '🌐',
        relX: 0.28,
        relY: 0.32,
        radius: 38,
        color: '#60a5fa',
        accent: '#2563eb',
        metrics: { throughput: '24.1k req/s', latency: '12ms', status: 'Shielded', load: '45%' },
        specs: 'Global Anycast network edge routing, automated DDoS mitigation, and SSL termination in <8ms.'
      },
      {
        id: 'gateway',
        label: 'API Gateway',
        sublabel: 'Envoy / Rate Limiter',
        icon: '🛡️',
        relX: 0.28,
        relY: 0.68,
        radius: 38,
        color: '#818cf8',
        accent: '#4f46e5',
        metrics: { throughput: '18.9k req/s', latency: '6ms', status: 'Healthy', load: '38%' },
        specs: 'Token-bucket rate limiting, JWT validation, cryptographic signature verification, and dynamic routing.'
      },
      {
        id: 'gemini_core',
        label: 'Gemini Pro 2.0',
        sublabel: 'Multimodal Neural MoE',
        icon: '🧠',
        relX: 0.52,
        relY: 0.45,
        radius: 48,
        isCore: true,
        color: '#c084fc',
        accent: '#9333ea',
        metrics: { throughput: '3.8M tokens/s', latency: '18ms P99', status: 'Neural Core', load: '68%' },
        specs: 'Google Gemini Pro 2.0 MoE inference cluster with 2M token context, speculative decoding, and native multimodal reasoning.'
      },
      {
        id: 'orchestrator',
        label: 'Agentic Mesh',
        sublabel: 'Temporal / DAG Engine',
        icon: '⚡',
        relX: 0.52,
        relY: 0.82,
        radius: 38,
        color: '#f472b6',
        accent: '#db2777',
        metrics: { throughput: '8.2k tasks/s', latency: '24ms', status: 'Active DAG', load: '52%' },
        specs: 'Self-healing stateful agent workflows with tool calling loop, automatic retry fallback, and consensus validation.'
      },
      {
        id: 'vector_db',
        label: 'Vector DB & Graph',
        sublabel: 'Qdrant / HNSW Index',
        icon: '🗄️',
        relX: 0.76,
        relY: 0.32,
        radius: 40,
        color: '#2dd4bf',
        accent: '#0d9488',
        metrics: { throughput: '9.4k QPS', latency: '8ms P95', status: 'Synchronized', load: '41%' },
        specs: 'High-dimensional embeddings store with sub-10ms similarity search, scalar quantization, and Graph RAG traversal.'
      },
      {
        id: 'cache_store',
        label: 'Sharded Cache',
        sublabel: 'Redis Tier 0 Cluster',
        icon: '💾',
        relX: 0.76,
        relY: 0.68,
        radius: 38,
        color: '#fbbf24',
        accent: '#d97706',
        metrics: { throughput: '82.5k ops/s', latency: '0.8ms', status: 'Optimal', hitRate: '98.6%' },
        specs: 'Sub-millisecond memory-tier cache with LRU eviction, distributed pub/sub bus, and write-through persistence.'
      },
      {
        id: 'telemetry',
        label: 'Telemetry Bus',
        sublabel: 'eBPF / OpenTelemetry',
        icon: '📊',
        relX: 0.92,
        relY: 0.5,
        radius: 36,
        color: '#34d399',
        accent: '#059669',
        metrics: { throughput: '150k metrics/s', latency: '2ms', status: 'Streaming', load: '22%' },
        specs: 'Kernel-level eBPF tracing, real-time distributed spans, Prometheus scraping, and anomaly detection alarms.'
      }
    ];

    // Interconnect Links
    this.links = [
      { from: 'client', to: 'ingress', label: 'TLS / HTTP3' },
      { from: 'client', to: 'gateway', label: 'WebSocket' },
      { from: 'ingress', to: 'gemini_core', label: 'Ingress Stream' },
      { from: 'gateway', to: 'gemini_core', label: 'Auth Pipeline' },
      { from: 'gateway', to: 'orchestrator', label: 'Workflow Init' },
      { from: 'gemini_core', to: 'orchestrator', label: 'Agent Tools' },
      { from: 'gemini_core', to: 'vector_db', label: 'Semantic Memory' },
      { from: 'gemini_core', to: 'cache_store', label: 'KV Lookup' },
      { from: 'vector_db', to: 'telemetry', label: 'Trace Metrics' },
      { from: 'cache_store', to: 'telemetry', label: 'Hit/Miss Stats' },
      { from: 'orchestrator', to: 'cache_store', label: 'State Sync' }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse Listeners
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    // Populate initial packets
    this.seedPackets();

    // Attach UI control buttons
    this.bindControls();

    // Start render loop
    this.render();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = Math.max(rect.height, 460);
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);

    // Compute absolute positions from relative coordinates
    this.nodes.forEach(node => {
      if (!node.customPos) {
        node.x = this.width * node.relX;
        node.y = this.height * node.relY;
        node.targetX = node.x;
        node.targetY = node.y;
      }
    });
  }

  bindControls() {
    const traceBtn = document.getElementById('topology-trace-btn');
    const stressBtn = document.getElementById('topology-stress-btn');
    const resetBtn = document.getElementById('topology-reset-btn');

    if (traceBtn) {
      traceBtn.addEventListener('click', () => this.triggerRequestTrace());
    }

    if (stressBtn) {
      stressBtn.addEventListener('click', () => this.toggleStressTest());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTopology());
    }
  }

  seedPackets() {
    this.packets = [];
    for (let i = 0; i < 16; i++) {
      const link = this.links[Math.floor(Math.random() * this.links.length)];
      this.packets.push({
        link: link,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
        size: 3 + Math.random() * 2,
        color: '#8ab4f8'
      });
    }
  }

  getNode(id) {
    return this.nodes.find(n => n.id === id);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    if (this.mouse.isDown && this.mouse.draggedNode) {
      this.mouse.draggedNode.x = this.mouse.x + this.dragOffset.x;
      this.mouse.draggedNode.y = this.mouse.y + this.dragOffset.y;
      this.mouse.draggedNode.customPos = true;
      return;
    }

    // Check hover
    let hovered = null;
    for (let node of this.nodes) {
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 6) {
        hovered = node;
        break;
      }
    }

    this.mouse.hoveredNode = hovered;
    this.canvas.style.cursor = hovered ? 'grab' : 'crosshair';

    // Update Telemetry Panel if hovered
    if (hovered) {
      this.updateTelemetryCard(hovered);
    }
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let node of this.nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 8) {
        this.mouse.isDown = true;
        this.mouse.draggedNode = node;
        this.dragOffset.x = node.x - x;
        this.dragOffset.y = node.y - y;
        this.canvas.style.cursor = 'grabbing';
        this.updateTelemetryCard(node);
        this.burstParticlesAt(node.x, node.y, node.color);
        break;
      }
    }
  }

  handleMouseUp() {
    this.mouse.isDown = false;
    this.mouse.draggedNode = null;
    if (this.mouse.hoveredNode) {
      this.canvas.style.cursor = 'grab';
    }
  }

  handleMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
    this.mouse.isDown = false;
    this.mouse.draggedNode = null;
    this.mouse.hoveredNode = null;
  }

  updateTelemetryCard(node) {
    const titleEl = document.getElementById('topo-detail-title');
    const badgeEl = document.getElementById('topo-detail-badge');
    const descEl = document.getElementById('topo-detail-desc');
    const metric1El = document.getElementById('topo-detail-metric1');
    const metric2El = document.getElementById('topo-detail-metric2');
    const metric3El = document.getElementById('topo-detail-metric3');

    if (titleEl) titleEl.textContent = `${node.icon} ${node.label}`;
    if (badgeEl) {
      badgeEl.textContent = node.sublabel;
      badgeEl.style.borderColor = `${node.color}50`;
      badgeEl.style.color = node.color;
    }
    if (descEl) descEl.textContent = node.specs;
    if (metric1El) metric1El.textContent = node.metrics.throughput;
    if (metric2El) metric2El.textContent = node.metrics.latency;
    if (metric3El) metric3El.textContent = node.metrics.status || node.metrics.load;
  }

  burstParticlesAt(x, y, color) {
    for (let i = 0; i < 14; i++) {
      this.packets.push({
        fromX: x,
        fromY: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        isBurst: true,
        life: 1.0,
        decay: 0.04 + Math.random() * 0.03,
        size: 3.5,
        color: color
      });
    }
  }

  triggerRequestTrace() {
    if (this.isTracing) return;
    this.isTracing = true;

    const tracePath = [
      { from: 'client', to: 'ingress' },
      { from: 'ingress', to: 'gemini_core' },
      { from: 'gemini_core', to: 'vector_db' },
      { from: 'gemini_core', to: 'cache_store' },
      { from: 'gemini_core', to: 'orchestrator' },
      { from: 'cache_store', to: 'telemetry' }
    ];

    let delay = 0;
    tracePath.forEach((step, idx) => {
      setTimeout(() => {
        const fromNode = this.getNode(step.from);
        const toNode = this.getNode(step.to);
        if (fromNode && toNode) {
          for (let p = 0; p < 5; p++) {
            this.packets.push({
              link: { from: step.from, to: step.to },
              progress: 0,
              speed: 0.02 + p * 0.004,
              size: 5,
              color: '#38bdf8',
              isTrace: true
            });
          }
          this.burstParticlesAt(toNode.x, toNode.y, toNode.color);
        }
        if (idx === tracePath.length - 1) {
          setTimeout(() => { this.isTracing = false; }, 800);
        }
      }, delay);
      delay += 380;
    });
  }

  toggleStressTest() {
    this.stressTestActive = !this.stressTestActive;
    const stressBtn = document.getElementById('topology-stress-btn');
    if (stressBtn) {
      if (this.stressTestActive) {
        stressBtn.classList.add('bg-pink-600/30', 'text-pink-300', 'border-pink-500');
        stressBtn.innerHTML = '<span>⚡ Stress Test (Active)</span>';
        // Flood packets
        for (let i = 0; i < 40; i++) {
          const link = this.links[Math.floor(Math.random() * this.links.length)];
          this.packets.push({
            link: link,
            progress: Math.random(),
            speed: 0.015 + Math.random() * 0.02,
            size: 3.5 + Math.random() * 2,
            color: '#ec4899'
          });
        }
      } else {
        stressBtn.classList.remove('bg-pink-600/30', 'text-pink-300', 'border-pink-500');
        stressBtn.innerHTML = '<span>⚡ Stress Test</span>';
        this.seedPackets();
      }
    }
  }

  resetTopology() {
    this.nodes.forEach(node => {
      node.customPos = false;
      node.x = this.width * node.relX;
      node.y = this.height * node.relY;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Interconnect Links
    this.links.forEach(link => {
      const fromNode = this.getNode(link.from);
      const toNode = this.getNode(link.to);
      if (!fromNode || !toNode) return;

      const isConnectedToHovered = this.mouse.hoveredNode &&
        (this.mouse.hoveredNode.id === link.from || this.mouse.hoveredNode.id === link.to);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);

      // Subtle bezier curve for organic feel
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2 + (fromNode.y > toNode.y ? -12 : 12);
      this.ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);

      if (isConnectedToHovered) {
        this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowColor = '#c084fc';
        this.ctx.shadowBlur = 10;
      } else {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 1.2;
      }

      this.ctx.stroke();
      this.ctx.restore();
    });

    // 2. Draw Interactive Line from Nearest Node to User Mouse
    if (this.mouse.x > 0 && this.mouse.y > 0 && !this.mouse.isDown) {
      let closestNode = null;
      let minDist = 220;

      for (let node of this.nodes) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestNode = node;
        }
      }

      if (closestNode) {
        const alpha = (1 - minDist / 220) * 0.45;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setLineDash([4, 4]);
        this.ctx.moveTo(closestNode.x, closestNode.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // 3. Update & Draw Data Packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];

      if (p.isBurst) {
        p.fromX += p.vx;
        p.fromY += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.packets.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.fromX, p.fromY, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.life;
        this.ctx.fill();
        this.ctx.restore();
        continue;
      }

      const fromNode = this.getNode(p.link.from);
      const toNode = this.getNode(p.link.to);
      if (!fromNode || !toNode) continue;

      p.progress += p.speed;
      if (p.progress >= 1) {
        if (p.isTrace) {
          this.packets.splice(i, 1);
          continue;
        }
        p.progress = 0;
        // Optionally switch to new random link
        if (Math.random() < 0.2 && !this.stressTestActive) {
          p.link = this.links[Math.floor(Math.random() * this.links.length)];
        }
      }

      // Quadratic interpolation along the curve
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2 + (fromNode.y > toNode.y ? -12 : 12);
      const t = p.progress;
      const invT = 1 - t;

      const px = invT * invT * fromNode.x + 2 * invT * t * midX + t * t * toNode.x;
      const py = invT * invT * fromNode.y + 2 * invT * t * midY + t * t * toNode.y;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Draw System Nodes
    this.nodes.forEach(node => {
      const isHovered = this.mouse.hoveredNode === node;
      const isDragged = this.mouse.draggedNode === node;
      const radius = node.radius * (isHovered || isDragged ? 1.08 : 1.0);

      // Core Outer Radiant Ring (Gemini MoE Core)
      if (node.isCore) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius + 14, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.25)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([6, 6]);
        this.ctx.stroke();
        this.ctx.restore();
      }

      // Node Background Glow
      this.ctx.save();
      const glowGrad = this.ctx.createRadialGradient(node.x, node.y, radius * 0.4, node.x, node.y, radius * 2.2);
      glowGrad.addColorStop(0, `${node.color}${isHovered ? '40' : '20'}`);
      glowGrad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Node Body Circle
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0b0f19';
      this.ctx.fill();

      // Border with Accent
      this.ctx.strokeStyle = isHovered ? node.color : 'rgba(255, 255, 255, 0.18)';
      this.ctx.lineWidth = isHovered ? 2.5 : 1.5;
      if (isHovered) {
        this.ctx.shadowColor = node.color;
        this.ctx.shadowBlur = 14;
      }
      this.ctx.stroke();
      this.ctx.restore();

      // Icon & Label inside node
      this.ctx.save();
      this.ctx.font = `${Math.floor(radius * 0.65)}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(node.icon, node.x, node.y - 4);

      // Node Label below
      this.ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = isHovered ? '#ffffff' : '#cbd5e1';
      this.ctx.fillText(node.label, node.x, node.y + radius + 15);

      // Sublabel
      this.ctx.font = '400 9px "JetBrains Mono", monospace';
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillText(node.sublabel, node.x, node.y + radius + 27);
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.render());
  }
}

window.GeminiSystemTopology = GeminiSystemTopology;
