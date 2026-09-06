import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Columns, 
  Maximize2, 
  Smartphone, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { FeatureBadges } from '../components/FeatureBadges';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { VideoPlayer } from '../components/VideoPlayer';
import { AbstractBackground } from '../components/AbstractBackground';

interface SplashScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { progress: 15, message: 'Starting your smart business...' },
  { progress: 38, message: 'Loading your workspace...' },
  { progress: 62, message: 'Connecting barcode & POS scanner...' },
  { progress: 85, message: 'Syncing terminal & receipt engine...' },
  { progress: 100, message: 'Preparing BillKart...' },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting your smart business...');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [desktopLayoutMode, setDesktopLayoutMode] = useState<'split' | 'cinematic' | 'phoneFrame'>('split');
  const [loadingSpeed, setLoadingSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');

  const handleUploadVideo = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setCustomVideoUrl(url);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const speedMultiplier = loadingSpeed === 'fast' ? 2.5 : loadingSpeed === 'slow' ? 0.6 : 1.3;
    const intervalTime = 40;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        const increment = (Math.random() * 0.9 + 0.6) * speedMultiplier;
        const nextVal = Math.min(100, prev + increment);

        const currentStep = LOADING_STEPS.slice().reverse().find((s) => nextVal >= s.progress);
        if (currentStep) {
          setMessage(currentStep.message);
        }

        return nextVal;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, loadingSpeed, onComplete]);

  return (
    <div className="relative min-h-screen w-full bg-[#061B16] text-[#F5F7F6] overflow-x-hidden font-sans select-none flex flex-col justify-between">
      <AbstractBackground />

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="w-full px-4 py-3 flex items-center justify-between text-xs z-30">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#0B2822]/90 border border-[#19D66B]/25 text-[11px] font-semibold text-[#57E39B] flex items-center gap-1.5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-[#B8F500]" />
              <span>Screen 01: Preloader</span>
            </span>
          </div>

          {/* Desktop Responsive Layout Selector */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#0B2822]/90 border border-[#19D66B]/20 backdrop-blur-md shadow-sm">
            <button
              type="button"
              onClick={() => setDesktopLayoutMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                desktopLayoutMode === 'split'
                  ? 'bg-[#10352D] text-[#B8F500] font-bold'
                  : 'text-[#A9B8B3] hover:text-[#F5F7F6]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setDesktopLayoutMode('cinematic')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                desktopLayoutMode === 'cinematic'
                  ? 'bg-[#10352D] text-[#B8F500] font-bold'
                  : 'text-[#A9B8B3] hover:text-[#F5F7F6]'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Cinematic</span>
            </button>

            <button
              type="button"
              onClick={() => setDesktopLayoutMode('phoneFrame')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                desktopLayoutMode === 'phoneFrame'
                  ? 'bg-[#10352D] text-[#B8F500] font-bold'
                  : 'text-[#A9B8B3] hover:text-[#F5F7F6]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Simulation</span>
            </button>
          </div>

          {/* Quick Skip to POS */}
          <button
            type="button"
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/25 border border-[#19D66B]/30 text-xs font-bold text-[#F5F7F6] hover:text-[#B8F500] transition-colors shadow-sm"
          >
            <span>Skip to POS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B8F500]" />
          </button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 lg:px-8 py-4">
          {/* 1. Desktop Split Mode */}
          {desktopLayoutMode === 'split' && (
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <BillKartLogo size="lg" />
                <FeatureBadges />
                <div className="w-full max-w-md">
                  <LoadingIndicator progress={progress} message={message} />
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md aspect-[9/16] rounded-3xl overflow-hidden border-2 border-[#19D66B]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative bg-[#0B2822]">
                  <VideoPlayer
                    customVideoUrl={customVideoUrl}
                    onUploadVideo={handleUploadVideo}
                    aspectMode="cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Cinematic Immersion */}
          {desktopLayoutMode === 'cinematic' && (
            <div className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden border border-[#19D66B]/30 shadow-2xl flex flex-col justify-between p-6 sm:p-10">
              <div className="absolute inset-0 z-0">
                <VideoPlayer
                  customVideoUrl={customVideoUrl}
                  onUploadVideo={handleUploadVideo}
                  aspectMode="cover"
                  isHeroBackground={true}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-between flex-1 space-y-6">
                <BillKartLogo size="lg" />
                <FeatureBadges />
                <div className="w-full max-w-md pt-4">
                  <LoadingIndicator progress={progress} message={message} />
                </div>
              </div>
            </div>
          )}

          {/* 3. Phone Simulation */}
          {desktopLayoutMode === 'phoneFrame' && (
            <div className="relative w-[340px] aspect-[9/19] rounded-[48px] p-3.5 bg-black border-4 border-[#10352D] shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 z-0">
                <VideoPlayer
                  customVideoUrl={customVideoUrl}
                  onUploadVideo={handleUploadVideo}
                  aspectMode="cover"
                  isHeroBackground={true}
                />
              </div>
              <div className="relative z-10 w-full flex flex-col items-center justify-between flex-1 py-6 space-y-4">
                <BillKartLogo size="sm" />
                <FeatureBadges />
                <div className="w-full px-2">
                  <LoadingIndicator progress={progress} message={message} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full py-3 px-4 text-center text-xs text-[#A9B8B3]/80 z-20 flex items-center justify-center gap-2">
          <span className="text-[#57E39B]">BillKart</span>
          <span>•</span>
          <span>Smart Billing • Simple Business</span>
          <span>•</span>
          <span>v2.6 Cloud POS</span>
        </footer>
      </div>
    </div>
  );
}
