import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section id="agency" className="relative py-28 md:py-36 bg-[#0c1128] overflow-hidden">
      {/* Center Ambient Purple Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Bold Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff] block mb-4">Our Philosophy</span>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter text-white leading-[1.1] mb-8">
              "Design is not just what it looks like. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                It's how it feels."
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-8" />
            <p className="font-light text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              We operate at the convergence of daring artistic vision and relentless software engineering. Every interaction, transition, and micro-moment is sculpted to forge memorable emotional connections.
            </p>
          </motion.div>

          {/* Right: Description & Metrics Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-10"
          >
            <p className="font-light text-gray-400 text-base leading-relaxed">
              Founded with a singular commitment to elevate digital craft, APEX partners with category-defining companies to construct flagship web presences that dominate search, engage users, and outpace competitors.
            </p>

            {/* 4-Stat Grid */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-white/10">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-black text-4xl sm:text-5xl text-white tracking-tight block mb-1">10+</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Years Experience</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-black text-4xl sm:text-5xl text-[#00f0ff] tracking-tight block mb-1">150+</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Global Clients</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-black text-4xl sm:text-5xl text-white tracking-tight block mb-1">98%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Success Rate</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-black text-4xl sm:text-5xl text-[#b026ff] tracking-tight block mb-1">24</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Awards Won</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
