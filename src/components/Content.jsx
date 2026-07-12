import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitPullRequest, Award, ChevronRight } from 'lucide-react';
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
            className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-900 hover:decoration-emerald-400 inline-flex items-center gap-0.5 font-sans">
            {m[1]}<ExternalLink size={9} className="ml-0.5 text-neutral-500" />
          </a>
        );
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-neutral-200 font-semibold font-sans">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => (
  <div className="p-5 border border-neutral-900 bg-neutral-950/20 rounded-xl hover:border-neutral-800 transition-all duration-300 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1 min-w-0">
        <h4 className="text-sm font-medium text-neutral-100 font-sans flex items-center gap-2 flex-wrap">
          {project.name}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0">
              <ExternalLink size={11} />
            </a>
          )}
        </h4>
        {project.association && (
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{project.association}</p>
        )}
      </div>
      {project.date && (
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">{project.date}</span>
      )}
    </div>

    {project.description && (
      <p className="text-xs text-neutral-400 font-sans leading-relaxed">{parseMarkdown(project.description)}</p>
    )}

    {project.mermaid && (
      <Mermaid chart={project.mermaid} />
    )}

    {project.achievements?.length > 0 && (
      <ul className="space-y-1.5 pl-0">
        {project.achievements.map((bullet, i) => (
          <li key={i} className="relative pl-4 text-xs text-neutral-400 font-sans">
            <span className="absolute left-0 text-neutral-600">—</span>
            {parseMarkdown(bullet)}
          </li>
        ))}
      </ul>
    )}

    {project.tags?.length > 0 && (
      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.tags.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-900 text-[10px] font-mono text-neutral-400">{tag}</span>
        ))}
      </div>
    )}
  </div>
);

