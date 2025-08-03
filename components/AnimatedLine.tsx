import { motion } from "framer-motion";

interface AnimatedLineProps {
    colorClass: string;
}

export default function AnimatedLine({ colorClass }: AnimatedLineProps) {
    return (
        <motion.div
            className={`w-20 h-1 ${colorClass} mx-auto mb-6`}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.4 }}
        />
    );
}