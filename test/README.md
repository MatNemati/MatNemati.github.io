# Mat Nemati — Gemini Pro System Design Personal Site

A high-performance personal portfolio and interactive system architecture playground built in the signature **Google Gemini Pro** aesthetic, featuring real-time mouse physics, draggable system topology, and an interactive AI terminal console.

---

## ✨ Features & Mouse Interactions

### 1. 🖱️ Dynamic Mouse Particle Physics Canvas (`canvas-background.js`)
- **Gravitational Pull**: Background neural constellations gravitationally attract towards the user's cursor within a 180px radius.
- **Velocity Sparks**: Quick cursor movements emit a multi-color Gemini stardust spark trail (Google Blue, Cyan, Violet, Pink).
- **Shockwave Ripple**: Mouse clicks emit expanding radial shockwaves that physically disperse surrounding particles with smooth spring damping.

### 2. 🧠 Interactive System Design Topology (`system-topology.js`)
- **Draggable Distributed Nodes**: Click and drag any node (Client Mesh, Edge Ingress, API Gateway, Gemini Pro 2.0 MoE, Agentic DAG, Vector DB, Sharded Cache, Telemetry Bus) with organic spring physics.
- **Mouse Proximity Probe**: When moving the cursor over the topology canvas, a dynamic dotted probe line connects the user's cursor to the nearest architectural node.
- **Hover Telemetry Readout**: Hovering over any node highlights its upstream and downstream data conduits and updates the telemetry card with real-time throughput, P99 latency, and architectural specifications.
- **Interactive Controls**:
  - `Trace Flow`: Simulates end-to-end multimodal query traversal through the pipeline.
  - `⚡ Stress Test`: Floods the mesh with high-velocity data packets.
  - `↺ Reset`: Re-balances all nodes to their default layout.

### 3. 🃏 3D Perspective Card Tilt
- All project and capability cards feature dynamic 3D perspective physics (`perspective(1000px) rotateX(...) rotateY(...)`) that tilt towards the user's mouse coordinates.
- Dynamic radial spotlight reflection tracks underneath the translucent glass surface.

### 4. ⌨️ Gemini Pro Interactive System Console (`terminal.js`)
- Full interactive shell with built-in commands:
  - `arch` — Render high-level distributed topology diagram.
  - `bench` — Run real-time P99 latency & cluster throughput diagnostics.
  - `projects` — Enumerate production systems.
  - `skills` — Inspect multi-tier architecture & tech stack.
  - `probe` — Ping global mesh regions.
  - `prompt <query>` — Real-time simulated token streaming from Gemini Pro 2.0 reasoning engine.
  - `clear` — Clear terminal buffer.
- One-click directive chips for instant execution.

### 5. 🔊 Web Audio API Synthesizer
- Zero audio asset dependencies: uses native browser oscillator nodes for tactile sci-fi sound feedback on button clicks and packet traces.
- Mute/Unmute toggle in the top header.

---

## 🚀 How to Run & Preview

### Local Python HTTP Server
From within the `personal-site` directory:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in any browser.

### Direct File Open
You can also open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge).

---

## 🛠️ Tech Stack & Architecture
- **HTML5 & Vanilla JavaScript**: Zero build steps, zero npm dependencies, instant loading.
- **Tailwind CSS (CDN)**: Modern responsive utility classes.
- **HTML5 2D Canvas**: 60fps hardware-accelerated particle engine and interactive graph renderer.
- **Web Audio API**: Real-time synthesized acoustic micro-interactions.
