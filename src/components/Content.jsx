import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitPullRequest, Award, ChevronRight, Briefcase, BookOpen, User, FolderGit2, Code } from 'lucide-react';
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
            className="text-white hover:text-emerald-400 underline decoration-white/30 hover:decoration-emerald-400 transition-colors inline-flex items-center gap-1 font-semibold">
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

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => (
  <div className="bento-card-sm bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1 min-w-0">
        <h4 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
          {project.name}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" title="GitHub"
              className="text-neutral-500 hover:text-white transition-colors flex-shrink-0">
              <ExternalLink size={14} />
            </a>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" title="Live"
              className="text-neutral-500 hover:text-white transition-colors flex-shrink-0">
              <ExternalLink size={14} />
            </a>
          )}
        </h4>
        {project.association && (
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{project.association}</p>
        )}
      </div>
      {project.date && (
        <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white flex-shrink-0">{project.date}</span>
      )}
    </div>

    {project.description && (
      <p className="text-sm text-neutral-400 leading-relaxed">{parseMarkdown(project.description)}</p>
    )}

    {project.mermaid && (
      <div className="bg-black/30 rounded-xl p-2 border border-white/5">
        <Mermaid chart={project.mermaid} />
      </div>
    )}

    {project.achievements?.length > 0 && (
      <ul className="space-y-2 pl-0 pt-2">
        {project.achievements.map((bullet, i) => (
          <li key={i} className="flex gap-2 text-sm text-neutral-300">
            <span className="text-white/40 mt-1 flex-shrink-0">•</span>
            <span>{parseMarkdown(bullet)}</span>
          </li>
        ))}
      </ul>
    )}

    {project.tags?.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-2">
        {project.tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors">{tag}</span>
        ))}
      </div>
    )}
  </div>
);

