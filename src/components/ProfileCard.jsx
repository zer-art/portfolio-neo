import BentoCard from './BentoCard';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import data from '../data.json';

const ProfileCard = ({ className = "" }) => {
    const personalData = data.find(item => item.id === 'personal');

    return (
        <BentoCard className={`flex flex-col justify-between p-6 ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan to-purple mb-3 flex items-center justify-center text-2xl shadow-lg shadow-cyan/20"
                        role="img"
                        aria-label="developer"
                    >
                        👨‍💻
                    </motion.div>
                    <motion.h1
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-1"
                    >
                        {personalData?.name}
                    </motion.h1>
                    <h2 className="text-sm text-cyan font-medium mb-3">{personalData?.role}</h2>
                </div>
            </div>

            <div className="mt-4 w-full">
                <p className="text-gray-400 leading-relaxed mb-6 text-sm md:text-base">
                    {personalData?.about}
                </p>
                <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan to-purple text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    <Download size={18} /> Download Resume
                </a>
            </div>
        </BentoCard>
    );
};

export default ProfileCard;
