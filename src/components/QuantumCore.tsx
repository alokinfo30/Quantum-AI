import { motion } from 'motion/react';

export const QuantumCore = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer rings */}
      <motion.div
        animate={{
          rotate: isActive ? 360 : 0,
          scale: isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: isActive ? -360 : 0,
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-4 border border-cyan-400/30 rounded-full border-dashed"
      />
      
      {/* The Core */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : [1, 1.05, 1],
          filter: isActive 
            ? ["blur(8px) brightness(1)", "blur(12px) brightness(1.5)", "blur(8px) brightness(1)"]
            : ["blur(4px) brightness(0.8)", "blur(6px) brightness(1)", "blur(4px) brightness(0.8)"],
        }}
        transition={{
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-16 h-16 bg-blue-500 rounded-full relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.5)]"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300 to-blue-600 rounded-full animate-pulse" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [Math.cos(i) * 60, Math.cos(i + 1) * 80, Math.cos(i) * 60],
            y: [Math.sin(i) * 60, Math.sin(i + 1) * 80, Math.sin(i) * 60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
        />
      ))}
    </div>
  );
};
