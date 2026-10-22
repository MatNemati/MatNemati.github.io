import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Star, ArrowUpRight, Maximize2, Zap, Layout,
  ChevronLeft, ChevronRight, Check, ChevronDown, ArrowUp
} from 'lucide-react';
import { heroVertexShader, heroFragmentShader } from './shaders/heroShader';

// WebGL Background Shader Plane
function ShaderBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  });

  useFrame((state) => {
    uniforms.current.u_time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 1000], [0, 400]);

  // Project Cards Data
  const projects = [
    {
      id: "01",
      tag: "2026 • Tech • Web Platform",
      title: "Aura Spatial Audio Engine",
      desc: "An interactive WebGL soundscape platform designed for next-generation spatial computing and acoustic architectural simulation.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      bg: "#f8f9fa"
    },
    {
      id: "02",
      tag: "2026 • Fintech • Mobile App",
      title: "Veloce Quantum Exchange",
      desc: "Decentralized institutional trading terminal combining micro-latency order books with cinematic real-time market depth visualization.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      bg: "#f1f5f9"
    },
    {
      id: "03",
      tag: "2026 • AI • Workflow Suite",
      title: "Synapse Neural Workspace",
      desc: "Generative AI workspace engineered for cross-disciplinary research teams, featuring intuitive node graphs and dynamic knowledge synthesizers.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
      bg: "#f4f4f5"
    }
  ];

  return (
    <div className="bg-[#0d0d0d] text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-6 flex items-center justify-between text-white pointer-events-none">
        <a href="#hero" className="pointer-events-auto flex items-center gap-2 group">
          <svg className="w-8 h-8 text-white transition-transform group-hover:rotate-45 duration-500" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2.5"/>
            <circle cx="16" cy="16" r="5" fill="currentColor"/>
            <path d="M16 4v8M16 20v8M4 16h8M20 16h8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="font-display font-bold text-2xl tracking-tight">Oynta</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 pointer-events-auto text-sm font-medium tracking-wide">
          <a href="#services" className="hover:text-gray-300 transition-colors">Services</a>
          <a href="#projects" className="hover:text-gray-300 transition-colors">Work</a>
          <a href="#about" className="hover:text-gray-300 transition-colors">About</a>
          <a href="#team" className="hover:text-gray-300 transition-colors">Team</a>
          <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
          <a href="#footer" className="px-5 py-2 rounded-full border border-white/40 hover:bg-white hover:text-black transition-all">Contact</a>
        </nav>

        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden pointer-events-auto p-2" aria-label="Toggle Menu">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#0d0d0d] text-white flex flex-col justify-center px-8"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400">
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-6 text-3xl font-display font-bold">
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Work</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#team" onClick={() => setMobileMenuOpen(false)}>Team</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section id="hero" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <Canvas dpr={[1, 2]}>
            <ShaderBackground />
          </Canvas>
        </div>

        <motion.div style={{ y: heroParallaxY }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-16 lg:px-24">
          <h1 className="font-display font-bold text-5xl md:text-[104px] leading-[1.08] tracking-tight max-w-5xl">
            We create smart &amp; effective digital{' '}
            <span className="inline-flex items-baseline relative">
              solutio
              <span className="relative">
                n
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-full top-[52%] -translate-y-1/2 ml-4 w-[120px] md:w-[420px] h-3 bg-white rounded-r-full inline-block origin-left"
                />
              </span>
            </span>
          </h1>
          <p className="mt-8 text-lg text-gray-400 max-w-xl font-light">
            Pioneering award-winning digital experiences, bespoke WebGL interactions, and high-impact web platforms.
          </p>
        </motion.div>

        {/* Rotating Circular Badge */}
        <div className="absolute bottom-12 right-12 z-20">
          <div className="relative flex items-center justify-center w-36 h-36">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              className="absolute inset-0"
            >
              <svg className="w-full h-full" viewBox="0 0 140 140">
                <path id="badgePath" d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill="none" />
                <text fill="#ffffff" fontSize="11" fontWeight="600" letterSpacing="3.8">
                  <textPath href="#badgePath">START A PROJECT • START A PROJECT •</textPath>
                </text>
              </svg>
            </motion.div>
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 fill-black text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="bg-white text-black py-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-display font-bold text-5xl mb-16">Capabilities &amp; Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ArrowUpRight, title: 'Creative Direction', desc: 'Brand narrative and visual systems that elevate your identity.' },
              { icon: Maximize2, title: '3D & WebGL', desc: 'Interactive 3D environments and custom GLSL shader choreography.' },
              { icon: Zap, title: 'Modern Frontend', desc: 'Ultra-fast React & TypeScript architectures with fluid transitions.' },
              { icon: Layout, title: 'Product Systems', desc: 'Design tokens and accessible component libraries built for scale.' }
            ].map((srv, i) => (
              <div key={i} className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-black transition-all">
                <srv.icon className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="font-display font-bold text-2xl mb-3">{srv.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects (Interactive Stacked Cards) */}
      <section id="projects" className="bg-white text-black py-32 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="font-display font-bold text-5xl">Featured Projects</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveCardIndex((activeCardIndex - 1 + projects.length) % projects.length)}
                className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveCardIndex((activeCardIndex + 1) % projects.length)}
                className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[600px] flex items-center justify-center">
            {projects.map((proj, idx) => {
              const offset = (idx - activeCardIndex + projects.length) % projects.length;
              return (
                <motion.div
                  key={proj.id}
                  animate={{
                    y: offset * -30,
                    scale: 1 - offset * 0.05,
                    zIndex: 30 - offset * 10,
                    opacity: 1 - offset * 0.15
                  }}
                  drag={offset === 0 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -100) setActiveCardIndex((activeCardIndex + 1) % projects.length);
                    if (info.offset.x > 100) setActiveCardIndex((activeCardIndex - 1 + projects.length) % projects.length);
                  }}
                  className="absolute w-full max-w-[1240px] h-[540px] rounded-3xl p-12 shadow-2xl border border-neutral-200 flex gap-8 items-center cursor-grab"
                  style={{ backgroundColor: proj.bg }}
                >
                  <div className="w-1/2 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block mb-4">{proj.tag}</span>
                      <h3 className="font-display font-bold text-4xl mb-4">{proj.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{proj.desc}</p>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-black text-white w-fit text-sm font-medium">View case study</button>
                  </div>
                  <div className="w-1/2 h-full rounded-2xl overflow-hidden relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer id="footer" className="bg-[#0d0d0d] text-white py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-display font-extrabold text-7xl md:text-9xl tracking-tight mb-8">
            Let’s shape<br />something new.
          </h2>
          <a href="mailto:hello@oynta.agency" className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all">
            Contact us — hello@oynta.agency
          </a>
        </div>
      </footer>
    </div>
  );
}
