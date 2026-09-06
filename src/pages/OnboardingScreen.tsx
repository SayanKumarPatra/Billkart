import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Barcode, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';

interface Slide {
  id: number;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  color: string;
  bulletPoints: string[];
}

const ONBOARDING_SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Fast Billing',
    tagline: 'Create professional bills in seconds.',
    description: 'Instant item lookup, automated tax & discounts, thermal print output, and direct WhatsApp sharing for your customers.',
    icon: Zap,
    color: 'from-[#FF1E42] to-[#FF6A00]',
    bulletPoints: ['Sub-second cart calculation', 'Custom discounts & GST', 'Quick customer memory'],
  },
  {
    id: 2,
    title: 'Smart Barcode Scan',
    tagline: 'Scan products directly using your mobile camera.',
    description: 'Zero external hardware needed. Point your mobile phone camera at any retail package barcode to auto-increment quantities instantaneously.',
    icon: Barcode,
    color: 'from-[#FF6A00] to-[#FFA000]',
    bulletPoints: ['No expensive barcode guns required', 'Duplicate scan auto-increments quantity', 'Torch support in dim lighting'],
  },
  {
    id: 3,
    title: 'Grow Your Business',
    tagline: 'Track sales, products and business performance.',
    description: 'Dynamic UPI QR codes, real-time inventory tracking, low-stock warnings, and comprehensive revenue analytics at your fingertips.',
    icon: TrendingUp,
    color: 'from-[#FF1E42] to-[#FFA000]',
    bulletPoints: ['Instant UPI QR generation', 'Automatic low stock alerts', 'Daily & monthly revenue graphs'],
  },
];

export function OnboardingScreen() {
  const { setCurrentView, setUser } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = ONBOARDING_SLIDES[currentSlide];
  const isLast = currentSlide === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setUser(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#070709] text-[#F5F5F7] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative select-none overflow-hidden">
      {/* Top Header */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between z-10 pt-2">
        <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} horizontal={true} />
        {!isLast && (
          <button
            type="button"
            onClick={handleComplete}
            className="text-xs font-bold text-[#A09CA8] hover:text-[#FFA000] px-3 py-1.5 rounded-xl hover:bg-[#1E121B] transition-colors"
          >
            Skip Intro &gt;
          </button>
        )}
      </div>

      {/* Slide Visual Presentation */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col items-center justify-center py-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center text-center space-y-6"
          >
            {/* Slide Icon Pod */}
            <div className="relative">
              <div className="absolute -inset-5 bg-[#FF1E42]/25 rounded-full blur-2xl animate-pulse-glow" />
              <div className="relative w-28 h-28 rounded-3xl bg-[#18121B] border-2 border-[#FF1E42]/35 flex items-center justify-center shadow-[0_15px_35px_rgba(255,20,50,0.25)]">
                <slide.icon className="w-14 h-14 text-[#FF4A6B]" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold font-mono tracking-widest text-[#FFA000] uppercase bg-[#261420] px-3 py-1 rounded-full border border-[#FF1E42]/25">
                Step 0{slide.id} of 03
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                {slide.title}
              </h2>
              <p className="text-base sm:text-lg font-semibold text-[#FF4A6B]">
                {slide.tagline}
              </p>
              <p className="text-xs sm:text-sm text-[#A09CA8] max-w-md mx-auto leading-relaxed pt-1">
                {slide.description}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="w-full max-w-sm space-y-2 pt-2 text-left">
              {slide.bulletPoints.map((bp, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#16121A]/80 border border-white/10 text-xs text-white"
                >
                  <div className="w-5 h-5 rounded-md bg-[#2B1421] flex items-center justify-center text-[#FFA000] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{bp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Progress Indicator & Action Buttons */}
      <div className="w-full max-w-md mx-auto space-y-5 z-10 pb-4">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-8 bg-gradient-to-r from-[#FF1E42] to-[#FFA000] shadow-[0_0_10px_#FF1E42]'
                  : 'w-2 bg-[#251722]'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              type="button"
              onClick={() => setCurrentSlide(prev => prev - 1)}
              className="px-5 py-3.5 rounded-2xl bg-[#1C141F] hover:bg-[#2A1828] border border-white/10 text-xs font-bold text-[#A09CA8] transition-colors"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(255,30,66,0.4)]"
          >
            <span>{isLast ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

