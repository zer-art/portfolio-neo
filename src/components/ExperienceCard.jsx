import BentoCard from './BentoCard';
import { Briefcase, Calendar } from 'lucide-react';
import data from '../data.json';

const ExperienceCard = ({ className = "" }) => {
    const experience = data.find(item => item.id === 'experience')?.items || [];
    const education = data.find(item => item.id === 'education')?.items || [];

    // Unified timeline, limiting length
    const timelineItems = [
        ...experience.map(e => ({ ...e, type: 'work' })),
        ...education.map(e => ({ ...e, type: 'edu' }))
    ].slice(0, 3);

    return (
        <BentoCard className={`!p-0 flex flex-col ${className}`} delay={0.5}>
            <div className="p-5 pb-2 border-b border-gray-800/50">
                <h3 className="text-lg font-bold text-white">Journey</h3>
            </div>

            <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
                {timelineItems.map((item, idx) => (
                    <div key={idx} className="relative pl-5 border-l border-gray-800 last:border-0 last:pb-0">
                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${item.type === 'work' ? 'bg-cyan shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'bg-purple shadow-[0_0_10px_rgba(189,0,255,0.4)]'}`} />
                        <div>
                            <h4 className="text-sm font-bold text-gray-200 leading-tight">{item.role || item.degree}</h4>
                            <span className="text-xs text-cyan block mt-0.5">{item.company || item.institution}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                            <Calendar size={10} /> {item.duration}
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

export default ExperienceCard;
