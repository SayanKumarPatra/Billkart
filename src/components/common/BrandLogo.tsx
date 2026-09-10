import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Size mappings
  const iconDimensions = {
    sm: { w: 28, h: 28 },
    md: { w: 38, h: 38 },
    lg: { w: 48, h: 48 },
    xl: { w: 64, h: 64 },
  }[size];

  const emblem = (
    <div 
      className={`relative shrink-0 flex items-center justify-center select-none ${
        size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-9 h-9' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main B gradient: Vivid Red to Orange */}
          <linearGradient id="bk_b_grad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FF1E43" />
            <stop offset="50%" stopColor="#FF4B2B" />
            <stop offset="100%" stopColor="#FF8008" />
          </linearGradient>

          {/* Speed dashes gradient */}
          <linearGradient id="bk_dash_grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#FF4B2B" />
          </linearGradient>

          {/* Receipt drop shadow */}
          <filter id="receipt_shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Speed trails on the left */}
        <rect x="6" y="42" width="22" height="6" rx="3" fill="url(#bk_dash_grad)" />
        <rect x="12" y="52" width="18" height="6" rx="3" fill="url(#bk_dash_grad)" />
        <rect x="18" y="62" width="12" height="6" rx="3" fill="url(#bk_dash_grad)" />

        {/* Stylized 'B' Backbone & Loops */}
        <path
          d="M32 18 C32 15 35 12 40 12 L65 12 C78 12 88 20 88 32 C88 41 82 48 73 50 C84 53 90 62 90 73 C90 86 78 92 64 92 L38 92 C34 92 32 89 32 85 Z"
          fill="url(#bk_b_grad)"
        />

        {/* B Upper negative hole */}
        <path
          d="M48 26 L62 26 C68 26 73 29 73 34 C73 39 68 42 62 42 L48 42 Z"
          fill="#FFF"
          opacity="0.18"
        />

        {/* B Lower negative hole */}
        <path
          d="M48 58 L63 58 C70 58 75 62 75 68 C75 74 70 78 63 78 L48 78 Z"
          fill="#FFF"
          opacity="0.18"
        />

        {/* Draped Paper Receipt in Center */}
        <g filter="url(#receipt_shadow)">
          <path
            d="M42 36 C42 36 50 32 64 32 C72 32 76 35 76 42 L76 76 L72 73 L68 76 L64 73 L60 76 L56 73 L52 76 L48 73 L44 76 L42 74 Z"
            fill="#FFFFFF"
          />
          {/* Bill Receipt Lines */}
          <rect x="49" y="44" width="20" height="3" rx="1.5" fill="#FF5252" opacity="0.85" />
          <rect x="49" y="51" width="20" height="3" rx="1.5" fill="#FF5252" opacity="0.85" />
          <rect x="49" y="58" width="14" height="3" rx="1.5" fill="#FF5252" opacity="0.85" />
        </g>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{emblem}</div>;
  }

  if (variant === 'badge') {
    return (
      <div 
        className={`inline-flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 ${className}`}
      >
        <div className="w-8 h-8 rounded-xl bg-slate-800/80 p-0.5 flex items-center justify-center">
          {emblem}
        </div>
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center text-sm font-black tracking-tight font-display">
            <span className="text-white">Bill</span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent ml-0.5">Kart</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium tracking-wide mt-0.5">Smart Billing</span>
        </div>
      </div>
    );
  }

  // Full Logo with typography
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {emblem}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-baseline font-black font-display tracking-tight">
          <span className={`text-slate-900 dark:text-white ${
            size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          }`}>
            Bill
          </span>
          <span className={`bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent ml-0.5 ${
            size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          }`}>
            Kart
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Smart Billing
            </span>
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Simple Business
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
