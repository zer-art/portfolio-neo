import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import data from './data.json';

// Group projects by domain keywords
export const groupProjects = (projectsList) => {
  const groups = {
    llm: { title: 'LLM Projects', items: [], id: 'projects-llm' },
    cv: { title: 'Computer Vision', items: [], id: 'projects-cv' },
    ml: { title: 'Machine Learning', items: [], id: 'projects-ml' },
    se: { title: 'Software Engineering', items: [], id: 'projects-se' },
  };

  projectsList.forEach((project) => {
    const tags = (project.tags || []).map((t) => t.toLowerCase());
    const name = project.name.toLowerCase();

    const isLLM =
      tags.some((t) =>
        ['langchain', 'rag', 'gemini', 'openai', 'llm', 'prompt engineering', 'text-to-sql', 'claude', 'agent', 'groq'].includes(t)
      ) ||
      name.includes('chatbot') ||
      name.includes('agent') ||
      name.includes('llm') ||
      name.includes('sql query') ||
      name.includes('interview coach') ||
      name.includes('aivox');

    const isCV =
      tags.some((t) =>
        ['computer vision', 'opencv', 'cnn', 'mediapipe', 'tensorflow', 'keras', 'kornia', 'deepface', 'mnist', 'detection'].includes(t)
      ) ||
      name.includes('digit') ||
      name.includes('pneumonia') ||
      name.includes('handwritten') ||
      name.includes('face') ||
      name.includes('vision');

    const isML =
      tags.some((t) =>
        ['machine learning', 'scikit-learn', 'decision trees', 'bert', 'tf-idf', 'nlp', 'regression', 'prediction', 'analytics', 'predictive'].includes(t)
      ) ||
      name.includes('spam') ||
      name.includes('classification') ||
      name.includes('regression') ||
      name.includes('predictive') ||
      name.includes('recommendation');

    if (isLLM) groups.llm.items.push(project);
    else if (isCV) groups.cv.items.push(project);
    else if (isML) groups.ml.items.push(project);
    else groups.se.items.push(project);
  });

  return groups;
};

// Valid page identifiers
const PAGES = ['home', 'education', 'experience', 'certifications', 'projects', 'open-source'];

function App() {
  const { profile, resumes } = data;
  const [activeRole, setActiveRole] = useState('master');
  const [activePage, setActivePage] = useState('home');

  // Only show PythonDev and AiDev as resume filter options
  const filteredResumes = useMemo(() => {
    const filtered = {};
    if (resumes.PythonDev) filtered.PythonDev = resumes.PythonDev;
    if (resumes.AiDev) filtered.AiDev = resumes.AiDev;
    return filtered;
  }, [resumes]);

  // Sync role + page from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleQuery = params.get('role');
    const pageQuery = params.get('page');

    if (pageQuery && PAGES.includes(pageQuery)) {
      setActivePage(pageQuery);
    }

    if (roleQuery) {
      const normalizedQuery = roleQuery.toLowerCase().replace(/-/g, '_');
      const foundKey = Object.keys(filteredResumes).find(
        (key) => key.toLowerCase().replace(/-/g, '_') === normalizedQuery
      );
      setActiveRole(foundKey || 'master');
    }
  }, [filteredResumes]);

  // Push role + page to URL
  const pushURL = (role, page) => {
    const params = new URLSearchParams();
    if (role && role !== 'master') params.set('role', role.replace(/_/g, '-'));
    if (page && page !== 'home') params.set('page', page);
    const qs = params.toString();
    window.history.pushState({}, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    // Always go to home view when switching roles
    setActivePage('home');
    pushURL(role, 'home');
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    pushURL(activeRole, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Derived data for the active role (used in home "preview" mode) ---
  const previewProjects = useMemo(() => {
    const all = profile.projects || [];
    if (activeRole === 'master' || !filteredResumes[activeRole]) return all;
    
    const projectConfig = filteredResumes[activeRole].projects || [];
    let allowed = [];
    let overrides = {};
    
    if (Array.isArray(projectConfig)) {
      allowed = projectConfig;
    } else {
      allowed = Object.keys(projectConfig);
      overrides = projectConfig;
    }
    
    return all.filter((p) => allowed.includes(p.name)).map((p) => {
      const version = overrides[p.name] || 'default';
      if (version !== 'default' && p.versions && p.versions[version]) {
        return { ...p, ...p.versions[version] };
      }
      return p;
    });
  }, [profile.projects, activeRole, filteredResumes]);

  const previewOS = useMemo(() => {
    const all = profile.open_source || [];
    if (activeRole === 'master' || !filteredResumes[activeRole]) return all;
    const config = filteredResumes[activeRole];
    if (config.open_source_enabled === false) return [];
    const allowed = config.open_source || [];
    return all.filter((item) => allowed.includes(item.title));
  }, [profile.open_source, activeRole, filteredResumes]);

  const previewCerts = useMemo(() => {
    const all = profile.certifications || [];
    if (activeRole === 'master' || !filteredResumes[activeRole]) return all;
    const allowed = filteredResumes[activeRole].certifications || [];
    return all.filter((c) => allowed.includes(c.name));
  }, [profile.certifications, activeRole, filteredResumes]);

  const previewSkills = useMemo(() => {
    if (activeRole === 'master' || !filteredResumes[activeRole]) return profile.skills || {};
    const configSkills = (filteredResumes[activeRole].skills || []).map((s) => s.toLowerCase());
    const filtered = {};
    Object.entries(profile.skills || {}).forEach(([cat, items]) => {
      const allowed = items.filter((s) => configSkills.includes(s.toLowerCase()));
      if (allowed.length > 0) filtered[cat] = allowed;
    });
    return filtered;
  }, [profile.skills, activeRole, filteredResumes]);

  // Grouped (used for "Projects" full page only – all projects, all categories)
  const allGroupedProjects = useMemo(() => groupProjects(profile.projects || []), [profile.projects]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 relative overflow-x-hidden flex justify-center p-4 md:p-8 lg:p-12 selection:bg-white/20 selection:text-white">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <Sidebar
          profile={profile}
          resumes={filteredResumes}
          activeRole={activeRole}
          activePage={activePage}
          setActiveRole={handleRoleChange}
          setActivePage={handlePageChange}
        />

        <Content
          profile={profile}
          resumes={filteredResumes}
          activeRole={activeRole}
          activePage={activePage}
          setActivePage={handlePageChange}
          // Home preview data (truncated by role)
          previewProjects={previewProjects}
          previewOS={previewOS}
          previewCerts={previewCerts}
          previewSkills={previewSkills}
          // Full data for dedicated pages (always full list, all categories)
          allGroupedProjects={allGroupedProjects}
          allOS={profile.open_source || []}
          allCerts={profile.certifications || []}
          allEducation={profile.education || []}
          allExperience={profile.experience || []}
        />
      </div>
    </div>
  );
}

export default App;
