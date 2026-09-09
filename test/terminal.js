/**
 * Interactive Gemini Pro Terminal Console
 * Allows users to run simulated system architecture diagnostics,
 * queries, model benchmarks, and explore Mat Nemati's engineering portfolio.
 */

class GeminiTerminal {
  constructor(terminalId) {
    this.container = document.getElementById(terminalId);
    if (!this.container) return;

    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      arch: () => this.cmdArch(),
      bench: () => this.cmdBench(),
      projects: () => this.cmdProjects(),
      skills: () => this.cmdSkills(),
      about: () => this.cmdAbout(),
      contact: () => this.cmdContact(),
      clear: () => this.cmdClear(),
      probe: () => this.cmdProbe()
    };

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.input.value.trim();
        if (val) {
          this.executeCommand(val);
          this.history.push(val);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    // Quick trigger pills
    const pills = document.querySelectorAll('.term-chip');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const cmd = pill.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          this.input.focus();
        }
      });
    });
  }

  executeCommand(rawCmd) {
    this.appendLine(`<span class="text-brand-400 font-bold">matnemati@gemini-pro:~$</span> <span class="text-white">${this.escapeHtml(rawCmd)}</span>`);

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (cmd === 'prompt') {
      this.cmdPrompt(args);
      return;
    }

    if (this.commands[cmd]) {
      this.commands[cmd]();
    } else {
      this.appendLine(`<span class="text-red-400">Command not found: "${this.escapeHtml(cmd)}". Type <span class="text-cyan-400 font-bold">help</span> to list available operations.</span>`);
    }

    this.scrollToBottom();
  }

  cmdHelp() {
    const lines = [
      '<span class="text-cyan-300 font-semibold">Gemini Pro System Console — Available Directives:</span>',
      '  <span class="text-purple-300 font-mono">arch</span>       - Display high-level distributed system topology',
      '  <span class="text-purple-300 font-mono">bench</span>      - Run real-time latency & throughput benchmarks',
      '  <span class="text-purple-300 font-mono">projects</span>   - Enumerate production systems & open-source work',
      '  <span class="text-purple-300 font-mono">skills</span>     - Inspect multi-tier architecture & tech stack',
      '  <span class="text-purple-300 font-mono">probe</span>      - Ping live cluster nodes & measure RTT',
      '  <span class="text-purple-300 font-mono">prompt &lt;q&gt;</span> - Query the Gemini 2.0 reasoning engine with stream tokens',
      '  <span class="text-purple-300 font-mono">about</span>      - View core background & engineering philosophy',
      '  <span class="text-purple-300 font-mono">contact</span>    - Dispatch communications channel',
      '  <span class="text-purple-300 font-mono">clear</span>      - Flush terminal buffer'
    ];
    lines.forEach(l => this.appendLine(l));
  }

  cmdArch() {
    const ascii = [
      '<span class="text-cyan-400">================ GEMINI PRO DISTRIBUTED TOPOLOGY ================</span>',
      '  [Client Stream] --> [Edge Ingress: Cloudflare (Anycast)]',
      '                           | (mTLS / HTTP3)',
      '                     [API Gateway: Envoy & Rate Limiter]',
      '                           |',
      '          +----------------+----------------+',
      '          |                                 |',
      '  [Gemini Pro 2.0 Core]           [Agentic Mesh (Temporal)]',
      '    (MoE, 2M Context)               (Stateful DAG Loop)',
      '          |                                 |',
      '  +-------+-------+                 +-------+-------+',
      '  |               |                 |               |',
      '[Vector DB]  [Cache Tier 0]   [Event Broker]  [eBPF Tracing]',
      ' (Qdrant)       (Redis)          (Kafka)       (OpenTelemetry)',
      '<span class="text-slate-400">Architecture Spec: Multi-region failover, 99.999% SLA, &lt;18ms P99 latency.</span>'
    ];
    ascii.forEach(l => this.appendLine(`<span class="font-mono text-xs">${l}</span>`));
  }

  cmdBench() {
    this.appendLine('<span class="text-yellow-400 font-mono animate-pulse">Running cluster diagnostics & P99 latency matrix...</span>');
    setTimeout(() => {
      this.appendLine('  🌐 <span class="text-slate-300">Global Edge Ingress:</span> <span class="text-emerald-400 font-mono">11.4 ms</span> [P50] | <span class="text-emerald-400 font-mono">18.2 ms</span> [P99]');
      this.appendLine('  🛡️ <span class="text-slate-300">Auth & Signature Guard:</span> <span class="text-emerald-400 font-mono">3.1 ms</span> [Zero-Trust Verified]');
      this.appendLine('  🧠 <span class="text-slate-300">Gemini Pro 2.0 First Token (TTFT):</span> <span class="text-purple-400 font-mono">182 ms</span> [Streaming Active]');
      this.appendLine('  🗄️ <span class="text-slate-300">Vector Similarity Search (HNSW):</span> <span class="text-emerald-400 font-mono">7.8 ms</span> [Top-K=10]');
      this.appendLine('  💾 <span class="text-slate-300">Distributed Cache Read:</span> <span class="text-emerald-400 font-mono">0.68 ms</span> [Hit Rate: 98.6%]');
      this.appendLine('<span class="text-emerald-400 font-semibold">✔ SYSTEM HEALTH: OPTIMAL. Zero packet drop across 10,000 simulated iterations.</span>');
      this.scrollToBottom();
    }, 450);
  }

  cmdProjects() {
    const list = [
      '⚡ <span class="text-white font-bold">1. Hyperion AI Inference Mesh</span> — High-throughput distributed agent orchestration engine on Gemini Pro API.',
      '🌐 <span class="text-white font-bold">2. Aetheria Event Bus</span> — Real-time pub/sub mesh handling 500k msg/sec with eBPF metrics & WebAssembly filters.',
      '🧠 <span class="text-white font-bold">3. Cognitive Vector Pipeline</span> — Hybrid dense-sparse retrieval system with dynamic re-ranking & sub-10ms latency.',
      '🎨 <span class="text-white font-bold">4. Quantum UI Glass</span> — 60fps hardware-accelerated interactive canvas system designed for multimodal AI interfaces.'
    ];
    list.forEach(l => this.appendLine(l));
  }

  cmdSkills() {
    this.appendLine('<span class="text-cyan-300 font-semibold">Architectural Domains & Stack:</span>');
    this.appendLine('  • <span class="text-slate-200">Core Systems:</span> Go, Rust, Python, TypeScript, Node.js, C++');
    this.appendLine('  • <span class="text-slate-200">AI & Models:</span> Gemini 2.0/Pro, Multi-Modal RAG, Vector Search (Qdrant/Milvus), LangGraph, Temporal');
    this.appendLine('  • <span class="text-slate-200">Distributed Infra:</span> Kubernetes, Docker, Envoy, Redis Cluster, Kafka, Cloudflare Workers');
    this.appendLine('  • <span class="text-slate-200">Observability:</span> OpenTelemetry, Prometheus, Grafana, eBPF, Distributed Tracing');
    this.appendLine('  • <span class="text-slate-200">Frontend & UX:</span> Modern Canvas / WebGL, Tailwind CSS, Reactive State, Micro-interactions');
  }

  cmdProbe() {
    const hosts = ['us-east.gemini.mesh', 'eu-west.gemini.mesh', 'ap-southeast.gemini.mesh'];
    hosts.forEach((h, i) => {
      setTimeout(() => {
        const ms = (8 + Math.random() * 12).toFixed(1);
        this.appendLine(`PING ${h} (64 bytes): icmp_seq=${i+1} ttl=58 time=<span class="text-emerald-400">${ms} ms</span>`);
        this.scrollToBottom();
      }, (i + 1) * 220);
    });
  }

  cmdPrompt(query) {
    if (!query) {
      this.appendLine('<span class="text-yellow-400">Usage: prompt &lt;your question or topic&gt;</span>');
      this.appendLine('Example: <span class="text-purple-300 font-mono">prompt What are Mat\'s core strengths in system design?</span>');
      return;
    }

    this.appendLine(`<span class="text-purple-400 font-mono">Querying Gemini Pro 2.0 Reasoning Core...</span>`);
    
    // Simulate streaming token synthesis
    let responseText = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('strength') || qLower.includes('mat')) {
      responseText = `Mat Nemati combines deep distributed systems engineering with cutting-edge multimodal AI architecture. He specializes in designing low-latency inference pipelines, resilient event-driven architectures, and crafting intuitive, visually stunning developer experiences.`;
    } else if (qLower.includes('gemini') || qLower.includes('ai')) {
      responseText = `The Gemini Pro 2.0 reasoning tier leverages multi-modal transformer blocks, speculative draft decoding for sub-second responses, and deep agentic tool calling to synthesize actions across distributed services.`;
    } else {
      responseText = `Processed query: "${this.escapeHtml(query)}". System evaluates optimal convergence: architecture scales linearly with horizontal replicas, sub-millisecond cache hits, and zero single points of failure.`;
    }

    const words = responseText.split(' ');
    let wordIdx = 0;
    const responseEl = document.createElement('div');
    responseEl.className = 'text-cyan-200 text-xs sm:text-sm leading-relaxed pl-2 border-l-2 border-brand-500 my-1 font-sans';
    this.output.appendChild(responseEl);

    const streamInterval = setInterval(() => {
      if (wordIdx < words.length) {
        responseEl.textContent += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
        wordIdx++;
        this.scrollToBottom();
      } else {
        clearInterval(streamInterval);
        this.appendLine('<span class="text-[10px] font-mono text-slate-500">── Gemini 2.0 MoE inference completed in 142ms · 2M context active</span>');
        this.scrollToBottom();
      }
    }, 45);
  }

  cmdAbout() {
    this.appendLine('<span class="text-slate-300 leading-relaxed">Mat Nemati is a Systems Architect & Full-Stack AI Engineer passionate about distributed networks, high-throughput pipelines, and bringing elegant visual micro-interactions to modern web applications.</span>');
  }

  cmdContact() {
    this.appendLine('Dispatch target: <span class="text-cyan-400 font-mono">hello@matnemati.dev</span>');
    this.appendLine('You can also use the interactive dispatch terminal at the bottom of the page.');
  }

  cmdClear() {
    this.output.innerHTML = '';
  }

  appendLine(html) {
    const line = document.createElement('div');
    line.className = 'text-xs sm:text-sm font-mono leading-relaxed';
    line.innerHTML = html;
    this.output.appendChild(line);
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.GeminiTerminal = GeminiTerminal;
