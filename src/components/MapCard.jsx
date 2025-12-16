import BentoCard from './BentoCard';
import { MapPin } from 'lucide-react';
import data from '../data.json';

const MapCard = ({ className = "" }) => {
    const personalData = data.find(item => item.id === 'personal');

    return (
        <BentoCard className={`relative flex flex-col justify-between !p-0 overflow-hidden h-full min-h-[180px] group ${className}`} delay={0.1}>
            {/* Simple Abstract Map Background */}
            <div className="absolute inset-0 bg-[#242435] opacity-50 transition-opacity group-hover:opacity-70">
                <div className="w-full h-full opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>
                {/* Radar Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan rounded-full shadow-[0_0_20px_rgba(0,243,255,0.8)]"></div>
            </div>

            <div className="relative z-10 p-6 w-full h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 text-white font-medium bg-dark/40 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                    <MapPin size={16} className="text-cyan" />
                    <span className="text-sm">{personalData?.location}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Open to Global Opportunities</p>
            </div>
        </BentoCard>
    );
};

export default MapCard;
