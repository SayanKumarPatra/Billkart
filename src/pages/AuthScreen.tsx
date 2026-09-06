import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, Phone, KeyRound, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';

export function AuthScreen() {
  const { setUser, setCurrentView } = useApp();
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobileStep, setMobileStep] = useState<'phone' | 'otp'>('phone');

  // Mobile state
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(28);

  // Email state
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sayan@gmail.com');
  const [password, setPassword] = useState('pass1234');
  const [name, setName] = useState('Sayan Kumar Patra');

  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setMobileStep('otp');
      setResendTimer(28);
    }
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'usr-1',
      name: 'Sayan Kumar Patra',
      email: 'sayan@gmail.com',
      isAuthenticated: true,
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
    });
    setCurrentView('dashboard');
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'usr-1',
      name: isSignUp ? name : 'Sayan Kumar Patra',
      email: email,
      isAuthenticated: true,
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
    });
    setCurrentView('dashboard');
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    // auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070709] text-[#F5F5F7] flex flex-col justify-center items-center p-4 sm:p-6 relative select-none">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1E42]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#130F17]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative z-10">
        <div className="flex justify-center mb-6">
          <BillKartLogo size="md" />
        </div>

        {/* Method Toggle: Mobile OTP vs Email Login */}
        <div className="flex rounded-xl bg-[#1C1420] p-1 mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('mobile');
              setMobileStep('phone');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'mobile'
                ? 'bg-[#2B1422] text-[#FFA000] border border-[#FF1E42]/35 shadow-sm'
                : 'text-[#A09CA8] hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-[#2B1422] text-[#FFA000] border border-[#FF1E42]/35 shadow-sm'
                : 'text-[#A09CA8] hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Login</span>
          </button>
        </div>

        {authMethod === 'mobile' ? (
          mobileStep === 'phone' ? (
            /* Screen 04: Mobile Number Entry */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-lg font-bold text-white">Enter Mobile Number</h3>
                <p className="text-xs text-[#A09CA8]">We'll send a 6-digit OTP to verify your account</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-[#1C1420] border border-white/10 text-xs font-bold text-[#FFA000]">
                    🇮🇳 +91
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#777] focus:outline-none tracking-wider"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-[0_6px_25px_rgba(255,30,66,0.35)] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Get OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#A09CA8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>100% Secure merchant verification</span>
              </div>
            </motion.form>
          ) : (
            /* Screen 05: 6-Digit OTP Verification */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-lg font-bold text-white">Verify Phone Number</h3>
                <p className="text-xs text-[#A09CA8]">
                  Code sent to <span className="text-[#FFA000] font-semibold">+91 {phoneNumber}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setMobileStep('phone')}
                  className="text-[11px] text-[#FF4A6B] hover:underline"
                >
                  Edit Number
                </button>
              </div>

              {/* 6 Digit OTP inputs */}
              <div className="flex justify-between gap-2 py-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-[#1C1420] border border-white/15 focus:border-[#FF1E42] text-[#FFA000] focus:outline-none focus:shadow-[0_0_12px_rgba(255,30,66,0.5)]"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#A09CA8] pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => setResendTimer(28)}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1 font-semibold ${
                    resendTimer > 0 ? 'text-[#777] cursor-not-allowed' : 'text-[#FF4A6B] hover:underline'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-[0_6px_25px_rgba(255,30,66,0.35)] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )
        ) : (
          /* Email / Password Form */
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleEmailSubmit}
            className="space-y-3.5"
          >
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                  Store Owner Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sayan Kumar Patra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18111D] border border-white/10 text-xs text-white placeholder-[#777] focus:outline-none focus:border-[#FF1E42]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayan@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#18111D] border border-white/10 text-xs text-white placeholder-[#777] focus:outline-none focus:border-[#FF1E42]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#18111D] border border-white/10 text-xs text-white placeholder-[#777] focus:outline-none focus:border-[#FF1E42]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-[0_6px_25px_rgba(255,30,66,0.35)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isSignUp ? 'Create BillKart Account' : 'Login to Store Terminal'}</span>
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}

