import React from 'react';
import { Download } from 'lucide-react';

const Navbar = ({ activePage, setActivePage }) => {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'open-source', label: 'Contributions' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#000000]/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo — left */}
        <div
          className="text-xl font-black text-white tracking-widest uppercase cursor-pointer shrink-0"
          onClick={() => setActivePage('home')}
        >
          Pawan<span className="text-emerald-400">.</span>
        </div>

        {/* Nav Links — center */}
        <ul className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {links.map(link => (
            <li key={link.id}>
              <button
                onClick={() => setActivePage(link.id)}
                className={`text-xs font-bold transition-colors uppercase tracking-widest pb-0.5 border-b-2 ${
                  activePage === link.id
                    ? 'text-emerald-400 border-emerald-400'
                    : 'text-neutral-500 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Download Resume — right */}
        <a
          href="/PythonDev_resume.pdf"
          download
          className="hidden md:inline-flex items-center gap-2 btn-pill group shrink-0"
        >
          <span className="btn-pill-text">Resume</span>
          <div className="btn-pill-icon"><Download size={14} /></div>
        </a>

        {/* Mobile menu indicator */}
        <div className="md:hidden text-neutral-500 text-xs font-bold tracking-widest">MENU</div>
      </div>
    </nav>
  );
};

export default Navbar;