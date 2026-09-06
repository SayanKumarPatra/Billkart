import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BillKartLogo } from '../components/BillKartLogo';
import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 15;
        return Math.min(100, prev + step);
      });
    }, 220);

    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-between p-6 sm:p-10 select-none cursor-pointer"
    >
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between max-w-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Enterprise Secure POS</span>
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
          v2.6
        </span>
      </div>

      {/* Main Centered Logo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <BillKartLogo size="splash" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-3 text-center max-w-xs">
          বারকোড স্ক্যানার, ফাস্ট ক্যাশিয়ার ও সরাসরি ইউপিআই পেমেন্ট
        </p>
      </motion.div>

      {/* Clean Bottom Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>সিস্টেম লোড হচ্ছে...</span>
          <span className="font-mono font-bold text-blue-600">{progress}%</span>
        </div>

        {/* Crisp Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          এগিয়ে যেতে স্ক্রিনে ট্যাপ করুন
        </span>
      </div>
    </div>
  );
}
