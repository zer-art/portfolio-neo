import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitPullRequest, Award, BookOpen, Briefcase, Code } from 'lucide-react';

const Content = ({ profile, resumes, activeRole }) => {
  
  // Helper to format text and handle bold markdown tags safely in React
  const formatText = (text) => {
    if (!text) return '';
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-neutral-200 font-medium font-sans">{part}</strong>;
      }
      return part;
    });
  };

  // 1. Determine active summary/bio
  const getActiveSummary = () => {
    if (activeRole === 'master' || !resumes[activeRole]) {
      return profile.summary;
    }
    const config = resumes[activeRole];
    if (config.summary_type === 'custom' && config.custom_summary_text) {
      return config.custom_summary_text;
    }
    if (config.summary_type === 'preset' && config.summary_key) {
      return profile.custom_summaries?.[config.summary_key] || profile.summary;
    }
    return profile.summary;
  };

  // 2. Filter projects
  const getFilteredProjects = () => {
    const allProjects = profile.projects || [];
    if (activeRole === 'master' || !resumes[activeRole]) {
      return allProjects;
    }
    const allowedNames = resumes[activeRole].projects || [];
    return allProjects.filter(p => allowedNames.includes(p.name));
  };

  // 3. Check open source settings
  const getOpenSourceInfo = () => {
    const allOS = profile.open_source || [];
    if (activeRole === 'master' || !resumes[activeRole]) {
      return { enabled: true, items: allOS };
    }
    const config = resumes[activeRole];
    if (config.open_source_enabled === false) {
      return { enabled: false, items: [] };
    }
    const allowedTitles = config.open_source || [];
    const filteredItems = allOS.filter(item => allowedTitles.includes(item.title));
    return { enabled: true, items: filteredItems };
  };

  // 4. Filter certifications
  const getFilteredCerts = () => {
    const allCerts = profile.certifications || [];
    if (activeRole === 'master' || !resumes[activeRole]) {
      return allCerts;
    }
    const allowedNames = resumes[activeRole].certifications || [];
    return allCerts.filter(c => allowedNames.includes(c.name));
  };

  // 5. Check if a skill is highlighted in current configuration
  const isSkillHighlighted = (skillName) => {
    if (activeRole === 'master' || !resumes[activeRole]) {
      return true;
    }
    const configSkills = resumes[activeRole].skills || [];
    return configSkills.some(s => s.toLowerCase() === skillName.toLowerCase());
  };

  const filteredProjects = getFilteredProjects();
  const osInfo = getOpenSourceInfo();
  const filteredCerts = getFilteredCerts();
  const activeSummary = getActiveSummary();

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <div className="flex-1 md:ml-80 lg:ml-96 p-6 md:p-12 lg:p-16 max-w-5xl bg-[#030303] min-h-screen text-neutral-400 space-y-16">
      
      {/* 1. About / Summary */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        key={`about-${activeRole}`}
        className="space-y-4"
      >
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Profile Summary
        </h2>
        <p className="text-[13px] leading-relaxed text-neutral-400 font-sans text-justify">
          {formatText(activeSummary)}
        </p>
      </motion.section>

      {/* 2. Work Experience */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Experience
        </h2>
        <div className="space-y-8 relative pl-4 border-l border-neutral-900">
          {profile.experience?.map((exp, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline Bullet */}
              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-neutral-100 font-sans">{exp.position}</h3>
                  <span className="text-xs text-neutral-600 font-sans">@</span>
                  {exp.link ? (
                    <a 
                      href={exp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-200 hover:text-neutral-100 underline decoration-neutral-800 hover:decoration-neutral-400 flex items-center gap-1 font-sans"
                    >
                      {exp.organization}
                      <ExternalLink size={10} className="inline text-neutral-500" />
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-neutral-200 font-sans">{exp.organization}</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{exp.duration}</span>
              </div>
              
              <p className="text-[11px] font-mono text-neutral-500 mb-2">{exp.location}</p>
              
              <ul className="list-none space-y-2 pl-0 text-xs">
                {exp.achievements?.map((bullet, bIdx) => (
                  <li key={bIdx} className="relative pl-4 text-neutral-400 font-sans">
                    <span className="absolute left-0 text-neutral-600">&#8212;</span>
                    {formatText(bullet)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. Featured Projects */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 && (
          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key={`projects-${activeRole}`}
            className="space-y-6"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
              <span>//</span> Featured Projects
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="p-5 border border-neutral-900/60 bg-neutral-950/20 rounded-xl hover:border-neutral-800 transition-all duration-300 group space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-neutral-100 font-sans flex items-center gap-2">
                        {project.name}
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-neutral-300 transition-colors"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </h3>
                      {project.association && (
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                          {project.association}
                        </p>
                      )}
                    </div>
                    {project.date && (
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{project.date}</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.achievements && (
                    <ul className="list-none space-y-1.5 pl-0 text-xs">
                      {project.achievements.map((bullet, bIdx) => (
                        <li key={bIdx} className="relative pl-4 text-neutral-400 font-sans">
                          <span className="absolute left-0 text-neutral-600">&#8212;</span>
                          {formatText(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-2 py-0.5 rounded bg-neutral-900/60 border border-neutral-900 text-[10px] font-mono text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. Open Source */}
      <AnimatePresence mode="wait">
        {osInfo.enabled && osInfo.items.length > 0 && (
          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key={`os-${activeRole}`}
            className="space-y-6"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
              <span>//</span> Open Source Contributions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {osInfo.items.map((contrib, idx) => (
                <div 
                  key={idx} 
                  className="p-4 border border-neutral-900/50 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <GitPullRequest size={12} className="text-neutral-500" />
                      <span className="text-[11px] font-mono text-neutral-400 font-medium">{contrib.project}</span>
                      <span className="text-[10px] font-mono text-neutral-600">|</span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{contrib.pr_number}</span>
                    </div>
                    <h3 className="text-xs font-medium text-neutral-200 font-sans">
                      {contrib.url ? (
                        <a 
                          href={contrib.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 inline-flex"
                        >
                          {contrib.title}
                          <ExternalLink size={9} className="text-neutral-500" />
                        </a>
                      ) : (
                        contrib.title
                      )}
                    </h3>
                    {contrib.description && (
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        {formatText(contrib.description)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex md:flex-col items-end gap-2 text-[10px] font-mono">
                    {contrib.date && <span className="text-neutral-500 uppercase tracking-wider">{contrib.date}</span>}
                    {contrib.status && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        contrib.status.toLowerCase() === 'merged' || contrib.status.toLowerCase() === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : contrib.status.toLowerCase() === 'open'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {contrib.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Skills Grid */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Skills & Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-l border-neutral-900 pl-4">
          {Object.entries(profile.skills || {}).map(([category, items], idx) => {
            const cleanCategoryName = category.replace(/_/g, ' ');
            return (
              <div key={idx} className="space-y-3">
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                  {cleanCategoryName}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill, sIdx) => {
                    const isSelected = isSkillHighlighted(skill);
                    return (
                      <span 
                        key={sIdx} 
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-300 border ${
                          isSelected
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-100 shadow-sm'
                            : 'bg-neutral-950/20 border-transparent text-neutral-600'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 6. Certifications */}
      <AnimatePresence mode="wait">
        {filteredCerts.length > 0 && (
          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key={`certs-${activeRole}`}
            className="space-y-6"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
              <span>//</span> Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCerts.map((cert, idx) => (
                <div 
                  key={idx} 
                  className="p-4 border border-neutral-900/50 bg-neutral-950/10 rounded-lg hover:border-neutral-800 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                      {cert.issuer}
                    </span>
                    <h3 className="text-xs font-medium text-neutral-200 font-sans">
                      {cert.credential_url ? (
                        <a 
                          href={cert.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 inline-flex"
                        >
                          {cert.name}
                          <ExternalLink size={9} className="text-neutral-500" />
                        </a>
                      ) : (
                        cert.name
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Award size={10} />
                      <span>Verified</span>
                    </div>
                    <span>{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 7. Education */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-200 flex items-center gap-2">
          <span>//</span> Education
        </h2>
        <div className="space-y-6 border-l border-neutral-900 pl-4">
          {profile.education?.map((edu, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-sm font-medium text-neutral-100 font-sans">{edu.degree}</h3>
                  <p className="text-xs text-neutral-500 font-sans">{edu.institution} {edu.field ? `— ${edu.field}` : ''}</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{edu.duration}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500">
                {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                {edu.cuet && <span>CUET Percentile: {edu.cuet_percentile || edu.cuet}</span>}
              </div>

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium">Achievements & Awards</p>
                  <ul className="list-none space-y-1.5 pl-0 text-xs">
                    {edu.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="relative pl-4 text-neutral-400 font-sans">
                        <span className="absolute left-0 text-neutral-600">&#8212;</span>
                        {formatText(ach)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  );
};

export default Content;
