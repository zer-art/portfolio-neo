import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ activePage, setActivePage }) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setActivePage('home')}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-black font-bold text-xl">
            P
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-widest">PAWAN</h1>
            <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-widest">PARIDA</h1>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0a0a0a] rounded-full p-1 border border-white/5">
          {navLinks.map((link) => {
            const isActive = activePage === link.id || (activePage === 'home' && link.id === 'home');
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <button className="btn-pill group hidden sm:inline-flex">
            <span className="btn-pill-text">Download CV</span>
            <div className="btn-pill-icon">
              <ArrowRight size={16} />
            </div>
          </button>
          
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-white hover:text-emerald-400 transition-colors">
            <Menu size={24} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
