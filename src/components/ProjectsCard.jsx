import BentoCard from './BentoCard';

import { ArrowUpRight, Github } from 'lucide-react';
import data from '../data.json';

const ProjectsCard = ({ className = "" }) => {
    const projects = data.find(item => item.id === 'projects')?.items || [];
    // Use top 3 projects for the bento grid
    const featuredProjects = projects;

    return (
        <BentoCard className={`!p-0 flex flex-col ${className}`} delay={0.4}>
            <div className="p-6 pb-4 border-b border-gray-800/50 flex justify-between items-center bg-dark/30">
                <h3 className="text-xl font-bold text-white">Featured Projects</h3>
                <span className="text-xs text-cyan flex items-center gap-1 cursor-pointer hover:underline">
                    View All <ArrowUpRight size={12} />
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {featuredProjects.map((project, idx) => (
                    <div
                        key={idx}
                        onClick={() => window.open(project.link, '_blank')}
                        className="group/item relative bg-gray-900/40 rounded-xl p-4 border border-gray-800 hover:border-purple/50 hover:bg-gray-800/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white group-hover/item:text-purple transition-colors">{project.title}</h4>
                            <div className="text-gray-500 hover:text-white transition-colors">
                                <Github size={16} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, tIdx) => (
                                <span key={tIdx} className="text-[10px] px-2 py-1 bg-dark rounded border border-gray-800 text-gray-500 group-hover/item:border-purple/30 transition-colors">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

export default ProjectsCard;
