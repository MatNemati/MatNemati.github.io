import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ShoppingBag, Hexagon, Tv, Globe2, CreditCard } from 'lucide-react';

const clients = [
  { name: 'Instagram', icon: Camera, color: 'text-[#00f0ff]' },
  { name: 'Shopify', icon: ShoppingBag, color: 'text-green-400' },
  { name: 'HubSpot', icon: Hexagon, color: 'text-orange-400' },
  { name: 'CNBC', icon: Tv, color: 'text-blue-400' },
  { name: 'BUSINESS INSIDER', icon: Globe2, color: 'text-[#b026ff]' },
  { name: 'stripe', icon: CreditCard, color: 'text-indigo-400' },
];

export const Clients: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#0c1128] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Trusted by 300+ forward-thinking businesses worldwide
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#00f0ff]">
          Interested?
        </span>
      </div>

      {/* Ticker Container with Faded Gradient Edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#0c1128] to-transparent z-10 pointer-events-none"></div>
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#0c1128] to-transparent z-10 pointer-events-none"></div>

        {/* Animated Marquee Strip */}
        <motion.div 
          className="flex items-center gap-16 py-2 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {/* Double array for seamless infinite looping */}
          {[...clients, ...clients].map((client, idx) => {
            const Icon = client.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer text-xl font-bold tracking-tight"
              >
                <Icon className={`w-6 h-6 ${client.color}`} />
                <span>{client.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
