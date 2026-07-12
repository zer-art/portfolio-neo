import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Download } from 'lucide-react';

const Sidebar = ({ profile, resumes, activeRole, setActiveRole }) => {
  // Format role names for display
  const formatRoleName = (key) => {
    if (key === 'master') return 'Master Profile';
    return key
      .split(/[-_]/)
      .map(word => {
        if (word.toLowerCase() === 'ai' || word.toLowerCase() === 'ml') return word.toUpperCase();
        if (word.toLowerCase() === 'cv') return 'CV';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  const roles = ['master', ...Object.keys(resumes)];

  // Clean social links helper
  const getFullUrl = (type, val) => {
    if (!val) return '#';
    if (type === 'email') return `mailto:${val}`;
    if (type === 'phone') return `tel:${val}`;
    if (val.startsWith('http')) return val;
    return `https://${val}`;
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 md:fixed md:top-0 md:left-0 md:h-screen p-6 md:p-10 border-b md:border-b-0 md:border-r border-neutral-900 flex flex-col justify-between bg-[#030303] z-10 overflow-y-auto custom-scrollbar">
      <div>
        {/* Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Available for internships</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 font-sans">
            {profile.name}
          </h1>
          <p className="text-xs font-mono tracking-wider text-neutral-500 mt-2 uppercase">
            AI Engineer & Data Scientist
          </p>
        </div>

        {/* Contacts */}
        <div className="space-y-3 mb-10 text-xs font-mono">
          <div className="flex items-center gap-3 text-neutral-400">
            <MapPin size={13} className="text-neutral-600" />
            <span>{profile.location}</span>
          </div>
          {profile.email && (
            <a
              href={getFullUrl('email', profile.email)}
              className="flex items-center gap-3 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Mail size={13} className="text-neutral-600" />
              <span className="truncate">{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <a
              href={getFullUrl('phone', profile.phone)}
              className="flex items-center gap-3 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Phone size={13} className="text-neutral-600" />
              <span>{profile.phone}</span>
            </a>
          )}
        </div>

        {/* Role Selector / Resume Config Toggles */}
        <div className="mb-10">
          <h3 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-4">
            Resume Views / Filters
          </h3>
          <nav className="flex flex-col gap-1">
            {roles.map((role) => {
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? 'bg-neutral-900 border border-neutral-800 text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-950/50 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-1 h-1 rounded-full transition-transform duration-300 ${
                        isActive ? 'bg-neutral-200 scale-100' : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-neutral-700'
                      }`}
                    ></span>
                    {formatRoleName(role)}
                  </span>
                  {isActive && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Details & PDF Download & Social Links */}
      <div className="mt-auto pt-6 border-t border-neutral-900/60">
        {/* Dynamic PDF Download Button */}
        {activeRole !== 'master' ? (
          <a
            href={`./public/${activeRole}_resume.pdf`}
            download
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-5 border border-neutral-800 hover:border-neutral-600 rounded-lg text-xs font-mono text-neutral-300 hover:text-neutral-100 transition-all bg-neutral-950 hover:bg-neutral-900 shadow-sm"
          >
            <Download size={13} />
            <span>Download {formatRoleName(activeRole)} PDF</span>
          </a>
        ) : (
          <a
            href="./public/Pawan_Parida_Resume.pdf"
            download
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-5 border border-neutral-800 hover:border-neutral-600 rounded-lg text-xs font-mono text-neutral-300 hover:text-neutral-100 transition-all bg-neutral-950 hover:bg-neutral-900 shadow-sm"
          >
            <Download size={13} />
            <span>Download Resume PDF</span>
          </a>
        )}

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-neutral-500 mb-6">
          {profile.github && (
            <a
              href={getFullUrl('github', profile.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors"
              title="GitHub"
            >
              <Github size={16} />
            </a>
          )}
          {profile.linkedin && (
            <a
              href={getFullUrl('linkedin', profile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          )}
          {profile.website && (
            <a
              href={getFullUrl('website', profile.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors"
              title="Website"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        <p className="text-[10px] font-mono text-neutral-600">
          &copy; {new Date().getFullYear()} Pawan Parida. Built with React & Tailwind.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
