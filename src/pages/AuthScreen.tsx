import { useState, type FormEvent } from 'react';
import { 
  Phone, 
  ArrowRight, 
  Store, 
  Sparkles, 
  Globe
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { useApp } from '../contexts/AppContext';
import { playSound } from '../utils/audioHelper';

export function AuthScreen() {
  const { 
    setUser, 
    setCurrentView, 
    business, 
    language, 
    setLanguage 
  } = useApp();

  const isBn = language === 'bn';

  // Mobile number state (No OTP!)
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = () => {
    playSound('click');
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  // Instant Login without OTP
  const handleInstantLogin = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      playSound('error');
      setPhoneError(isBn ? 'অনুগ্রহ করে সঠিক ১০ ডিজিটের মোবাইল নম্বর লিখুন' : 'Please enter valid 10-digit mobile number');
      return;
    }

    setPhoneError('');
    setIsLoading(true);
    playSound('success');

    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        phone: cleanPhone,
        isAuthenticated: true,
      }));

      // If business has no registered shop name or setup not completed, go to business setup
      if (!business.shopName || business.shopName === 'Patra Variety Store') {
        setCurrentView('business-setup');
      } else {
        setCurrentView('dashboard');
      }
      setIsLoading(false);
    }, 400);
  };

  // Quick Register New Shop CTA
  const handleRegisterNewShop = () => {
    playSound('click');
    const cleanPhone = phoneNumber.replace(/\D/g, '') || '9876543210';
    setUser(prev => ({
      ...prev,
      phone: cleanPhone,
      isAuthenticated: true,
      hasCompletedSetup: false,
    }));
    setCurrentView('business-setup');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 p-5 select-none overflow-y-auto">
      
      {/* Top Header: Language Switcher */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
          ● {isBn ? 'সরাসরি মোবাইল লগইন' : 'Direct Mobile Login'}
        </span>

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{isBn ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      {/* Center Brand and Login Form */}
      <div className="my-auto space-y-6 max-w-sm mx-auto w-full py-4">
        
        {/* BillKart Visual Logo & Typography */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo variant="icon" size="xl" />
          <div className="space-y-0.5 pt-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center justify-center">
              <span>Bill</span>
              <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent ml-0.5">
                Kart
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Smart Billing • Simple Business
            </p>
          </div>
        </div>

        {/* Mobile Login Card (NO OTP) */}
        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              {isBn ? 'মোবাইল নম্বর দিয়ে লগইন করুন' : 'Login with Mobile Number'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn 
                ? 'কোনো ওটিপি ছাড়াই নিমেষে আপনার দোকানে প্রবেশ করুন' 
                : 'Instant access without any OTP verification'}
            </p>
          </div>

          <form onSubmit={handleInstantLogin} className="space-y-3.5">
            {/* Phone Number Input with +91 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
                </span>
                {phoneError && (
                  <span className="text-[10px] text-red-500 font-semibold">{phoneError}</span>
                )}
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-500 font-mono pr-2 border-r border-slate-200 dark:border-slate-700">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(clean);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="9876543210"
                  className="w-full pl-18 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all tracking-wider"
                  autoFocus
                />
              </div>
            </div>

            {/* Instant Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isBn ? 'লগইন করুন (ওটিপি ছাড়া)' : 'Instant Login (No OTP)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold absolute">
              {isBn ? 'অথবা' : 'OR'}
            </span>
          </div>

          {/* Register New Shop Button */}
          <button
            type="button"
            onClick={handleRegisterNewShop}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'নতুন দোকান রেজিস্টার করুন' : 'Register New Shop'}</span>
          </button>

        </div>

      </div>

      {/* Bottom Footer Note */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isBn ? '১০০% ফ্রি ও সুরক্ষিত অফলাইন রিটেল অ্যাপ' : '100% Secure Retail Mobile App'}</span>
        </p>
      </div>

    </div>
  );
}
