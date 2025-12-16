import BentoCard from './BentoCard';
import { GitPullRequest, Github } from 'lucide-react';
import data from '../data.json';

const OpenSourceCard = ({ className = "" }) => {
    const osData = data.find(item => item.id === 'opensource')?.items || [];

    return (
        <BentoCard className={`!p-0 flex flex-col ${className}`} delay={0.8}>
            <div className="p-4 border-b border-gray-800/50 bg-dark/30 flex items-center gap-2">
                <GitPullRequest className="text-green-500" size={18} />
                <h3 className="text-base font-bold text-white">Open Source</h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                {osData.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group p-2 -mx-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-0.5">
                            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-green-400 transition-colors truncate pr-2">
                                {item.repo}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">{item.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2">
                            {item.description}
                        </p>
                    </a>
                ))}
            </div>
        </BentoCard>
    );
};

export default OpenSourceCard;
