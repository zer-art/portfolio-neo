import BentoCard from './BentoCard';
import data from '../data.json';


const SkillsCard = ({ className = "" }) => {
    const skillsData = data.find(item => item.id === 'skills')?.categories || [];
    const allSkills = skillsData.flatMap(cat => cat.skills);

    // Double the list for seamless marquee
    const marqueeSkills = [...allSkills, ...allSkills];

    return (
        <BentoCard className={`!p-0 flex flex-col overflow-hidden ${className}`} delay={0.3}>
            <div className="p-6 pb-2">
                <h3 className="text-xl font-bold text-white mb-1">Tech Stack</h3>
                <p className="text-xs text-gray-500">Tools & Technologies</p>
            </div>

            <div className="flex-1 w-full relative overflow-hidden flex items-center mask-image-linear-to-b">
                {/* Vertical Marquee */}
                <div className="flex flex-col gap-3 w-full animate-marquee-vertical hover:[animation-play-state:paused] p-6">
                    {marqueeSkills.map((skill, idx) => (
                        <div
                            key={idx}
                            className="px-4 py-2 bg-dark/50 backdrop-blur-md border border-gray-700/50 rounded-xl text-sm text-gray-300 text-center whitespace-nowrap hover:border-cyan/50 hover:bg-cyan/5 transition-colors cursor-default shadow-sm"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
            {/* Fade overlays */}
            <div className="absolute top-[80px] left-0 w-full h-10 bg-gradient-to-b from-dark/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-dark/50 to-transparent pointer-events-none" />

        </BentoCard>
    );
};

export default SkillsCard;
