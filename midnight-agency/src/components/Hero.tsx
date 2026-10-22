import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Circle clip-path expands from 0% to 150%
  const clipRadius = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const clipPathStyle = useTransform(clipRadius, (val) => `circle(${val}% at 50% 50%)`);

  // Subtle zoom on the realistic reveal image (1 to 1.15)
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Fade scroll indicator
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section ref={containerRef} id="hero" className="relative w-full h-[300vh] bg-[#0c1128]">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ================= BASE LAYER (Outline Sketch) ================= */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/cloudinary/hero_city_outline_fzg37d.jpg" 
            alt="Architectural city sketch outline" 
            className="w-full h-full object-cover object-center filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-[#0c1128]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1128] via-transparent to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Pioneering Digital Form</span>
            </div>
            <h1 className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-white leading-[1.05] max-w-5xl">
              Imagine The Future
            </h1>
            <p className="font-light text-base sm:text-xl text-gray-300 max-w-2xl mt-6 leading-relaxed">
              Where unconstrained architectural imagination outlines the next generation of digital excellence.
            </p>
          </div>
        </div>

        {/* ================= TOP LAYER (Realistic Reveal via Clip-Path) ================= */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: clipPathStyle }}
        >
          <motion.img 
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/cloudinary/hero_city_iglhwn.jpg" 
            alt="Realistic futuristic city skyline" 
            className="w-full h-full object-cover object-center"
            style={{ scale: imageScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1128]/40 via-transparent to-[#0c1128]/80"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#b026ff]"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                State-of-the-Art Execution
              </span>
            </div>
            <h2 className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 leading-[1.05] max-w-5xl">
              Build The Reality
            </h2>
            <p className="font-medium text-base sm:text-xl text-gray-200 max-w-2xl mt-6 leading-relaxed">
              Engineered precision, fluid interactions, and boundary-pushing web experiences brought to life.
            </p>
          </div>
        </motion.div>

        {/* ================= SCROLL DOWN INDICATOR ================= */}
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none text-gray-400"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest">Scroll To Reveal</span>
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4 text-[#00f0ff]" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
