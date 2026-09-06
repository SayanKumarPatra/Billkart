import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  LayoutDashboard,
  Barcode, 
  ReceiptText, 
  QrCode, 
  Printer, 
  Globe,
  ChevronRight
} from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';
import { playSound } from '../utils/audioHelper';

interface GuideStep {
  id: number;
  taglineBn: string;
  taglineEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  badgeBn: string;
  badgeEn: string;
  featuresBn: string[];
  featuresEn: string[];
  icon: any;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    taglineBn: 'ধাপ ০১ • টার্মিনাল ড্যাশবোর্ড',
    taglineEn: 'Step 01 • POS Dashboard',
    titleBn: 'স্মার্ট ড্যাশবোর্ড ও লাইভ বিক্রয় পরিসংখ্যান',
    titleEn: 'Smart Dashboard & Real-Time Sales',
    badgeBn: 'লাইভ ড্যাশবোর্ড',
    badgeEn: 'Live Dashboard',
    descBn: 'এক নজরে দেখুন আজকের মোট বিক্রয়, চালানের সংখ্যা, নগদ ও অনলাইন আয়ের পরিসংখ্যান এবং কম স্টক থাকা পণ্যের লাইভ সতর্কতা।',
    descEn: 'Track daily revenue, invoices, cash vs online transactions, and low-stock alerts at a glance.',
    featuresBn: [
      'আজকের মোট বিক্রয় ও দৈনিক লাভের নির্ভুল হিসাব',
      'এক ক্লিকেই নতুন বিল তৈরির দ্রুত শর্টকাট',
      'সহজ পণ্য স্টক ও গ্রাহক খতিয়ান পরিদর্শন'
    ],
    featuresEn: [
      'Accurate daily sales & revenue summary',
      'One-click instant billing launcher',
      'Fast inventory & customer directory view'
    ],
    icon: LayoutDashboard,
  },
  {
    id: 2,
    taglineBn: 'ধাপ ০২ • ক্যামেরা স্ক্যানার',
    taglineEn: 'Step 02 • Optical Scanner',
    titleBn: 'মোবাইল ক্যামেরা বারকোড স্ক্যানার',
    titleEn: 'High-Speed Optical Barcode Scanner',
    badgeBn: 'ক্যামেরা স্ক্যানার',
    badgeEn: 'Barcode Scanner',
    descBn: 'কোনো এক্সটার্নাল মেশিনের প্রয়োজন নেই। আপনার ফোনের ক্যামেরা দিয়েই যেকোনো পণ্যের বারকোড সাথে সাথে স্ক্যান করুন।',
    descEn: 'Zero expensive hardware needed. Turn your phone or tablet camera into an instant barcode reader.',
    featuresBn: [
      'প্যাকেজের বারকোড ধরলেই স্বয়ংক্রিয়ভাবে কার্টে যুক্ত হবে',
      'একই বারকোড পুনরায় স্ক্যান করলে পরিমাণ (Qty) স্বয়ংক্রিয় বাড়বে',
      'টর্চলাইট ফ্ল্যাশ ও সফল স্ক্যানের অডিও বিপ সংকেত'
    ],
    featuresEn: [
      'Instant barcode detection adds item to invoice',
      'Repeated scans automatically increment item quantity',
      'Flashlight support with clear audio beep confirmation'
    ],
    icon: Barcode,
  },
  {
    id: 3,
    taglineBn: 'ধাপ ০৩ • দ্রুত বিলিং',
    taglineEn: 'Step 03 • Fast Billing',
    titleBn: 'সহজ ও নির্ভুল বিল তৈরি',
    titleEn: 'Instant Bill Creation & Taxes',
    badgeBn: 'ফাস্ট ক্যাশিয়ার',
    badgeEn: 'Quick Cashier',
    descBn: 'গ্রাহকের নাম ও মোবাইল নম্বর ইনপুট করুন, পণ্য নির্বাচন করুন এবং স্বয়ংক্রিয় জিএসটি ও ডিসকাউন্ট হিসাব পেয়ে যান।',
    descEn: 'Capture customer details, select products, and let the smart cart calculate taxes and discounts automatically.',
    featuresBn: [
      'গ্রাহকের নাম ও মোবাইল নম্বর সংরক্ষণের সুবিধা',
      'জিএসটি ও ফ্ল্যাট ডিসকাউন্ট স্বয়ংক্রিয় হিসাব',
      'এক ক্লিকে ইনভয়েস জেনারেট ও সেভ'
    ],
    featuresEn: [
      'Customer name & mobile number capture',
      'Auto-calculated GST & discounts',
      'Instant invoice creation & history logging'
    ],
    icon: ReceiptText,
  },
  {
    id: 4,
    taglineBn: 'ধাপ ০৪ • ইউপিআই পেমেন্ট',
    taglineEn: 'Step 04 • UPI QR Pay',
    titleBn: 'ডাইনামিক ইউপিআই কিউআর কোড পেমেন্ট',
    titleEn: 'Dynamic UPI QR Code Payment',
    badgeBn: 'ইউপিআই পেমেন্ট',
    badgeEn: 'Instant UPI QR',
    descBn: 'বিলের টাকার পরিমাণের ভিত্তিতে স্বয়ংক্রিয় কিউআর কোড তৈরি হয়। গ্রাহক PhonePe, Google Pay, Paytm বা BHIM দিয়ে স্ক্যান করলেই টাকা দোকানদারের অ্যাকাউন্টে জমা হবে।',
    descEn: 'Dynamic QR codes encoded with the exact bill amount. Customers pay directly via PhonePe, GPay, Paytm, or BHIM.',
    featuresBn: [
      'বিলের সঠিক টাকার পরিমাণে স্বয়ংক্রিয় কিউআর কোড',
      'টাকা সরাসরি দোকানদারের ব্যাংক অ্যাকাউন্টে জমা',
      'পেমেন্ট পাওয়ার সাথে সাথে সফল কনফার্মেশন স্ক্রিন'
    ],
    featuresEn: [
      'Dynamic QR with exact bill amount pre-filled',
      'Direct zero-fee payment to shopkeeper account',
      'Instant payment success chime & verification'
    ],
    icon: QrCode,
  },
  {
    id: 5,
    taglineBn: 'ধাপ ০৫ • রসিদ ও প্রিন্ট',
    taglineEn: 'Step 05 • Receipt & Share',
    titleBn: 'থার্মাল প্রিন্ট ও হোয়াটসঅ্যাপ ইনভয়েস',
    titleEn: 'Thermal Print & WhatsApp Receipt',
    badgeBn: 'প্রিন্ট ও শেয়ার',
    badgeEn: 'Receipt & Print',
    descBn: 'দোকানের ব্লুটুথ থার্মাল প্রিন্টারে সাথে সাথে রসিদ প্রিন্ট করুন অথবা গ্রাহকের হোয়াটসঅ্যাপে প্রফেশনাল ডিজিটাল ইনভয়েস পাঠিয়ে দিন।',
    descEn: 'Print wireless receipts on any thermal printer or share clean digital invoices via WhatsApp.',
    featuresBn: [
      '২ ও ৩ ইঞ্চি থার্মাল প্রিন্টারে সরাসরি রসিদ প্রিন্ট',
      'এক ক্লিকে হোয়াটসঅ্যাপে বিল পাঠানোর ব্যবস্থা',
      'অফলাইনেও সমস্ত বিক্রয় ডাটা ১০০% সুরক্ষিত'
    ],
    featuresEn: [
      'Native 2" and 3" ESC/POS thermal receipt formatting',
      'Instant one-click WhatsApp sharing',
      '100% offline data security with cloud backup'
    ],
    icon: Printer,
  },
];

