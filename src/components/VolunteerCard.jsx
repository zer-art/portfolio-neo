import BentoCard from './BentoCard';
import { Heart } from 'lucide-react';
import data from '../data.json';

const VolunteerCard = ({ className = "" }) => {
    const volunteerData = data.find(item => item.id === 'volunteer')?.items || [];

    return (
        <BentoCard className={`!p-0 flex flex-col ${className}`} delay={0.7}>
            <div className="p-4 border-b border-gray-800/50 bg-dark/30 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                <h3 className="text-base font-bold text-white">Volunteering</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {volunteerData.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                        <h4 className="text-sm font-bold text-gray-200">{item.role}</h4>
                        <span className="text-xs text-red-400/80 mb-1">{item.organization}</span>
                        <p className="text-[10px] text-gray-500 leading-snug">{item.description}</p>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

export default VolunteerCard;
