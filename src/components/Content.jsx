import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitPullRequest, Award, ChevronRight, ArrowRight, CheckCircle2, Briefcase, BookOpen, FolderGit2, Code, MapPin } from 'lucide-react';
import Mermaid from './Mermaid';

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

const HeroSection = ({ profile }) => (
  <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-12 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Content */}
      <motion.div variants={fade} initial="hidden" animate="visible" className="space-y-6 z-10">
        <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase">
          We Create Solutions For You
        </h3>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase">
          {profile.name.split(' ')[0]} <br/> {profile.name.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-xl leading-relaxed">
          {profile.summary.split('.')[0]}. Specialized in Data Analytics & AI Engineering.
        </p>
        <div className="pt-4 flex items-center gap-6">
          <button className="btn-pill group">
            <span className="btn-pill-text">Contact Me</span>
            <div className="btn-pill-icon"><ArrowRight size={16} /></div>
          </button>
        </div>
      </motion.div>

      {/* Right Content - Mockup floating stats and social placeholders */}
      <motion.div variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="relative h-full flex flex-col justify-center items-end hidden lg:flex">
        
        {/* Placeholder for the portrait */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-neutral-900/50 rounded-[4rem] border border-white/5 -z-10"></div>
        
        {/* Floating Stat Pill */}
        <div className="absolute top-1/3 right-1/4 bg-[#111] border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
          <div className="text-2xl font-black text-white">4.8</div>
          <div className="text-xs text-neutral-400 leading-tight">
            15+ Open Source<br/>Contributions
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-emerald-500"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-sky-500"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-indigo-500"></div>
          </div>
        </div>

        {/* Vertical Socials */}
        <div className="flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2">
          {['X', 'In', 'Gh', 'Tw'].map((icon, i) => (
            <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-emerald-400 hover:border-emerald-400 hover:text-black transition-all font-bold text-xs">
              {icon}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const StatsRow = ({ profile }) => (
  <section className="border-t border-b border-white/5 bg-[#050505]">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-wrap gap-10 justify-between items-center">
      
      {[
        { num: '3+', label: 'Years Experience', icon: <Briefcase /> },
        { num: profile.projects?.length || '10+', label: 'Successful Projects', icon: <FolderGit2 /> },
        { num: profile.open_source?.length || '15+', label: 'Open Source PRs', icon: <GitPullRequest /> },
        { num: profile.certifications?.length || '5+', label: 'Certifications', icon: <Award /> }
      ].map((stat, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black group-hover:bg-emerald-400 transition-colors">
            {stat.icon}
          </div>
          <div>
            <h4 className="text-3xl font-black text-white">{stat.num}</h4>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        </div>
      ))}
      
    </div>
  </section>
);

const AboutSection = ({ summary }) => (
  <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
    <div className="agency-card p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center rounded-t-[3rem]">
      
      {/* Left Content */}
      <div className="space-y-8">
        <div>
          <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">About Us</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Are you looking for data-driven AI solutions? Let me help you!
          </h2>
        </div>
        
        <p className="text-neutral-400 leading-relaxed text-lg">
          {summary}
        </p>

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

        <div className="pt-4">
          <button className="btn-pill-outline group">
            <span className="btn-pill-outline-text">More About Me</span>
            <div className="btn-pill-outline-icon"><ArrowRight size={16} /></div>
          </button>
        </div>
      </div>

      {/* Right Content - Mint Green Shape Placeholder */}
      <div className="relative h-[600px] w-full hidden lg:block">
        <div className="absolute inset-0 bg-emerald-400 rounded-t-full rounded-b-3xl overflow-hidden flex items-end justify-center">
          {/* This acts as the placeholder for the person's photo as requested */}
          <div className="w-full h-1/3 bg-black/10 backdrop-blur-sm absolute bottom-0"></div>
        </div>
        {/* Floating Stat inside the shape */}
        <div className="absolute top-1/4 -left-12 bg-[#111] border border-white/10 rounded-full px-6 py-4 flex items-center gap-3 shadow-2xl">
          <h4 className="text-3xl font-black text-white">3+</h4>
          <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium leading-tight">Years Of<br/>Experience</p>
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

    {project.mermaid && (
      <div className="bg-black/50 rounded-2xl p-4 border border-white/5 mb-6">
        <Mermaid chart={project.mermaid} />
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

  return (
    <div className="flex flex-col w-full">
      <HeroSection profile={profile} />
      <StatsRow profile={profile} />
      <AboutSection summary={summaryText} />

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
      case 'projects':
        return <ProjectsPage groupedProjects={allGroupedProjects} />;
      case 'experience':
        return <ExperiencePage experience={allExperience} />;
      // Fallback simple renders for others
      case 'education':
      case 'certifications':
      case 'open-source':
        return <div className="agency-card p-12 text-center text-neutral-400">Content for {PAGE_TITLES[activePage]} migrating to new design...</div>;
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

  const isFullPage = activePage !== 'home';

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
