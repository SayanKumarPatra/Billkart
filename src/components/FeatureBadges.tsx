import { motion } from 'motion/react';
import { Zap, Smartphone, Lightbulb, ShieldCheck } from 'lucide-react';

interface FeatureBadgesProps {
  animate?: boolean;
}

const features = [
  { id: 'pay-bills', label: 'Pay Bills', icon: Zap, color: 'from-[#19D66B] to-[#B8F500]' },
  { id: 'recharge', label: 'Recharge', icon: Smartphone, color: 'from-[#57E39B] to-[#19D66B]' },
  { id: 'utilities', label: 'Utilities', icon: Lightbulb, color: 'from-[#B8F500] to-[#57E39B]' },
  { id: 'secure', label: 'Secure', icon: ShieldCheck, color: 'from-[#19D66B] to-[#0E9F4C]' },
];

export function FeatureBadges({ animate = true }: FeatureBadgesProps) {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      {/* 4 Glassmorphism Feature Icons */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              id={`feature-card-${item.id}`}
              initial={animate ? { opacity: 0, y: 15, scale: 0.9 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 + idx * 0.08 }}
              whileHover={{ y: -3, scale: 1.04 }}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#0B2822]/80 hover:bg-[#10352D] border border-[#19D66B]/20 hover:border-[#19D66B]/60 shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group cursor-default"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#10352D]/90 flex items-center justify-center mb-1.5 border border-[#19D66B]/30 group-hover:border-[#B8F500]/60 group-hover:shadow-[0_0_12px_rgba(25,214,107,0.4)] transition-all">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#57E39B] group-hover:text-[#B8F500] transition-colors" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#A9B8B3] group-hover:text-[#F5F7F6] whitespace-nowrap transition-colors">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Ribbon: ALL YOUR PAYMENTS IN ONE PLACE */}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-4 flex flex-col items-center"
      >
        <p className="text-[10px] sm:text-xs tracking-[0.25em] text-[#A9B8B3] uppercase font-semibold">
          All Your Payments in One Place
        </p>
        {/* Soft glowing curved smile underline */}
        <div className="w-16 h-1 mt-1 bg-gradient-to-r from-transparent via-[#19D66B] to-transparent rounded-full opacity-60 shadow-[0_0_8px_#19D66B]" />
      </motion.div>
    </div>
  );
}
