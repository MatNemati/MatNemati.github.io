import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative bg-[#080c1d] border-t border-white/10 pt-28 pb-16 overflow-hidden">
      {/* Ambient Accent Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Big CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff] block mb-4">Ready To Begin?</span>
          <h2 className="font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter text-white leading-tight mb-8">
            Let’s Create <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300">
              Something Epic.
            </span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:hello@apexmidnight.agency" 
              className="px-9 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              Start A Project
            </a>
            <a 
              href="#services" 
              className="px-8 py-4 rounded-full border border-white/15 text-white font-medium text-sm hover:bg-white/5 transition-colors"
            >
              Explore Capabilities
            </a>
          </div>
        </motion.div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10 text-sm">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#0c1128] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                </div>
              </div>
              <span className="font-black text-lg tracking-tight text-white">APEX<span className="text-[#00f0ff]">.</span></span>
            </div>
            <p className="font-light text-gray-400 text-sm leading-relaxed mb-4">
              Elite digital agency crafting category-defining web experiences, brand identities, and high-performance digital products.
            </p>
            <p className="text-xs text-gray-500">San Francisco • London • Berlin</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-4">Navigation</h4>
            <ul className="space-y-2.5 font-light text-gray-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#work" className="hover:text-white transition-colors">Selected Work</a></li>
              <li><a href="#agency" className="hover:text-white transition-colors">Agency Philosophy</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-4">Connect</h4>
            <ul className="space-y-2.5 font-light text-gray-400">
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter / X</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Dribbble</a></li>
            </ul>
          </div>

          {/* Contact Detail */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-4">New Inquiries</h4>
            <p className="font-light text-gray-400 text-sm mb-2">Have a project in mind?</p>
            <a href="mailto:hello@apexmidnight.agency" className="text-sm font-semibold text-[#00f0ff] hover:underline block mb-4">
              hello@apexmidnight.agency
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our team responds to qualified inquiries within 24 hours.
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 APEX Midnight Agency Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
