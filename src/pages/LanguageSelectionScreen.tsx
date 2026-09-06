import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';
import { Language } from '../types';
import { playBarcodeScanSuccess } from '../utils/soundEffects';

interface LanguageSelectionScreenProps {
  onSelectLanguage?: (lang: Language) => void;
}

export function LanguageSelectionScreen({ onSelectLanguage }: LanguageSelectionScreenProps) {
  const { language, setLanguage, setCurrentView } = useApp();
  const [selected, setSelected] = useState<Language>(language || 'bn');

  const handleSelect = (lang: Language) => {
    setSelected(lang);
    setLanguage(lang);
    playBarcodeScanSuccess();
  };

  const handleContinue = () => {
    setLanguage(selected);
    if (onSelectLanguage) {
      onSelectLanguage(selected);
    } else {
      setCurrentView('onboarding');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg flex flex-col items-center"
      >
        {/* BillKart Logo */}
        <div className="mb-6">
          <BillKartLogo size="lg" />
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-600 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>{selected === 'bn' ? 'ভাষা নির্বাচন' : 'Language Select'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {selected === 'bn' ? 'আপনার পছন্দের ভাষা বেছে নিন' : 'Choose Your Language'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {selected === 'bn' 
              ? 'বিলকার্ট পিওএস আপনি কোন ভাষায় পরিচালনা করতে চান তা নির্বাচন করুন।' 
              : 'Select your preferred language for POS billing and store management.'}
          </p>
        </div>

        {/* Two Clean Selection Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Bengali Card */}
          <button
            type="button"
            onClick={() => handleSelect('bn')}
            className={`p-5 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
              selected === 'bn'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4 w-full">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center font-bold text-xl">
                অ
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selected === 'bn'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {selected === 'bn' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">বাংলা</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600">
                  Bengali
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                সহজ ও সাবলীল বাংলা ভাষায় সম্পূর্ণ দোকান পরিচালনা করুন।
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>স্মার্ট বিলিং • সহজ ব্যবসা</span>
              {selected === 'bn' && (
                <span className="text-blue-600 text-[11px] font-bold">✓ নির্বাচিত</span>
              )}
            </div>
          </button>

          {/* English Card */}
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`p-5 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
              selected === 'en'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4 w-full">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center font-bold text-base">
                EN
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selected === 'en'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {selected === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">English</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Run your retail counter and business with modern English terminology.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>Retail POS • Billing</span>
              {selected === 'en' && (
                <span className="text-blue-600 text-[11px] font-bold">✓ Selected</span>
              )}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto min-w-[240px] py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>
            {selected === 'bn' ? 'বাংলা ভাষায় শুরু করুন' : 'Continue in English'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
          {selected === 'bn' 
            ? '💡 আপনি যেকোনো সময় সেটিংস থেকে ভাষা বদলাতে পারবেন'
            : '💡 You can switch language anytime from Settings'}
        </p>
      </motion.div>
    </div>
  );
}
