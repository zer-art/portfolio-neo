import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Download, BookOpen, Briefcase, Award, FolderGit2, GitPullRequest, ChevronRight, ChevronDown } from 'lucide-react';

// Section nav config
const NAV_PAGES = [
  { id: 'education', label: 'Education', Icon: BookOpen },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'certifications', label: 'Certifications', Icon: Award },
  {
    id: 'projects',
    label: 'Projects',
    Icon: FolderGit2,
    subsections: [
      { id: 'projects-llm', label: 'LLM' },
      { id: 'projects-cv', label: 'Computer Vision' },
      { id: 'projects-ml', label: 'Machine Learning' },
      { id: 'projects-se', label: 'Software Engineering' },
    ],
  },
  { id: 'open-source', label: 'Open Source', Icon: GitPullRequest },
];

const Sidebar = ({ profile, resumes, activeRole, activePage, setActiveRole, setActivePage }) => {
  const [isResumesExpanded, setIsResumesExpanded] = useState(false);

  const formatRoleName = (key) => {
    if (key === 'master') return 'Master Profile';
    if (key === 'PythonDev') return 'Python Developer';
    if (key === 'AiDev') return 'AI Developer';
    return key;
  };

  const getFullUrl = (type, val) => {
    if (!val) return '#';
    if (type === 'email') return `mailto:${val}`;
    if (type === 'phone') return `tel:${val}`;
    if (val.startsWith('http')) return val;
    return `https://${val}`;
  };

  const roles = ['master', ...Object.keys(resumes)];

  return (
    <aside className="bento-card w-full lg:w-[340px] lg:sticky lg:top-8 flex-shrink-0 flex flex-col gap-8 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">

      {/* Identity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">Available for hire</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            {profile.name}
          </h1>
          <p className="text-sm font-medium text-neutral-400">
            AI Engineer & Data Scientist
          </p>
        </div>

        {/* Contacts */}
        <div className="space-y-2 text-sm pt-2">
          <div className="flex items-center gap-3 text-neutral-300">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-neutral-400" />
            </div>
            <span>{profile.location}</span>
          </div>
          {profile.email && (
            <a href={getFullUrl('email', profile.email)}
              className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                <Mail size={14} className="text-neutral-400 group-hover:text-white" />
              </div>
              <span className="truncate">{profile.email}</span>
            </a>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 pt-2">
          {profile.github && (
            <a href={getFullUrl('github', profile.github)} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-neutral-400 hover:text-white" title="GitHub">
              <Github size={18} />
            </a>
          )}
          {profile.linkedin && (
            <a href={getFullUrl('linkedin', profile.linkedin)} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-neutral-400 hover:text-white" title="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {profile.website && (
            <a href={getFullUrl('website', profile.website)} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-neutral-400 hover:text-white" title="Website">
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Resume Filter Buttons */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Resume View</p>
        <nav className="flex flex-col gap-1.5">
          {(() => {
            const role = 'master';
            const isActive = activeRole === role && activePage === 'home';
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`w-full text-left py-2 px-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {formatRoleName(role)}
                </span>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 text-black/70 px-2 py-0.5 rounded-full">Active</span>
                )}
              </button>
            );
          })()}

          {Object.keys(resumes).length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <button
                onClick={() => setIsResumesExpanded(!isResumesExpanded)}
                className="w-full text-left py-2 px-3.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>Filtered Resumes</span>
                </span>
                {isResumesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {isResumesExpanded && (
                <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-white/5 ml-3 mt-1">
                  {Object.keys(resumes).map((role) => {
                    const isActive = activeRole === role && activePage === 'home';
                    return (
                      <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`w-full text-left py-1.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                          isActive
                            ? 'bg-white text-black shadow-md'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {formatRoleName(role)}
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 text-black/70 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Section Navigation */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Navigation</p>
        <nav className="flex flex-col gap-1.5">
          {NAV_PAGES.map(({ id, label, Icon, subsections }) => {
            const isActive = activePage === id;
            return (
              <div key={id}>
                <button
                  onClick={() => setActivePage(id)}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'} />
                  {label}
                </button>

                {subsections && (
                  <div className="ml-5 pl-4 border-l-2 border-white/5 mt-1 mb-2 flex flex-col gap-1">
                    {subsections.map(({ id: subId, label: subLabel }) => (
                      <button
                        key={subId}
                        onClick={() => {
                          setActivePage(id);
                          setTimeout(() => {
                            const el = document.getElementById(subId);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 120);
                        }}
                        className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-white transition-colors"
                      >
                        {subLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex-1" />

      {/* PDF Download */}
      <div className="pt-2">
        <a
          href={activeRole !== 'master' ? `./public/${activeRole}_resume.pdf` : './public/Pawan_Parida_Resume.pdf'}
          download
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg shadow-white/10"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
