import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Download, BookOpen, Briefcase, Award, FolderGit2, GitPullRequest, ChevronRight } from 'lucide-react';

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
    <aside className="w-full md:w-80 lg:w-96 md:fixed md:top-0 md:left-0 md:h-screen p-5 md:p-7 border-b md:border-b-0 md:border-r border-neutral-900 flex flex-col gap-4 bg-[#030303] z-10 overflow-y-auto custom-scrollbar">

      {/* Identity */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Available for internships</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-100 font-sans leading-tight">
            {profile.name}
          </h1>
          <p className="text-[11px] font-mono tracking-wider text-neutral-500 mt-1.5 uppercase">
            AI Engineer & Data Scientist
          </p>
        </div>

        {/* Contacts */}
        <div className="space-y-1 text-[11px] font-mono">
          <div className="flex items-center gap-2.5 text-neutral-400">
            <MapPin size={12} className="text-neutral-600 flex-shrink-0" />
            <span>{profile.location}</span>
          </div>
          {profile.email && (
            <a href={getFullUrl('email', profile.email)}
              className="flex items-center gap-2.5 text-neutral-400 hover:text-neutral-200 transition-colors">
              <Mail size={12} className="text-neutral-600 flex-shrink-0" />
              <span className="truncate">{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <a href={getFullUrl('phone', profile.phone)}
              className="flex items-center gap-2.5 text-neutral-400 hover:text-neutral-200 transition-colors">
              <Phone size={12} className="text-neutral-600 flex-shrink-0" />
              <span>{profile.phone}</span>
            </a>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-neutral-500">
          {profile.github && (
            <a href={getFullUrl('github', profile.github)} target="_blank" rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors" title="GitHub">
              <Github size={15} />
            </a>
          )}
          {profile.linkedin && (
            <a href={getFullUrl('linkedin', profile.linkedin)} target="_blank" rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors" title="LinkedIn">
              <Linkedin size={15} />
            </a>
          )}
          {profile.website && (
            <a href={getFullUrl('website', profile.website)} target="_blank" rel="noopener noreferrer"
              className="hover:text-neutral-200 transition-colors" title="Website">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-900" />

      {/* Resume Filter Buttons */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">Resume View</p>
        <nav className="flex flex-col gap-1">
          {roles.map((role) => {
            const isActive = activeRole === role && activePage === 'home';
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-mono transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? 'bg-neutral-900 border border-neutral-800 text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-950 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-neutral-200' : 'bg-transparent group-hover:bg-neutral-700'
                  }`} />
                  {formatRoleName(role)}
                </span>
                {isActive && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-900" />

      {/* Section Navigation */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">Sections</p>
        <nav className="flex flex-col gap-0.5">
          {NAV_PAGES.map(({ id, label, Icon, subsections }) => {
            const isActive = activePage === id;
            return (
              <div key={id}>
                <button
                  onClick={() => setActivePage(id)}
                  className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-mono transition-all duration-200 flex items-center gap-2.5 group ${
                    isActive
                      ? 'bg-neutral-900 border border-neutral-800 text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-950 border border-transparent'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-500'} />
                  {label}
                </button>

                {/* Sub-categories (always visible for Projects) */}
                {subsections && (
                  <div className="ml-5 pl-3 border-l border-neutral-900 mt-0.5 mb-1 flex flex-col gap-0.5">
                    {subsections.map(({ id: subId, label: subLabel }) => (
                      <button
                        key={subId}
                        onClick={() => {
                          setActivePage(id);
                          // scroll to anchor after page renders
                          setTimeout(() => {
                            const el = document.getElementById(subId);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 120);
                        }}
                        className="w-full text-left py-1 px-2 rounded text-[10px] font-mono text-neutral-600 hover:text-neutral-300 transition-colors"
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

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* PDF Download + Footer */}
      <div className="space-y-3 border-t border-neutral-900 pt-3">
        <a
          href={activeRole !== 'master' ? `./public/${activeRole}_resume.pdf` : './public/Pawan_Parida_Resume.pdf'}
          download
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-neutral-800 hover:border-neutral-600 rounded-lg text-[11px] font-mono text-neutral-300 hover:text-neutral-100 transition-all bg-neutral-950 hover:bg-neutral-900"
        >
          <Download size={12} />
          <span>Download {activeRole !== 'master' ? formatRoleName(activeRole) : ''} Resume PDF</span>
        </a>
        <p className="text-[10px] font-mono text-neutral-700">
          &copy; {new Date().getFullYear()} Pawan Parida
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
