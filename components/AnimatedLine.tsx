import { motion } from "framer-motion";

interface AnimatedLineProps {
  colorClass: string;
  widthClass?: string;          // ← NEW optional prop for override
}

export default function AnimatedLine({
  colorClass,
  widthClass
}: AnimatedLineProps) {
  return (
    <motion.div
      className={`w-20 h-1 ${colorClass} mx-auto mb-6 ${widthClass || ''}`}  // ← append override if provided
      initial={{ width: 0 }}
      animate={{ width: widthClass ? "100%" : 80 }}   // ← animate to full container width when overridden
      transition={{ duration: 1, delay: 0.4 }}
    />
  );
}