export function OnboardingScreen() {
  const { setCurrentView, setUser, language, setLanguage } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const step = GUIDE_STEPS[currentStep];
  const isLast = currentStep === GUIDE_STEPS.length - 1;
  const isFirst = currentStep === 0;

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isLast]);

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      playSound('click');
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      playSound('click');
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    playSound('fanfare');
    setUser(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setCurrentView('auth');
  };

  const toggleLang = () => {
    playSound('click');
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const Icon = step.icon;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      
      {/* Top Professional Header */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <BillKartLogo size="sm" horizontal={true} showTagline={false} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Skip Directly to Login */}
          <button
            type="button"
            onClick={handleComplete}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1"
          >
            {language === 'bn' ? 'স্কিপ করুন' : 'Skip'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl mx-auto my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs space-y-6"
          >
            {/* Step Category & Icon Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/60 dark:border-blue-800/60 inline-block">
                  {language === 'bn' ? step.taglineBn : step.taglineEn}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                  {language === 'bn' ? step.titleBn : step.titleEn}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'bn' ? step.descBn : step.descEn}
            </p>

            {/* Feature Bullet Points */}
            <div className="pt-2 space-y-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {language === 'bn' ? 'মূল সুবিধাগুলো:' : 'Key Capabilities:'}
              </span>
              {(language === 'bn' ? step.featuresBn : step.featuresEn).map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {GUIDE_STEPS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                playSound('click');
                setCurrentStep(idx);
              }}
              className={`h-2 rounded-full transition-all duration-200 ${
                currentStep === idx 
                  ? 'w-7 bg-blue-600' 
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              title={`Step ${idx + 1}`}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation Buttons */}
      <footer className="w-full max-w-2xl mx-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirst}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 active:scale-98"
        >
          <span>
            {isLast
              ? (language === 'bn' ? 'লগইন ও সাইন আপ করুন' : 'Continue to Login')
              : (language === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step')}
          </span>
          {isLast ? <ChevronRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </footer>
    </div>
  );
}
