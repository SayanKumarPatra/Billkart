import { motion } from 'motion/react';

export function AbstractBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#070709]">
      {/* Deep dark gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0709] via-[#070709] to-[#0D0508]" />

      {/* Primary Radiant Crimson Glow (Top-Left Ambient) */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.25, 0.4, 0.22, 0.25],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#FF1E42]/20 blur-[130px]"
      />

      {/* Warm Fiery Coral Accent Glow (Bottom-Right Ambient) */}
      <motion.div
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -25, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.2, 0.35, 0.18, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full bg-[#FF6A00]/15 blur-[150px]"
      />

      {/* Center Subtle Violet-Red Depth Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-[#9E0B28]/10 blur-[120px]" />

      {/* Dynamic Fluid Neon Red-Orange Waves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.22]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M-200,300 C300,80 600,550 1200,180 C1500,20 1800,380 2200,220"
          stroke="url(#ambientRedCurve1)"
          strokeWidth="1.8"
        />
        <path
          d="M-100,680 C400,820 800,480 1400,720 C1800,860 2100,560 2500,760"
          stroke="url(#ambientRedCurve2)"
          strokeWidth="1.4"
        />
        <defs>
          <linearGradient id="ambientRedCurve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1E42" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#FF1E42" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FF7A00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF1E42" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="ambientRedCurve2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF385C" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#FF6A00" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8A0D22" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle fine dot matrix overlay texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,40,70,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
    </div>
  );
}

