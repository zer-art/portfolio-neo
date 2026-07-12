import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import data from './data.json';

function App() {
  const { profile, resumes } = data;
  const [activeRole, setActiveRole] = useState('master');

  // Load active role from URL query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleQuery = params.get('role');
    
    if (roleQuery) {
      // Find matching resume key by checking lowercase, converting hyphens to underscores
      const normalizedQuery = roleQuery.toLowerCase().replace(/-/g, '_');
      const foundKey = Object.keys(resumes).find(
        key => key.toLowerCase().replace(/-/g, '_') === normalizedQuery
      );
      
      if (foundKey) {
        setActiveRole(foundKey);
      } else if (normalizedQuery === 'master') {
        setActiveRole('master');
      }
    }
  }, [resumes]);

  // Sync active role to URL query parameters when it changes
  const handleRoleChange = (role) => {
    setActiveRole(role);
    const params = new URLSearchParams(window.location.search);
    
    if (role === 'master') {
      params.delete('role');
    } else {
      // Format parameter for cleaner URL (e.g. use hyphens instead of underscores)
      const cleanParam = role.replace(/_/g, '-');
      params.set('role', cleanParam);
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#030303] text-gray-100 selection:bg-neutral-800 selection:text-white relative overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 bg-noise mix-blend-overlay"></div>

      {/* Profile Sidebar (Stays on top in mobile, fixed to left on desktop) */}
      <Sidebar 
        profile={profile} 
        resumes={resumes} 
        activeRole={activeRole} 
        setActiveRole={handleRoleChange} 
      />

      {/* Main Content (Scrolls on right) */}
      <Content 
        profile={profile} 
        resumes={resumes} 
        activeRole={activeRole} 
      />
    </div>
  );
}

export default App;
