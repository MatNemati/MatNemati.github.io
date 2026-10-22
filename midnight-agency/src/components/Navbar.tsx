import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl pointer-events-none transition-all duration-300">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto px-6 py-3.5 flex items-center justify-between border transition-all duration-300 shadow-2xl ${
          mobileMenuOpen ? 'rounded-3xl' : 'rounded-full'
        } ${
          isScrolled 
            ? 'bg-[#0c1128]/85 backdrop-blur-2xl border-white/20' 
            : 'bg-white/[0.03] backdrop-blur-md border-white/10'
        }`}
      >
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0c1128] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            </div>
          </div>
          <span className="font-black text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
            APEX<span className="text-[#00f0ff]">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#services" className="nav-link hover:text-white transition-colors">Services</a>
          <a href="#work" className="nav-link hover:text-white transition-colors">Work</a>
          <a href="#agency" className="nav-link hover:text-white transition-colors">Agency</a>
          <a href="#contact" className="nav-link hover:text-white transition-colors">Contact</a>
        </div>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            className="md:hidden w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto mt-2 bg-[#0c1128]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center md:hidden"
          >
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Services
            </a>
            <a 
              href="#work" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Work
            </a>
            <a 
              href="#agency" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Agency
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Contact
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-3 rounded-full bg-white text-black font-semibold text-sm uppercase tracking-wider"
            >
              Start Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
