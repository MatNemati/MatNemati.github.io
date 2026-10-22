import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Palette, Cpu, TrendingUp } from 'lucide-react';

const services = [
  {
    number: '01 / Experience',
    title: 'UI/UX Experience Design',
    desc: 'Human-centered interfaces crafted with surgical precision. We build intuitive design systems, frictionless flows, and reactive interactions that drive engagement.',
    icon: Layout,
    accent: '#00f0ff',
    badgeColor: 'text-blue-400',
    cornerGradient: 'from-blue-500/20 to-purple-500/20',
    tags: ['Design Systems', 'Micro-Interactions', 'User Testing'],
  },
  {
    number: '02 / Identity',
    title: 'Visual Graphic & Identity',
    desc: 'Distinctive visual identities that command authority in saturated markets. From bespoke 3D assets to full corporate design manuals and typographic systems.',
    icon: Palette,
    accent: '#b026ff',
    badgeColor: 'text-purple-400',
    cornerGradient: 'from-purple-500/20 to-pink-500/20',
    tags: ['Brand Architecture', '3D Motion', 'Typography'],
  },
  {
    number: '03 / Engineering',
    title: 'Digital Strategy & Architecture',
    desc: 'Robust engineering foundations engineered for high-throughput velocity. Modern frontend stacks, cloud-native deployments, and sub-second load times.',
    icon: Cpu,
    accent: '#22d3ee',
    badgeColor: 'text-cyan-400',
    cornerGradient: 'from-cyan-500/20 to-blue-500/20',
    tags: ['Next.js & Vite', 'API Orchestration', 'WebGL Engines'],
  },
  {
    number: '04 / Growth',
    title: 'Business Growth & Analytics',
    desc: 'Scientific conversion rate optimization (CRO) coupled with real-time behavioural analytics to continuously compound enterprise revenue and user retention.',
    icon: TrendingUp,
    accent: '#34d399',
    badgeColor: 'text-emerald-400',
    cornerGradient: 'from-emerald-500/20 to-teal-500/20',
    tags: ['Conversion Funnels', 'A/B Testing', 'Event Telemetry'],
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" class="relative py-28 md:py-36 bg-[#0c1128] overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff] block mb-3">Our Core Disciplines</span>
          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter text-white leading-tight">
            Services Built Specifically For Your Business
          </h2>
          <p className="font-light text-gray-400 text-base sm:text-lg mt-5 leading-relaxed">
            Comprehensive capabilities uniting deep technical competence with world-class aesthetic discernment.
          </p>
        </motion.div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="relative bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-3xl p-8 sm:p-10 transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[320px]"
              >
                {/* Corner Quarter Circle with Icon */}
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${item.cornerGradient} rounded-bl-full flex items-start justify-end p-5 border-b border-l border-white/10 transition-colors`}>
                  <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" style={{ color: item.accent }} />
                </div>

                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${item.badgeColor} mb-3 block`}>
                    {item.number}
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-white tracking-tight mb-4">
                    {item.title}
                  </h3>
                  <p className="font-light text-gray-300 text-sm sm:text-base leading-relaxed max-w-md">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2 text-xs font-medium text-gray-400">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
