

import { motion } from 'framer-motion';
import ProfileCard from './components/ProfileCard';
import ProjectsCard from './components/ProjectsCard';
import SkillsCard from './components/SkillsCard';
import ExperienceCard from './components/ExperienceCard';
import SocialsCard from './components/SocialsCard';
import ContactCard from './components/ContactCard';
import MapCard from './components/MapCard';
import CertificationsCard from './components/CertificationsCard';
import VolunteerCard from './components/VolunteerCard';
import OpenSourceCard from './components/OpenSourceCard';

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        mass: 0.5
      }
    },
  };

  return (
    <div className="min-h-screen bg-darker text-gray-100 selection:bg-cyan selection:text-dark p-4 md:p-8 flex justify-center items-center relative overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-50 bg-noise mix-blend-overlay"></div>

      {/* Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[128px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple/10 rounded-full blur-[128px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />

      {/* 
        Grid Layout Optimized:
        - grid-cols-1 (Mobile)
        - grid-cols-2 (Tablet)
        - grid-cols-4 (Desktop)
        - auto-rows-[160px] (Smaller unit height)
        - grid-flow-dense (To pack items tightly)
      */}
      <main className="w-full max-w-[90%] xl:max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-[180px] grid-flow-dense pb-20 relative z-10">

        {/* 1. Profile (2x2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
          <ProfileCard className="h-full w-full" />
        </div>

        {/* 2. Projects (2x2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
          <ProjectsCard className="h-full w-full" />
        </div>

        {/* 3. Skills (1x2) */}
        <div className="col-span-1 row-span-2">
          <SkillsCard className="h-full w-full" />
        </div>

        {/* 4. Certifications (1x2) - Starts in Row 3 on Desktop */}
        <div className="col-span-1 row-span-2">
          <CertificationsCard className="h-full w-full" />
        </div>

        {/* 5. Contact (2x1) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
          <ContactCard className="h-full w-full" />
        </div>

        {/* 6. Experience (2x1) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
          <ExperienceCard className="h-full w-full" />
        </div>

        {/* 7. Map (1x1) */}
        <div className="col-span-1 row-span-1">
          <MapCard className="h-full w-full" />
        </div>

        {/* 8. Socials (1x1) */}
        <div className="col-span-1 row-span-1">
          <SocialsCard className="h-full w-full" />
        </div>

        {/* 9. Volunteer (1x1) */}
        <div className="col-span-1 row-span-1">
          <VolunteerCard className="h-full w-full" />
        </div>

        {/* 10. Open Source (1x1) */}
        <div className="col-span-1 row-span-1">
          <OpenSourceCard className="h-full w-full" />
        </div>

      </main>

      <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none z-10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} Pawan Parida</p>
      </footer>
    </div>
  );
}

export default App;
