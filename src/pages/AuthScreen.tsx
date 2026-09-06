import { useState, useEffect, type FormEvent } from 'react';
import { 
  Lock, 
  LogIn, 
  UserPlus, 
  Phone, 
  Store, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Eye, 
  EyeOff, 
  Zap
} from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';
import { playSound } from '../utils/audioHelper';

type AuthTab = 'login' | 'signup';
type LoginMode = 'otp' | 'password';

const STORE_CATEGORIES = [
  { id: 'grocery', bn: 'মুদিখানা ও জেনারেল স্টোর (Grocery & Kirana)', en: 'Grocery & General Store' },
  { id: 'garments', bn: 'বস্ত্রালয় ও তৈরি পোশাক (Clothing & Apparel)', en: 'Clothing & Apparel' },
  { id: 'electronics', bn: 'ইলেকট্রনিক্স ও মোবাইল শপ (Electronics & Mobile)', en: 'Electronics & Mobile' },
  { id: 'pharmacy', bn: 'ফার্মেসি ও ঔষধের দোকান (Pharmacy & Medical)', en: 'Pharmacy & Medical' },
  { id: 'supermarket', bn: 'ডিপার্টমেন্টাল ও সুপারমার্কেট (Supermarket)', en: 'Supermarket & Mart' },
  { id: 'cafe', bn: 'হোটেল, রেস্তোরাঁ ও বেকারি (Cafe & Bakery)', en: 'Cafe & Restaurant' },
  { id: 'hardware', bn: 'হার্ডওয়্যার ও স্যানিটারি (Hardware & Sanitary)', en: 'Hardware & Sanitary' },
  { id: 'stationery', bn: 'বই ও স্টেশনারি (Books & Stationery)', en: 'Books & Stationery' },
  { id: 'other', bn: 'অন্যান্য রিটেল ব্যবসা (Other Retail)', en: 'Other Retail Store' },
];