// ─── "See All" button ─────────────────────────────────────────────────────────
const SeeAllButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all group border border-transparent hover:border-white/10"
  >
    <span>{label}</span>
    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
  </button>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, icon: Icon, onSeeAll }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-white flex items-center gap-3">
      {Icon && <div className="p-2 rounded-lg bg-white/10 text-white"><Icon size={20} /></div>}
      {title}
    </h2>
    {onSeeAll && (
      <button
        onClick={onSeeAll}
        className="flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10"
      >
        View all <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

// ─── Animation variants ───────────────────────────────────────────────────────
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

// ─── Active Summary helper ────────────────────────────────────────────────────
const getSummary = (profile, resumes, activeRole) => {
  if (activeRole === 'master' || !resumes[activeRole]) return profile.summary;
  const cfg = resumes[activeRole];
  if (cfg.summary_type === 'custom' && cfg.custom_summary_text) return cfg.custom_summary_text;
  if (cfg.summary_type === 'preset' && cfg.summary_key) return profile.custom_summaries?.[cfg.summary_key] || profile.summary;
  return profile.summary;
};

// ═════════════════════════════════════════════════════════════════════════════
// HOME PAGE — Summary + truncated preview of every section
// ═════════════════════════════════════════════════════════════════════════════
const HomePage = ({
  profile, resumes, activeRole,
  previewProjects, previewOS, previewCerts, previewSkills,
  setActivePage,
}) => {
  const MAX = 3; 

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

      {/* Summary (Spans full width) */}
      <motion.section key={`summary-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover xl:col-span-2">
        <SectionHeader title="About Me" icon={User} />
        <p className="text-base leading-relaxed text-neutral-300">
          {parseMarkdown(getSummary(profile, resumes, activeRole))}
        </p>
      </motion.section>

      {/* Experience (Left Column) */}
      <motion.section variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover flex flex-col">
        <SectionHeader title="Experience" icon={Briefcase} onSeeAll={() => setActivePage('experience')} />
        <div className="space-y-6 flex-1">
          {profile.experience?.slice(0, MAX).map((exp, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-white/10 space-y-2">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#111] border-2 border-white/30" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white flex items-center flex-wrap gap-2">
                  {exp.position}
                  <span className="text-neutral-500 font-normal">at</span>
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-emerald-400 underline decoration-white/30 hover:decoration-emerald-400 inline-flex items-center gap-1 transition-colors">
                      {exp.organization}<ExternalLink size={14} className="text-neutral-500" />
                    </a>
                  ) : (
                    <span>{exp.organization}</span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">{exp.duration}</span>
                <span>{exp.location}</span>
              </div>
              <ul className="space-y-2 pt-2">
                {exp.achievements?.slice(0, 2).map((b, bi) => (
                  <li key={bi} className="flex gap-2 text-sm text-neutral-400">
                    <span className="text-white/30 flex-shrink-0">•</span>
                    <span>{parseMarkdown(b)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Education & Skills (Right Column) */}
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Education */}
        <motion.section variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover">
          <SectionHeader title="Education" icon={BookOpen} onSeeAll={() => setActivePage('education')} />
          <div className="space-y-6">
            {profile.education?.slice(0, 2).map((edu, i) => (
              <div key={i} className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-white flex-shrink-0">{edu.duration}</span>
                </div>
                <p className="text-sm text-neutral-400">{edu.institution}{edu.field ? ` — ${edu.field}` : ''}</p>
                <div className="flex gap-3 text-xs font-semibold text-neutral-300">
                  {edu.cgpa && <span className="px-2 py-1 bg-black/40 rounded-lg">CGPA: {edu.cgpa}</span>}
                  {edu.cuet && <span className="px-2 py-1 bg-black/40 rounded-lg">CUET: {edu.cuet_percentile || edu.cuet}</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover flex-1">
          <SectionHeader title="Skills" icon={Code} />
          <div className="space-y-5">
            {Object.entries(previewSkills).map(([cat, items], i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{cat.replace(/_/g, ' ')}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, si) => (
                    <span key={si} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-default shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Projects (Spans full width) */}
      {previewProjects.length > 0 && (
        <motion.section key={`proj-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover xl:col-span-2">
          <SectionHeader title="Featured Projects" icon={FolderGit2} onSeeAll={() => setActivePage('projects')} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previewProjects.slice(0, 4).map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
          {previewProjects.length > 4 && (
            <SeeAllButton onClick={() => setActivePage('projects')} label={`View all ${previewProjects.length} projects`} />
          )}
        </motion.section>
      )}

      {/* Open Source */}
      {previewOS.length > 0 && (
        <motion.section key={`os-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover xl:col-span-2">
          <SectionHeader title="Open Source" icon={GitPullRequest} onSeeAll={() => setActivePage('open-source')} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {previewOS.slice(0, 4).map((c, i) => (
              <div key={i} className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white flex items-center gap-1.5">
                      <GitPullRequest size={12} /> {c.project}
                    </span>
                    {c.pr_number && <span className="text-xs font-semibold text-neutral-500">{c.pr_number}</span>}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer"
                        className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors">
                        {c.title}<ExternalLink size={14} className="text-neutral-500" />
                      </a>
                    ) : c.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold flex-shrink-0">
                  {c.date && <span className="text-neutral-400">{c.date}</span>}
                  {c.status && (
                    <span className={`px-3 py-1 rounded-full ${
                      ['merged', 'completed'].includes(c.status.toLowerCase())
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : c.status.toLowerCase() === 'open'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}>{c.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {previewOS.length > 4 && (
            <SeeAllButton onClick={() => setActivePage('open-source')} label={`View all ${previewOS.length} contributions`} />
          )}
        </motion.section>
      )}

      {/* Certifications preview */}
      {previewCerts.length > 0 && (
        <motion.section key={`certs-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="bento-card bento-card-hover xl:col-span-2">
          <SectionHeader title="Certifications" icon={Award} onSeeAll={() => setActivePage('certifications')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewCerts.slice(0, 3).map((cert, i) => (
              <div key={i} className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{cert.issuer}</span>
                  <p className="text-base font-bold text-white">
                    {cert.credential_url ? (
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                        {cert.name}<ExternalLink size={14} className="text-neutral-500" />
                      </a>
                    ) : cert.name}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5"><Award size={14} className="text-emerald-400"/><span>Verified</span></div>
                  <span>{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
          {previewCerts.length > 3 && (
            <SeeAllButton onClick={() => setActivePage('certifications')} label={`View all ${previewCerts.length} certifications`} />
          )}
        </motion.section>
      )}

    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// FULL PAGES — individual dedicated sections
// ═════════════════════════════════════════════════════════════════════════════

const EducationPage = ({ education }) => (
  <div className="space-y-6">
    {education.map((edu, i) => (
      <div key={i} className="bento-card bento-card-hover space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
            <p className="text-sm font-medium text-neutral-400 mt-1">{edu.institution}{edu.field ? ` — ${edu.field}` : ''}</p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-white/10 text-sm font-bold text-white flex-shrink-0">{edu.duration}</span>
        </div>
        <div className="flex gap-4 text-sm font-semibold text-neutral-300">
          {edu.cgpa && <span className="px-3 py-1.5 bg-black/40 rounded-xl">CGPA: {edu.cgpa}</span>}
          {edu.cuet && <span className="px-3 py-1.5 bg-black/40 rounded-xl">CUET Percentile: {edu.cuet_percentile || edu.cuet}</span>}
        </div>
        {edu.coursework?.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Relevant Coursework</p>
            <div className="flex flex-wrap gap-2">
              {edu.coursework.map((c, ci) => (
                <span key={ci} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 transition-colors">{c}</span>
              ))}
            </div>
          </div>
        )}
        {edu.achievements?.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Achievements & Awards</p>
            <ul className="space-y-2">
              {edu.achievements.map((a, ai) => (
                <li key={ai} className="flex gap-2 text-sm text-neutral-300">
                  <span className="text-white/40 flex-shrink-0">•</span>
                  <span>{parseMarkdown(a)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ExperiencePage = ({ experience }) => (
  <div className="space-y-6">
    {experience.map((exp, i) => (
      <div key={i} className="bento-card bento-card-hover space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-white">{exp.position}</h3>
            <span className="text-neutral-500">at</span>
            {exp.link ? (
              <a href={exp.link} target="_blank" rel="noopener noreferrer"
                className="text-xl font-bold text-white hover:text-emerald-400 underline decoration-white/30 hover:decoration-emerald-400 inline-flex items-center gap-1 transition-colors">
                {exp.organization}<ExternalLink size={18} className="text-neutral-500" />
              </a>
            ) : (
              <span className="text-xl font-bold text-white">{exp.organization}</span>
            )}
          </div>
          <span className="px-3 py-1 rounded-lg bg-white/10 text-sm font-bold text-white flex-shrink-0">{exp.duration}</span>
        </div>
        <p className="text-sm font-medium text-neutral-400 flex items-center gap-2"><MapPin size={16}/> {exp.location}</p>
        <ul className="space-y-3 pt-4 border-t border-white/10">
          {exp.achievements?.map((b, bi) => (
            <li key={bi} className="flex gap-3 text-base text-neutral-300">
              <span className="text-white/40 flex-shrink-0 mt-1">•</span>
              <span>{parseMarkdown(b)}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const CertificationsPage = ({ certs }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {certs.map((cert, i) => (
      <div key={i} className="bento-card bento-card-hover flex flex-col justify-between gap-4 p-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{cert.issuer}</span>
          <p className="text-lg font-bold text-white">
            {cert.credential_url ? (
              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                {cert.name}<ExternalLink size={16} className="text-neutral-500" />
              </a>
            ) : cert.name}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold text-neutral-400 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2"><Award size={18} className="text-emerald-400"/><span>Verified</span></div>
          <span>{cert.date}</span>
        </div>
      </div>
    ))}
  </div>
);

const ProjectsPage = ({ groupedProjects }) => (
  <div className="space-y-12">
    {Object.entries(groupedProjects).map(([key, group]) => {
      if (group.items.length === 0) return null;
      return (
        <div key={key} id={group.id} className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full" />
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {group.items.map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
        </div>
      );
    })}
  </div>
);

const OpenSourcePage = ({ contributions }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {contributions.map((c, i) => (
      <div key={i} className="bento-card bento-card-hover flex flex-col justify-between gap-4">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 text-sm font-bold text-white flex items-center gap-2">
              <GitPullRequest size={16} /> {c.project}
            </span>
            {c.pr_number && <span className="text-sm font-semibold text-neutral-500">{c.pr_number}</span>}
          </div>
          <h3 className="text-xl font-bold text-white">
            {c.url ? (
              <a href={c.url} target="_blank" rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
                {c.title}<ExternalLink size={18} className="text-neutral-500" />
              </a>
            ) : c.title}
          </h3>
          {c.description && (
            <p className="text-sm text-neutral-400 leading-relaxed">{parseMarkdown(c.description)}</p>
          )}
        </div>
        <div className="flex items-center justify-between text-sm font-semibold pt-4 border-t border-white/10 flex-shrink-0">
          {c.date && <span className="text-neutral-400">{c.date}</span>}
          {c.status && (
            <span className={`px-4 py-1.5 rounded-full ${
              ['merged', 'completed'].includes(c.status.toLowerCase())
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : c.status.toLowerCase() === 'open'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-white/10 text-white border border-white/20'
            }`}>{c.status}</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN CONTENT ROUTER
// ═════════════════════════════════════════════════════════════════════════════
const PAGE_TITLES = {
  education: 'Education',
  experience: 'Experience',
  certifications: 'Certifications',
  projects: 'Projects',
  'open-source': 'Open Source',
};

const Content = ({
  profile, resumes, activeRole, activePage, setActivePage,
  previewProjects, previewOS, previewCerts, previewSkills,
  allGroupedProjects, allOS, allCerts, allEducation, allExperience,
}) => {

  const renderPage = () => {
    switch (activePage) {
      case 'education':
        return <EducationPage education={allEducation} />;
      case 'experience':
        return <ExperiencePage experience={allExperience} />;
      case 'certifications':
        return <CertificationsPage certs={allCerts} />;
      case 'projects':
        return <ProjectsPage groupedProjects={allGroupedProjects} />;
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

  const isFullPage = activePage !== 'home';

  return (
    <div className="flex-1 w-full min-w-0 pb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          {/* Page header for full section pages */}
          {isFullPage && (
            <div className="bento-card bento-card-hover flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {PAGE_TITLES[activePage]}
              </h1>
              <button
                onClick={() => setActivePage('home')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Content;
