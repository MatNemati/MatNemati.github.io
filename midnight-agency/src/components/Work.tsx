import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 'pixzen',
    name: 'Pixzen',
    category: 'Fintech Platform',
    badgeColor: 'text-[#00f0ff]',
    desc: 'Next-generation decentralised asset trading interface with micro-second latency execution.',
    image: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781522720269-Pixzen.webp',
  },
  {
    id: 'wander',
    name: 'Wander',
    category: 'Travel & Luxury',
    badgeColor: 'text-emerald-400',
    desc: 'Bespoke travel curator platform engineered with seamless 3D topographical map integration.',
    image: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781631791578-Wander_Hero.webp',
  },
  {
    id: 'agentify',
    name: 'Agentify',
    category: 'Autonomous AI',
    badgeColor: 'text-[#b026ff]',
    desc: 'Multi-agent autonomous workforce suite with real-time cognitive trace visualization.',
    image: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781671943344-Agentify_Hero.webp',
  },
  {
    id: 'future',
    name: 'Future',
    category: 'Smart Mobility',
    badgeColor: 'text-cyan-400',
    desc: 'Connected autonomous vehicle digital telemetry dashboard with real-time spatial physics.',
    image: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781679053418-Future_Carousel.webp',
  },
  {
    id: 'genova',
    name: 'Genova',
    category: 'Architecture',
    badgeColor: 'text-amber-400',
    desc: 'Virtual reality showroom and spatial interior showcase for premium European architecture.',
    image: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781670271708-Genova_Hero.webp',
  },
];

export const Work: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="relative py-28 md:py-36 bg-[#0c1128] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff] block mb-2">Portfolio</span>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter text-white">
              Our Works
            </h2>
          </div>
          <a href="#contact" className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Expanding Flex Gallery */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[420px] w-full">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={project.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                animate={{
                  flex: isActive ? 4 : 0.8,
                }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="relative rounded-3xl border border-white/10 group overflow-hidden cursor-pointer min-h-[140px] md:min-h-0"
              >
                {/* Background Image */}
                <img 
                  src={project.image} 
                  alt={`${project.name} showcase`} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <span className={`text-xs font-bold uppercase tracking-widest ${project.badgeColor} bg-black/50 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-white/10`}>
                    {project.category}
                  </span>

                  <div className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-80 md:opacity-40'}`}>
                    <h3 className="font-black text-2xl md:text-4xl text-white tracking-tight mb-2">
                      {project.name}
                    </h3>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-light text-gray-300 text-sm max-w-sm mb-4 line-clamp-2 md:line-clamp-none">
                          {project.desc}
                        </p>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#00f0ff] transition-colors">
                          <span>View Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
