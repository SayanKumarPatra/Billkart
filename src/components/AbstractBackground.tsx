import { motion } from 'motion/react';

export function AbstractBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#061B16]">
      {/* Deep dark gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061B16] via-[#08221C] to-[#04120E]" />

      {/* Primary Soft Glowing Green Light (Top-Left / Center Ambient) */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.35, 0.5, 0.3, 0.35],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#19D66B]/15 blur-[120px]"
      />

      {/* Subtle Lime Accent Glow (Bottom-Right Floating Highlight) */}
      <motion.div
        animate={{
          x: [0, -35, 30, 0],
          y: [0, 25, -30, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.25, 0.4, 0.2, 0.25],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#B8F500]/10 blur-[140px]"
      />

      {/* Very Minimal Abstract Neon Curve 1 */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M-200,300 C300,100 600,600 1200,200 C1500,40 1800,400 2200,250"
          stroke="url(#ambientCurve1)"
          strokeWidth="1.5"
        />
        <path
          d="M-100,700 C400,850 800,500 1400,750 C1800,900 2100,600 2500,800"
          stroke="url(#ambientCurve2)"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id="ambientCurve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19D66B" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#19D66B" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#B8F500" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#19D66B" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="ambientCurve2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#57E39B" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#19D66B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0B2822" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle fine noise overlay texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(25,214,107,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
    </div>
  );
}
