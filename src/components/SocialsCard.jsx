import BentoCard from './BentoCard';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const SocialsCard = ({ className = "" }) => {
    const socials = [
        { icon: Github, link: "https://github.com/zer-art", label: "GitHub", color: "hover:text-white" },
        { icon: Linkedin, link: "#", label: "LinkedIn", color: "hover:text-blue-500" },
        { icon: Mail, link: "mailto:13zero7two005@gmail.com", label: "Email", color: "hover:text-red-400" },
        // Adding placeholder Twitter/X if needed or just remove
        // { icon: Twitter, link: "#", label: "Twitter", color: "hover:text-blue-400" }
    ];

    return (
        <BentoCard className={`flex flex-col justify-center items-center ${className} !p-5`} delay={0.2}>
            <div className="grid grid-cols-2 gap-3 w-full h-full">
                {socials.map((social, idx) => (
                    <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center justify-center p-2 rounded-xl bg-gray-900/50 border border-gray-800 hover:bg-gray-800 transition-all group ${social.color}`}
                    >
                        <social.icon size={20} className="mb-1 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-300">{social.label}</span>
                    </a>
                ))}
            </div>
        </BentoCard>
    );
};

export default SocialsCard;