export function AuthScreen() {
  const { 
    setUser, 
    setCurrentView, 
    business, 
    updateBusiness, 
    language, 
    setLanguage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginMode, setLoginMode] = useState<LoginMode>('otp');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');

  // Form States
  const [loginPhone, setLoginPhone] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('shop1234');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // OTP Verification States
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);

  // Sign Up Form States
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [shopCategory, setShopCategory] = useState(STORE_CATEGORIES[0].bn);
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Feedback Toast message
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendActive && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setIsResendActive(false);
    }
    return () => clearTimeout(timer);
  }, [isResendActive, resendCountdown]);

  const handleSwitchTab = (tab: AuthTab) => {
    playSound('click');
    setActiveTab(tab);
    setFormError(null);
  };

  const toggleLanguage = () => {
    playSound('click');
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  // --- LOGIN OTP FLOW ---
  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault();
    const clean = loginPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      playSound('error');
      setFormError(language === 'bn' ? 'সঠিক ১০ ডিজিটের মোবাইল নম্বর লিখুন।' : 'Enter a valid 10-digit mobile number.');
      return;
    }
    setFormError(null);
    playSound('success');
    setOtpStep('code');
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setIsResendActive(true);
    setResendCountdown(30);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`auth-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      playSound('error');
      setFormError(language === 'bn' ? 'সম্পূর্ণ ৬ ডিজিটের ওটিপি দিন।' : 'Enter all 6 digits of the OTP.');
      return;
    }

    playSound('fanfare');
    setUser(prev => ({
      ...prev,
      name: prev.name || 'Sayan Kumar Patra',
      phone: loginPhone,
      isAuthenticated: true,
      hasCompletedSetup: false,
      hasCompletedOnboarding: true,
    }));
    setCurrentView('business-setup');
  };

  const handlePasswordLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginPassword.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'মোবাইল ও পাসওয়ার্ড দুটিই প্রয়োজন।' : 'Mobile and password are required.');
      return;
    }

    playSound('success');
    setUser(prev => ({
      ...prev,
      name: prev.name || 'Sayan Kumar Patra',
      phone: loginPhone,
      isAuthenticated: true,
      hasCompletedSetup: false,
      hasCompletedOnboarding: true,
    }));
    setCurrentView('business-setup');
  };

  const handleQuickDemoLogin = () => {
    playSound('fanfare');
    setUser({
      id: 'usr-1',
      name: 'Sayan Kumar Patra',
      email: 'sayan@gmail.com',
      phone: '9876543210',
      storeName: business.shopName || 'Sayan General Store',
      isAuthenticated: true,
      hasCompletedSetup: false,
      hasCompletedOnboarding: true,
    });
    setCurrentView('business-setup');
  };

  // --- SIGN UP HANDLER ---
  const handleSignUpStore = (e: FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'দোকানের নাম লিখতে হবে।' : 'Store name is required.');
      return;
    }
    if (!ownerName.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'দোকানদারের নাম লিখতে হবে।' : 'Owner name is required.');
      return;
    }
    const cleanPhone = signUpPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      playSound('error');
      setFormError(language === 'bn' ? '১০ ডিজিটের মোবাইল নম্বর দিন।' : 'Enter a valid 10-digit phone number.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 4) {
      playSound('error');
      setFormError(language === 'bn' ? 'কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন।' : 'Password must be at least 4 characters.');
      return;
    }
    if (!acceptTerms) {
      playSound('error');
      setFormError(language === 'bn' ? 'শর্তাবলীতে টিক দিন।' : 'Please accept the terms & conditions.');
      return;
    }

    updateBusiness({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: `+91 ${cleanPhone}`,
      email: signUpEmail.trim() || `${cleanPhone}@billkart.in`,
      category: shopCategory,
    });

    setUser({
      id: `usr-${Date.now()}`,
      name: ownerName.trim(),
      email: signUpEmail.trim() || `${cleanPhone}@billkart.in`,
      phone: `+91 ${cleanPhone}`,
      storeName: shopName.trim(),
      isAuthenticated: true,
      hasCompletedSetup: false,
      hasCompletedOnboarding: true,
    });

    playSound('fanfare');
    setCurrentView('business-setup');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 select-none">
      
      {/* Top Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <BillKartLogo size="sm" showTagline={false} horizontal={true} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('onboarding')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1"
          >
            {language === 'bn' ? 'গাইড' : 'Tour'}
          </button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
          
          {/* Tabs: Login vs Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('signup')}
              className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন দোকান' : 'Sign Up'}</span>
            </button>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
              {formError}
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Login Mode Selector */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setLoginMode('otp'); setOtpStep('phone'); setFormError(null); }}
                  className={`pb-1 transition-colors border-b-2 ${
                    loginMode === 'otp' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent'
                  }`}
                >
                  {language === 'bn' ? 'ওটিপি (OTP) লগইন' : 'OTP Login'}
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode('password'); setFormError(null); }}
                  className={`pb-1 transition-colors border-b-2 ${
                    loginMode === 'password' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent'
                  }`}
                >
                  {language === 'bn' ? 'পাসওয়ার্ড লগইন' : 'Password Login'}
                </button>
              </div>

              {/* OTP Mode */}
              {loginMode === 'otp' && (
                otpStep === 'phone' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'bn' ? 'দোকানের রেজিস্টার্ড মোবাইল নম্বর' : 'Registered Mobile Number'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{language === 'bn' ? 'ওটিপি (OTP) পাঠান' : 'Send OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {loginPhone} নম্বরে পাঠানো ৬-ডিজিট ওটিপি কোড দিন
                      </p>
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        {language === 'bn' ? 'নম্বর পরিবর্তন করুন' : 'Change Number'}
                      </button>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div className="flex items-center justify-center gap-2">
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          id={`auth-otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                          className="w-10 h-12 text-center text-lg font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'bn' ? 'ওটিপি যাচাই করে প্রবেশ করুন' : 'Verify & Continue'}</span>
                    </button>
                  </form>
                )
              )}

              {/* Password Mode */}
              {loginMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 1-Click Fast Demo Login */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>{language === 'bn' ? 'সরাসরি ডেমো লগইন (১-ক্লিক)' : 'Instant 1-Click Demo Login'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpStore} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'দোকান বা ব্যবসার নাম *' : 'Shop / Business Name *'}
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="উদাঃ সায়ন জেনারেল স্টোর"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'দোকানদার / প্রোপাইটার নাম *' : 'Owner / Merchant Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="উদাঃ সায়ন কুমার পাত্র"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'ব্যবসার ধরন / ক্যাটাগরি' : 'Business Category'}
                </label>
                <select
                  value={shopCategory}
                  onChange={(e) => setShopCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  {STORE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={language === 'bn' ? cat.bn : cat.en}>
                      {language === 'bn' ? cat.bn : cat.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড নির্ধারণ করুন *' : 'Create Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="signup-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="signup-terms" className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'bn' ? 'আমি শর্তাবলীতে সম্মতি জানাচ্ছি' : 'I agree to the terms of service'}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'দোকান তৈরি করুন' : 'Register Store'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer Security Badge */}
      <footer className="w-full max-w-md mx-auto text-center pt-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% সুরক্ষিত রিটেল টার্মিনাল • অফলাইন ও ক্লাউড ডাটা সিঙ্ক</span>
        </div>
      </footer>
    </div>
  );
}
