import BentoCard from './BentoCard';
import { ArrowUpRight, Mail } from 'lucide-react';
import data from '../data.json';

const ContactCard = ({ className = "" }) => {
    const personalData = data.find(item => item.id === 'personal');

    return (
        <BentoCard className={`flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-cyan/10 to-purple/10 !border-cyan/20 p-6 ${className}`} delay={0.6}>
            <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-1">Let&apos;s Work Together</h3>
                <p className="text-gray-400 text-sm max-w-[250px]">
                    Have a project in mind? Let&apos;s build something amazing.
                </p>
            </div>

            <a
                href={`mailto:${personalData?.email}`}
                className="px-6 py-3 bg-cyan text-dark font-bold rounded-full flex items-center gap-2 hover:bg-white transition-colors whitespace-nowrap"
            >
                <Mail size={18} /> Say Hello
            </a>
        </BentoCard>
    );
};

export default ContactCard;
