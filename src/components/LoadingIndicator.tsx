import { motion } from 'motion/react';

interface LoadingIndicatorProps {
  progress: number;
  message: string;
}

export function LoadingIndicator({ progress, message }: LoadingIndicatorProps) {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Dynamic Animated Status Message */}
      <div className="h-6 flex items-center justify-center mb-2.5">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-xs sm:text-sm font-medium text-[#C2B5BE] tracking-wide text-center"
        >
          {message}
        </motion.p>
      </div>

      {/* Progress Bar Container with Percentage on the right */}
      <div className="w-full flex items-center gap-3">
        {/* Glow-backed Progress Track */}
        <div className="relative flex-1 h-2 sm:h-2.5 bg-[#17131B] rounded-full overflow-hidden border border-white/10 shadow-inner">
          {/* Active Gradient Fill Bar */}
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FF1E42] via-[#FF3B30] to-[#FF8000] relative shadow-[0_0_16px_rgba(255,40,70,0.65)]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            {/* Shimmer / light sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            {/* Leading edge light point */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#FFA000]" />
          </motion.div>
        </div>

        {/* Percentage Counter */}
        <div className="min-w-[42px] text-right">
          <span className="text-xs sm:text-sm font-bold font-display text-[#FF4A6B] tabular-nums tracking-wider">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Subtle scanner / terminal status pulse */}
      <div className="mt-2.5 flex items-center gap-1.5 opacity-80">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E42] animate-ping" />
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFA000]/90">
          POS Terminal Engine v2.6.4
        </span>
      </div>
    </div>
  );
}

