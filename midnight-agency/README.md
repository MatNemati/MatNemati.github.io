# APEX Midnight — Elite Digital Agency Website (Site 2)

An award-winning, highly interactive, and futuristic digital agency web experience built according to precision specifications.

---

## 🚀 Live Local Access
The project is running on your local machine:
- **Local URL**: [http://localhost:8002](http://localhost:8002)
- **Local Directory**: `/home/matnemati/Desktop/Site 2 - Midnight Agency/`

---

## 🎨 Visual Design System & Technical Specifications

### 1. Color Palette
- **Primary Background**: `#0c1128` (Deep Midnight Blue)
- **Primary Text**: `#ffffff` (Pure White)
- **Secondary Text**: `#9ca3af` (Gray 400), `#d1d5db` (Gray 300)
- **Muted Text**: `#4b5563` (Gray 600)
- **Accent Custom Variables**:
  - Neon Blue: `#00f0ff`
  - Neon Purple: `#b026ff`
- **Tailwind Gradients & Accents**:
  - `from-blue-400 to-purple-500`
  - `from-blue-200 to-purple-200`
- **Overlays & Borders**:
  - Light/Glass borders: `border-white/5`, `border-white/10`, `border-white/20`, `border-white/30`
  - Dark/Shadow overlays: `bg-black/40`, `bg-black/60`, `bg-black/90`

### 2. Typography
- **Font Family**: `Outfit`, sans-serif (Google Fonts weights 300 through 900)
- **Headings**: `font-black` (900), `tracking-tighter`, tight line heights (`leading-[1.05]` - `leading-tight`)
- **Body**: `font-light` (300) / `font-medium` (500), relaxed line height
- **Accents/Badges**: `text-xs font-bold uppercase tracking-widest`

---

## 🛠 Features Implemented

1. **Navbar**:
   - Fixed pill-shaped navigation (`max-w-5xl`, `top-6`) with glassmorphism border (`border-white/10`).
   - Scroll transition on 0-50px (increased backdrop blur from 12px to 24px and darker background).
   - Expanding gradient underline on link hover (`after:w-0` to `after:w-full`).
   - "Start Project" pill button with ambient glow shadow.
   - Fully interactive mobile hamburger menu dropdown.

2. **Hero Section (Scroll-Based Masking 300vh)**:
   - Full `300vh` section height with `sticky top-0 h-screen` container.
   - **Base Layer**: Architectural city sketch outline (`hero_city_outline_fzg37d.jpg`) + "Imagine The Future".
   - **Top Layer**: Realistic city skyline (`hero_city_iglhwn.jpg`) + "Build The Reality".
   - **Dynamic Reveal**: `clipPath: circle(0% to 150% at 50% 50%)` smoothly driven by scroll progress.
   - **Subtle Zoom**: Scale expands from `1` to `1.15`.
   - **Scroll Indicator**: Bouncing Chevron button that fades away upon scrolling.

3. **Clients (Infinite Ticker)**:
   - "Trusted by 300+ businesses" with "Interested?" pill badge.
   - Lucide icons mapped to brand text: Instagram, Shopify, HubSpot, CNBC, BUSINESS INSIDER, Stripe.
   - Left and right gradient fade masks (`from-[#0c1128] to-transparent`).
   - Seamless continuous 35s linear infinite animation.

4. **Services (2x2 Grid with Quarter-Circle Corners)**:
   - 4 glassmorphic cards (`rounded-3xl`, `bg-white/5`, `border-white/10`).
   - Bespoke quarter-circle shapes in top-right corners holding Lucide icons (`layout`, `palette`, `cpu`, `trending-up`).
   - Interactive hover states and category tags.

5. **Work (Expanding Flex Gallery)**:
   - 5 projects arranged horizontally (`h-[420px]`):
     1. Pixzen (Fintech Platform)
     2. Wander (Travel & Luxury)
     3. Agentify (Autonomous AI)
     4. Future (Smart Mobility)
     5. Genova (Architecture)
   - Dynamic flex accordion: Active project expands to `flex: 4`, inactive shrink to `flex: 0.8` (`cubic-bezier(0.25, 1, 0.5, 1)`).
   - Smooth image zoom on hover (`scale-105 duration-1000`).

6. **About (Split Content)**:
   - Bold headline: *"Design is not just what it looks like. It's how it feels."*
   - Ambient purple background blur circle (`500px`, `bg-purple-500/10 blur-[140px]`).
   - Metric cards: 10+ Years Experience, 150+ Global Clients, 98% Success Rate, 24 Awards.

7. **Footer**:
   - Massive CTA: *"Let's Create Something Epic."*
   - Glowing pill action button.
   - 4-column directory (Brand, Navigation, Socials, Contact).
   - Bottom legal bar.

---

## 📁 Project Architecture
```
Site 2 - Midnight Agency/
├── index.html               # Instant standalone browser-ready implementation
├── package.json             # Modular React + Vite configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── README.md                # Documentation & feature summary
└── src/
    ├── main.tsx             # React entry point
    ├── App.tsx              # Main application layout
    ├── index.css            # Styles & utility definitions
    └── components/
        ├── Navbar.tsx       # Glassmorphism navbar with scroll blur
        ├── Hero.tsx         # 300vh scroll-driven clipPath masking hero
        ├── Clients.tsx      # Infinite logo ticker with gradient fades
        ├── Services.tsx     # 2x2 grid with corner quarter-circles
        ├── Work.tsx         # Expanding flex accordion gallery
        ├── About.tsx        # Split philosophy & metrics grid
        └── Footer.tsx       # Massive CTA & 4-column directory
```
