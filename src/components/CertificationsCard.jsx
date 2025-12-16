import BentoCard from './BentoCard';
import { Award, ExternalLink } from 'lucide-react';
import data from '../data.json';

const CertificationsCard = ({ className = "" }) => {
    const certifications = data.find(item => item.id === 'certificates')?.items || [];

    return (
        <BentoCard className={`!p-0 flex flex-col ${className}`} delay={0.6}>
            <div className="p-5 pb-2 border-b border-gray-800/50 bg-dark/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="text-purple" size={20} /> Certifications
                </h3>
            </div>

            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {certifications.map((cert, idx) => (
                        <a
                            key={idx}
                            href={cert.link || "#"}
                            target={cert.link ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className={`group flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800 transition-all ${cert.link ? 'hover:bg-gray-800 hover:border-purple/40 cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0 text-purple font-bold text-xs">
                                    {cert.issuer.substring(0, 1)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-200 truncate group-hover:text-purple transition-colors">{cert.name}</h4>
                                    <p className="text-[10px] text-gray-500 truncate">{cert.issuer} • {cert.date}</p>
                                </div>
                            </div>
                            {cert.link && <ExternalLink size={14} className="text-gray-600 group-hover:text-white flex-shrink-0" />}
                        </a>
                    ))}
                </div>
            </div>
        </BentoCard>
    );
};

export default CertificationsCard;
