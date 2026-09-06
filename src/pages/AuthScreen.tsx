import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { BillKartLogo } from '../components/BillKartLogo';
import { useApp } from '../contexts/AppContext';

export function AuthScreen() {
  const { setUser, setCurrentView } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('store@billkart.in');
  const [password, setPassword] = useState('pass1234');
  const [name, setName] = useState('Rahul Sharma');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'usr-1',
      name: isSignUp ? name : 'Rahul Sharma',
      email: email,
      isAuthenticated: true,
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
    });
    setCurrentView('dashboard');
  };

  const handleGoogleLogin = () => {
    setUser({
      id: 'usr-google',
      name: 'Google Merchant User',
      email: 'merchant@gmail.com',
      isAuthenticated: true,
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
    });
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#061B16] text-[#F5F7F6] flex flex-col justify-center items-center p-4 sm:p-6 relative select-none">
      <div className="w-full max-w-md bg-[#0B2822] border border-[#19D66B]/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10">
        <div className="flex justify-center mb-6">
          <BillKartLogo size="md" />
        </div>

        {showForgotPassword ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-center text-[#F5F7F6]">
              Reset Password
            </h3>
            <p className="text-xs text-[#A9B8B3] text-center">
              Enter your registered store email to receive a secure recovery code.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-[#19D66B]/15 border border-[#19D66B]/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#19D66B] mx-auto" />
                <p className="text-xs font-bold text-[#F5F7F6]">Recovery link dispatched!</p>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-xs text-[#B8F500] font-semibold underline mt-2 block mx-auto"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSent(true);
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#19D66B] hover:bg-[#B8F500] text-[#061B16] font-bold text-xs shadow-md transition-colors"
                >
                  Send Recovery Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-2 text-xs text-[#A9B8B3] hover:text-white"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div className="flex rounded-xl bg-[#061B16] p-1 mb-6 border border-[#19D66B]/20">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isSignUp ? 'bg-[#10352D] text-[#B8F500] shadow-sm' : 'text-[#A9B8B3]'
                }`}
              >
                Store Login
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  isSignUp ? 'bg-[#10352D] text-[#B8F500] shadow-sm' : 'text-[#A9B8B3]'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Store Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/50 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="store@billkart.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-[#A9B8B3]">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] text-[#57E39B] hover:text-[#B8F500]"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/50 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] text-[#061B16] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isSignUp ? 'Create BillKart Account' : 'Login to Store Terminal'}</span>
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-[#19D66B]/15 w-full" />
              <span className="bg-[#0B2822] px-2 text-[10px] uppercase font-bold text-[#A9B8B3]">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 rounded-xl bg-[#061B16] hover:bg-[#10352D] border border-[#19D66B]/25 text-xs font-semibold text-[#F5F7F6] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
