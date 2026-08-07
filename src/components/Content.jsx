import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitPullRequest, Award, ChevronRight, ArrowRight, CheckCircle2, Briefcase, BookOpen, FolderGit2, Code, MapPin, Users, GitCommit } from 'lucide-react';
import Spline from '@splinetool/react-spline';

// ─── Shared markdown parser ───────────────────────────────────────────────────
const parseMarkdown = (text) => {
  if (!text) return '';
  const regex = /(\[.+?\]\(.+?\))|(\*\*.+?\*\*)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('[') && part.includes('](')) {
      const m = part.match(/\[(.*?)\]\((.*?)\)/);
      if (m) {
        return (
          <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-900 hover:decoration-emerald-400 transition-colors inline-flex items-center gap-1 font-semibold">
            {m[1]}<ExternalLink size={12} className="text-neutral-500" />
          </a>
        );
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// ─── Active Summary helper ────────────────────────────────────────────────────
const getSummary = (profile, resumes, activeRole) => {
  if (activeRole === 'master' || !resumes[activeRole]) return profile.summary;
  const cfg = resumes[activeRole];
  if (cfg.summary_type === 'custom' && cfg.custom_summary_text) return cfg.custom_summary_text;
  if (cfg.summary_type === 'preset' && cfg.summary_key) return profile.custom_summaries?.[cfg.summary_key] || profile.summary;
  return profile.summary;
};

// ─── Animation variants ───────────────────────────────────────────────────────
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// ═════════════════════════════════════════════════════════════════════════════
// HOME PAGE COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

const HeroSection = ({ profile }) => {
  const [githubContribs, setGithubContribs] = useState('500+');

  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/zer-art?y=last')
      .then(r => r.json())
      .then(data => {
        const total = data?.total?.lastYear;
        if (total) setGithubContribs(`${total}+`);
      })
      .catch(() => {}); // silently keep fallback
  }, []);

  return (
  <section className="relative min-h-[90vh] flex items-center justify-center pt-4 pb-12">
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Content */}
      <motion.div variants={fade} initial="hidden" animate="visible" className="space-y-6 relative z-10">
        <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase">
          I Create Solutions For You
        </h3>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase">
          {profile.name.split(' ')[0]} <br/> {profile.name.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-xl leading-relaxed">
          {profile.summary.split('.')[0]}. Specialized in Data Analytics & AI Engineering.
        </p>
        <div className="pt-4 flex items-center gap-6">
          <a href={`mailto:${profile.email}`} className="btn-pill group inline-flex">
            <span className="btn-pill-text">Contact Me</span>
            <div className="btn-pill-icon"><ArrowRight size={16} /></div>
          </a>
        </div>
      </motion.div>

      {/* Right Content - Spline Robot + Floating Stat Pills */}
      <motion.div
        variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
        className="relative hidden lg:flex items-center justify-center"
        style={{ height: '750px' }}
      >
        {/* ── Floating Stat Pills ── */}

        {/* Open Source — just above robot, slightly left */}
        <div
          className="absolute z-30 float-a bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl pointer-events-none"
          style={{ bottom: 'calc(50% + 105px)', left: '8%' }}
        >
          <div className="text-xl font-black text-white">{profile.open_source?.length || '17'}</div>
          <div className="text-xs text-neutral-400 leading-tight uppercase tracking-wider">Open Source<br/>Contributions</div>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#111] bg-emerald-500"></div>
            <div className="w-6 h-6 rounded-full border-2 border-[#111] bg-sky-500"></div>
            <div className="w-6 h-6 rounded-full border-2 border-[#111] bg-indigo-500"></div>
          </div>
        </div>

        {/* Internships — top left */}
        <div
          className="absolute z-30 float-b bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl pointer-events-none"
          style={{ top: '8%', left: '5%' }}
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Users size={16} />
          </div>
          <div>
            <div className="text-xl font-black text-white">2+</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Internships</div>
          </div>
        </div>

        {/* Projects — top right of robot */}
        <div
          className="absolute z-30 float-c bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl pointer-events-none"
          style={{ top: '12%', right: '14%' }}
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
            <FolderGit2 size={16} />
          </div>
          <div>
            <div className="text-xl font-black text-white">15+</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Projects</div>
          </div>
        </div>

        {/* GitHub Contributions (last year) — bottom left */}
        <div
          className="absolute z-30 float-d bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl pointer-events-none"
          style={{ bottom: '12%', left: '18%' }}
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
            <GitCommit size={16} />
          </div>
          <div>
            <div className="text-xl font-black text-white">{githubContribs}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">GH Contribs</div>
          </div>
        </div>

        {/* 3D Spline Robot — fills the column */}
        <div className="absolute inset-0 z-20">
          <Spline scene="https://prod.spline.design/1kFkoefCa1rkofjO/scene.splinecode" />
        </div>

        {/* Watermark cover — fully covers the 'Built with Spline' badge */}
        <div
          className="absolute bottom-0 right-0 z-30 pointer-events-none"
          style={{ width: '230px', height: '55px', backgroundColor: '#000000' }}
        />

        {/* Vertical Socials — sits above robot */}
        <div className="flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2 z-30">
          {[
            { label: 'In', url: profile.linkedin ? (profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`) : '#' },
            { label: 'Gh', url: profile.github ? (profile.github.startsWith('http') ? profile.github : `https://${profile.github}`) : '#' }
          ].map((social, i) => (
            <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-emerald-400 hover:border-emerald-400 hover:text-black transition-all font-bold text-xs shadow-lg">
              {social.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
  );
};




const AboutSection = ({ summary, achievements }) => (
  <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
    <div className="agency-card p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center rounded-t-[3rem]">
      
      {/* Left Content */}
      <div className="space-y-8">
        <div>
          <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">About Me</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Are you looking for data-driven AI solutions? Let me help you!
          </h2>
        </div>
        
        <p className="text-neutral-400 leading-relaxed text-lg">
          {summary}
        </p>

        {/* Core Expertise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'Machine Learning & AI',
            'Data Analytics & SQL',
            'Generative AI / RAG',
            'Computer Vision'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-neutral-300 font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="pt-4 space-y-4">
            <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase border-b border-white/10 pb-2">Key Achievements</h3>
            <ul className="space-y-3">
              {achievements.map((ach, i) => (
                <li key={i} className="flex gap-3 text-neutral-300 items-start">
                  <Award className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <span className="text-sm">{parseMarkdown(ach)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Content - Mint Green Shape Placeholder */}
      <div className="relative h-[600px] w-full hidden lg:block">
        <div className="absolute inset-0 bg-emerald-400 rounded-t-full rounded-b-3xl overflow-hidden flex items-end justify-center">
          {/* Placeholder for photo */}
          <div className="w-full h-1/3 bg-black/10 backdrop-blur-sm absolute bottom-0"></div>
        </div>
        {/* Floating Stat inside the shape */}
        <div className="absolute top-1/4 -left-12 bg-[#111] border border-white/10 rounded-full px-6 py-4 flex items-center gap-3 shadow-2xl">
          <h4 className="text-3xl font-black text-white">8.8</h4>
          <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium leading-tight">CGPA</p>
        </div>
      </div>
    </div>
  </section>
);


// ═════════════════════════════════════════════════════════════════════════════
// REUSABLE CARDS (Agency Style)
// ═════════════════════════════════════════════════════════════════════════════

const ProjectCard = ({ project }) => (
  <div className="agency-card p-8 hover:bg-[#111] transition-all duration-300 group">
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
          {project.name}
        </h3>
        {project.association && (
          <p className="text-sm font-bold text-emerald-400/80 uppercase tracking-widest">{project.association}</p>
        )}
      </div>
      <div className="flex gap-2">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-400 hover:text-black transition-colors">
            <FolderGit2 size={18} />
          </a>
        )}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-400 hover:text-black transition-colors">
            <ExternalLink size={18} />
          </a>
        )}
      </div>
    </div>

    {project.description && (
      <p className="text-neutral-400 leading-relaxed mb-6">{parseMarkdown(project.description)}</p>
    )}

    {project.diagram_image && (
      <div className="rounded-2xl overflow-hidden border border-white/5 mb-6 bg-black">
        <img
          src={project.diagram_image}
          alt={`${project.name} system architecture`}
          className="w-full object-contain max-h-80 hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>
    )}

    {project.achievements?.length > 0 && (
      <ul className="space-y-3 mb-6">
        {project.achievements.map((bullet, i) => (
          <li key={i} className="flex gap-3 text-neutral-300">
            <CheckCircle2 size={16} className="text-emerald-400 mt-1 shrink-0" />
            <span>{parseMarkdown(bullet)}</span>
          </li>
        ))}
      </ul>
    )}

    {project.tags?.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
        {project.tags.map((tag, i) => (
          <span key={i} className="px-4 py-1.5 rounded-full bg-black border border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-wider">{tag}</span>
        ))}
      </div>
    )}
  </div>
);


const HomePage = ({
  profile, resumes, activeRole,
  previewProjects, previewOS, previewCerts, previewSkills,
  setActivePage,
}) => {
  const summaryText = getSummary(profile, resumes, activeRole);
  const isConcise = summaryText.split('.').slice(0, 3).join('.') + '.';
  const allAchievements = profile.education?.flatMap(e => e.achievements || []) || [];

  return (
    <div className="flex flex-col w-full">
      <HeroSection profile={profile} />
      <AboutSection summary={isConcise} achievements={allAchievements} />

      {/* Featured Projects Section */}
      {previewProjects.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">Portfolio</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Featured Projects</h2>
            </div>
            <button onClick={() => setActivePage('projects')} className="btn-pill-outline group">
              <span className="btn-pill-outline-text">View All Projects</span>
              <div className="btn-pill-outline-icon"><ArrowRight size={16} /></div>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {previewProjects.slice(0, 4).map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
        </section>
      )}

      {/* Open Source Contributions Section */}
      {previewOS.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">Community</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Open Source</h2>
            </div>
            <button onClick={() => setActivePage('open-source')} className="btn-pill-outline group">
              <span className="btn-pill-outline-text">View All Contributions</span>
              <div className="btn-pill-outline-icon"><ArrowRight size={16} /></div>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {previewOS.slice(0, 4).map((c, i) => (
              <div key={i} className="agency-card p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white flex items-center gap-2">
                      <GitPullRequest size={14} /> {c.project}
                    </span>
                    {c.pr_number && <span className="text-sm font-semibold text-neutral-500">{c.pr_number}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
                        {c.title}<ExternalLink size={14} className="text-neutral-500" />
                      </a>
                    ) : c.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold pt-4 border-t border-white/10">
                  {c.date && <span className="text-neutral-400">{c.date}</span>}
                  {c.status && (
                    <span className="text-emerald-400 font-bold uppercase tracking-widest">{c.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};


// ═════════════════════════════════════════════════════════════════════════════
// FULL PAGES
// ═════════════════════════════════════════════════════════════════════════════

const ProjectsPage = ({ groupedProjects }) => (
  <div className="space-y-16">
    {Object.entries(groupedProjects).map(([key, group]) => {
      if (group.items.length === 0) return null;
      return (
        <div key={key} id={group.id} className="space-y-8">
          <h3 className="text-3xl font-black text-white flex items-center gap-4">
            <span className="w-12 h-1 bg-emerald-400 rounded-full" />
            {group.title}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {group.items.map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
        </div>
      );
    })}
  </div>
);

const ExperiencePage = ({ experience }) => (
  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[29px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-white/10 before:to-transparent">
    {experience.map((exp, i) => (
      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Timeline Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-black bg-emerald-400 text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
          <Briefcase size={20} />
        </div>
        {/* Content Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] agency-card p-8 hover:bg-[#111] transition-colors">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">{exp.duration}</span>
            <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
            {exp.link ? (
              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
                {exp.organization} <ExternalLink size={16} />
              </a>
            ) : (
              <p className="text-lg font-medium text-neutral-400">{exp.organization}</p>
            )}
          </div>
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-6"><MapPin size={16}/> {exp.location}</p>
          <ul className="space-y-3">
            {exp.achievements?.map((b, bi) => (
              <li key={bi} className="flex gap-3 text-neutral-300">
                <span className="text-emerald-400 mt-1 shrink-0">•</span>
                <span>{parseMarkdown(b)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);


const statusColor = (status) => {
  if (!status) return 'text-neutral-500';
  const s = status.toLowerCase();
  if (s === 'merged' || s === 'completed' || s === 'closed') return 'text-emerald-400';
  if (s === 'open') return 'text-sky-400';
  return 'text-neutral-400';
};

const OpenSourcePage = ({ contributions }) => (
  <div className="space-y-6">
    {contributions.map((c, i) => (
      <div key={i} className="agency-card p-6 md:p-8 hover:bg-[#111] transition-all duration-300 group">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left: project + title */}
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-xs font-bold text-emerald-400">
                <GitPullRequest size={13} />
                {c.project}
              </span>
              {c.pr_number && (
                <span className="text-xs font-mono font-semibold text-neutral-500 bg-white/5 px-2 py-1 rounded">
                  {c.pr_number}
                </span>
              )}
              {c.status && (
                <span className={`text-xs font-bold uppercase tracking-widest ${statusColor(c.status)}`}>
                  ● {c.status}
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 inline-flex items-start gap-2">
                  {c.title}
                  <ExternalLink size={14} className="text-neutral-500 mt-1 shrink-0" />
                </a>
              ) : c.title}
            </h3>
            {c.description && (
              <p className="text-sm text-neutral-400 leading-relaxed">{c.description}</p>
            )}
          </div>

          {/* Right: date + changes */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {c.date && (
              <span className="text-xs text-neutral-500 font-medium">{c.date}</span>
            )}
            {c.changes && (
              <span className="text-xs font-mono text-emerald-400/70 bg-emerald-400/5 px-2 py-1 rounded">{c.changes}</span>
            )}
            {c.comments && (
              <span className="text-xs text-neutral-500">{c.comments} comments</span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PAGE_TITLES = {
  education: 'Education',
  experience: 'Professional Experience',
  certifications: 'Certifications',
  projects: 'All Projects',
  'open-source': 'Open Source Contributions',
};

const Content = ({
  profile, resumes, activeRole, activePage, setActivePage,
  previewProjects, previewOS, previewCerts, previewSkills,
  allGroupedProjects, allOS, allCerts, allEducation, allExperience,
}) => {

  const renderPage = () => {
    switch (activePage) {
      case 'about':
        const summaryText = getSummary(profile, resumes, activeRole);
        const allAchievements = profile.education?.flatMap(e => e.achievements || []) || [];
        return (
          <div className="w-full">
            <AboutSection summary={summaryText} achievements={allAchievements} />
          </div>
        );
      case 'projects':
        return <ProjectsPage groupedProjects={allGroupedProjects} />;
      case 'experience':
        return <ExperiencePage experience={allExperience} />;
      // Fallback simple renders for others
      case 'education':
      case 'certifications':
        return <div className="agency-card p-12 text-center text-neutral-400">Content for {PAGE_TITLES[activePage]} migrating to new design...</div>;
      case 'open-source':
        return <OpenSourcePage contributions={allOS} />;
      default:
        return (
          <HomePage
            profile={profile}
            resumes={resumes}
            activeRole={activeRole}
            previewProjects={previewProjects}
            previewOS={previewOS}
            previewCerts={previewCerts}
            previewSkills={previewSkills}
            setActivePage={setActivePage}
          />
        );
    }
  };

  const isFullPage = activePage !== 'home' && activePage !== 'about';

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-80px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {isFullPage ? (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
              <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">Detailed View</h3>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                    {PAGE_TITLES[activePage]}
                  </h1>
                </div>
                <button
                  onClick={() => setActivePage('home')}
                  className="btn-pill-outline group"
                >
                  <span className="btn-pill-outline-text">Back to Home</span>
                  <div className="btn-pill-outline-icon"><ArrowRight size={16} /></div>
                </button>
              </div>
              {renderPage()}
            </div>
          ) : (
            renderPage()
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Content;
