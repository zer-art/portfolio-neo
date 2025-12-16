import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`bg-dark/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:shadow-2xl hover:shadow-cyan/10 hover:border-cyan/30 transition-all duration-300 overflow-hidden relative group ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default BentoCard;