// ─── "See All" button ─────────────────────────────────────────────────────────
const SeeAllButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-neutral-100 transition-colors group mt-2"
  >
    <span>See all {label}</span>
    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
  </button>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, onSeeAll, seeAllLabel }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
      <span>//</span> {title}
    </h2>
    {onSeeAll && (
      <button
        onClick={onSeeAll}
        className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-neutral-200 transition-colors group"
      >
        View all <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

// ─── Animation variants ───────────────────────────────────────────────────────
const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
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
  const MAX = 3; // max items shown in preview

  return (
    <div className="space-y-16">

      {/* Summary */}
      <motion.section key={`summary-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Profile Summary
        </h2>
        <p className="text-[13px] leading-relaxed text-neutral-400 font-sans">
          {parseMarkdown(getSummary(profile, resumes, activeRole))}
        </p>
      </motion.section>

      {/* Education — shown right after summary */}
      <motion.section variants={fade} initial="hidden" animate="visible" className="space-y-5">
        <SectionHeader title="Education" onSeeAll={() => setActivePage('education')} />
        <div className="space-y-5 border-l border-neutral-900 pl-4">
          {profile.education?.slice(0, MAX).map((edu, i) => (
            <div key={i} className="relative space-y-1.5">
              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-sm font-medium text-neutral-100 font-sans">{edu.degree}</h3>
                  <p className="text-xs text-neutral-500 font-sans">{edu.institution}{edu.field ? ` — ${edu.field}` : ''}</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">{edu.duration}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500">
                {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                {edu.cuet && <span>CUET: {edu.cuet_percentile || edu.cuet}</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Experience preview — always show all (usually 1-2 entries) */}
      <motion.section variants={fade} initial="hidden" animate="visible" className="space-y-6">
        <SectionHeader title="Experience" onSeeAll={() => setActivePage('experience')} />
        <div className="space-y-6 relative pl-4 border-l border-neutral-900">
          {profile.experience?.slice(0, MAX).map((exp, i) => (
            <div key={i} className="relative space-y-1.5">
              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-medium text-neutral-100 font-sans">{exp.position}</h3>
                  <span className="text-xs text-neutral-600">@</span>
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-200 hover:text-white underline decoration-neutral-800 hover:decoration-neutral-400 inline-flex items-center gap-1 font-sans">
                      {exp.organization}<ExternalLink size={10} className="text-neutral-500" />
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-neutral-200 font-sans">{exp.organization}</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">{exp.duration}</span>
              </div>
              <p className="text-[11px] font-mono text-neutral-500">{exp.location}</p>
              <ul className="space-y-1.5 pl-0 pt-1">
                {exp.achievements?.slice(0, 2).map((b, bi) => (
                  <li key={bi} className="relative pl-4 text-xs text-neutral-400 font-sans">
                    <span className="absolute left-0 text-neutral-600">—</span>
                    {parseMarkdown(b)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Projects preview — flat list, NO category headers */}
      {previewProjects.length > 0 && (
        <motion.section key={`proj-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="space-y-5">
          <SectionHeader title="Featured Projects" onSeeAll={() => setActivePage('projects')} />
          <div className="grid grid-cols-1 gap-5">
            {previewProjects.slice(0, MAX).map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
          {previewProjects.length > MAX && (
            <SeeAllButton onClick={() => setActivePage('projects')} label={`${previewProjects.length - MAX} more projects`} />
          )}
        </motion.section>
      )}

      {/* Open Source preview */}
      {previewOS.length > 0 && (
        <motion.section key={`os-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="space-y-5">
          <SectionHeader title="Open Source" onSeeAll={() => setActivePage('open-source')} />
          <div className="grid grid-cols-1 gap-3">
            {previewOS.slice(0, MAX).map((c, i) => (
              <div key={i} className="p-4 border border-neutral-900 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <GitPullRequest size={11} className="text-neutral-500 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-neutral-400">{c.project}</span>
                    {c.pr_number && <span className="text-[10px] font-mono text-neutral-600">{c.pr_number}</span>}
                  </div>
                  <p className="text-xs font-medium text-neutral-200 font-sans">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1 text-neutral-200 hover:text-white">
                        {c.title}<ExternalLink size={9} className="text-neutral-500" />
                      </a>
                    ) : c.title}
                  </p>
                </div>
                <div className="flex sm:flex-col items-end gap-2 text-[10px] font-mono flex-shrink-0">
                  {c.date && <span className="text-neutral-500">{c.date}</span>}
                  {c.status && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      ['merged', 'completed'].includes(c.status.toLowerCase())
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : c.status.toLowerCase() === 'open'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>{c.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {previewOS.length > MAX && (
            <SeeAllButton onClick={() => setActivePage('open-source')} label={`${previewOS.length - MAX} more contributions`} />
          )}
        </motion.section>
      )}

      {/* Skills */}
      <motion.section variants={fade} initial="hidden" animate="visible" className="space-y-5">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Skills & Technologies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-l border-neutral-900 pl-4">
          {Object.entries(previewSkills).map(([cat, items], i) => (
            <div key={i} className="space-y-2.5">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{cat.replace(/_/g, ' ')}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill, si) => (
                  <span key={si} className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Certifications preview */}
      {previewCerts.length > 0 && (
        <motion.section key={`certs-${activeRole}`} variants={fade} initial="hidden" animate="visible" className="space-y-5">
          <SectionHeader title="Certifications" onSeeAll={() => setActivePage('certifications')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewCerts.slice(0, MAX + 1).map((cert, i) => (
              <div key={i} className="p-4 border border-neutral-900 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">{cert.issuer}</span>
                  <p className="text-xs font-medium text-neutral-200 font-sans">
                    {cert.credential_url ? (
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1">
                        {cert.name}<ExternalLink size={9} className="text-neutral-500" />
                      </a>
                    ) : cert.name}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-1"><Award size={10} /><span>Verified</span></div>
                  <span>{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
          {previewCerts.length > MAX + 1 && (
            <SeeAllButton onClick={() => setActivePage('certifications')} label={`${previewCerts.length - (MAX + 1)} more certifications`} />
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
  <div className="space-y-8 border-l border-neutral-900 pl-4">
    {education.map((edu, i) => (
      <div key={i} className="relative space-y-3">
        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h3 className="text-sm font-medium text-neutral-100 font-sans">{edu.degree}</h3>
            <p className="text-xs text-neutral-500 font-sans">{edu.institution}{edu.field ? ` — ${edu.field}` : ''}</p>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">{edu.duration}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500">
          {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
          {edu.cuet && <span>CUET Percentile: {edu.cuet_percentile || edu.cuet}</span>}
        </div>
        {edu.coursework?.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Relevant Coursework</p>
            <div className="flex flex-wrap gap-1.5">
              {edu.coursework.map((c, ci) => (
                <span key={ci} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-900 text-[10px] font-mono text-neutral-400">{c}</span>
              ))}
            </div>
          </div>
        )}
        {edu.achievements?.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Achievements & Awards</p>
            <ul className="space-y-1.5 pl-0">
              {edu.achievements.map((a, ai) => (
                <li key={ai} className="relative pl-4 text-xs text-neutral-400 font-sans">
                  <span className="absolute left-0 text-neutral-600">—</span>
                  {parseMarkdown(a)}
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
  <div className="space-y-10 relative pl-4 border-l border-neutral-900">
    {experience.map((exp, i) => (
      <div key={i} className="relative space-y-2">
        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-medium text-neutral-100 font-sans">{exp.position}</h3>
            <span className="text-xs text-neutral-600">@</span>
            {exp.link ? (
              <a href={exp.link} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-neutral-200 hover:text-white underline decoration-neutral-800 hover:decoration-neutral-400 inline-flex items-center gap-1 font-sans">
                {exp.organization}<ExternalLink size={10} className="text-neutral-500" />
              </a>
            ) : (
              <span className="text-sm font-medium text-neutral-200 font-sans">{exp.organization}</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">{exp.duration}</span>
        </div>
        <p className="text-[11px] font-mono text-neutral-500">{exp.location}</p>
        <ul className="space-y-2 pl-0 pt-1">
          {exp.achievements?.map((b, bi) => (
            <li key={bi} className="relative pl-4 text-xs text-neutral-400 font-sans">
              <span className="absolute left-0 text-neutral-600">—</span>
              {parseMarkdown(b)}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const CertificationsPage = ({ certs }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {certs.map((cert, i) => (
      <div key={i} className="p-4 border border-neutral-900 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">{cert.issuer}</span>
          <p className="text-xs font-medium text-neutral-200 font-sans">
            {cert.credential_url ? (
              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1">
                {cert.name}<ExternalLink size={9} className="text-neutral-500" />
              </a>
            ) : cert.name}
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-1"><Award size={10} /><span>Verified</span></div>
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
        <div key={key} id={group.id} className="space-y-5">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <span className="text-neutral-700">—</span> {group.title}
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {group.items.map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
        </div>
      );
    })}
  </div>
);

const OpenSourcePage = ({ contributions }) => (
  <div className="grid grid-cols-1 gap-4">
    {contributions.map((c, i) => (
      <div key={i} className="p-4 border border-neutral-900 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <GitPullRequest size={12} className="text-neutral-500 flex-shrink-0" />
            <span className="text-[11px] font-mono text-neutral-400 font-medium">{c.project}</span>
            {c.pr_number && <><span className="text-[10px] font-mono text-neutral-600">|</span><span className="text-[10px] font-mono text-neutral-500">{c.pr_number}</span></>}
          </div>
          <h3 className="text-xs font-medium text-neutral-200 font-sans">
            {c.url ? (
              <a href={c.url} target="_blank" rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1 text-neutral-200 hover:text-white">
                {c.title}<ExternalLink size={9} className="text-neutral-500" />
              </a>
            ) : c.title}
          </h3>
          {c.description && (
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{parseMarkdown(c.description)}</p>
          )}
        </div>
        <div className="flex sm:flex-col items-end gap-2 text-[10px] font-mono flex-shrink-0">
          {c.date && <span className="text-neutral-500 uppercase tracking-wider">{c.date}</span>}
          {c.status && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] ${
              ['merged', 'completed'].includes(c.status.toLowerCase())
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : c.status.toLowerCase() === 'open'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'bg-neutral-800 text-neutral-400'
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
  'open-source': 'Open Source Contributions',
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
    <div className="flex-1 md:ml-80 lg:ml-96 p-6 md:p-12 lg:p-16 max-w-4xl bg-[#030303] min-h-screen text-neutral-400">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-12"
        >
          {/* Page header for full section pages */}
          {isFullPage && (
            <div className="space-y-1.5 pb-4 border-b border-neutral-900">
              <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                — Full View
              </p>
              <h1 className="text-2xl font-semibold text-neutral-100 font-sans tracking-tight">
                {PAGE_TITLES[activePage]}
              </h1>
            </div>
          )}
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Content;
