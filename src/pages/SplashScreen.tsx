import { useEffect } from 'react';
import { motion } from 'motion/react';
import { BillKartLogo } from '../components/BillKartLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // Stay/hold static for exactly 1.8 seconds (1-2 seconds) then proceed to the app
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="relative min-h-screen w-full bg-[#070709] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient background glow matching the brand colors */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FF1E42]/20 via-[#FF6A00]/15 to-[#FFA000]/10 blur-[120px] animate-pulse" />
      </div>

      {/* Subtle radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,7,9,0.85)_100%)] pointer-events-none" />

      {/* Main Centered Logo with Elegant Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <BillKartLogo size="splash" animate={true} />

        {/* Minimalist 1.8s Progress Pulse Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 0.8, width: 140 }}
          transition={{ duration: 1.6, delay: 0.2, ease: 'easeInOut' }}
          className="h-1 rounded-full bg-gradient-to-r from-[#FF1E42] via-[#FF6A00] to-[#FFA000] mt-6 shadow-[0_0_12px_rgba(255,30,66,0.6)]"
        />
      </motion.div>
    </div>
  );
}
