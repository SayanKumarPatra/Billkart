import { Receipt, Store } from 'lucide-react';

interface BillKartLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  showTagline?: boolean;
  showScript?: boolean;
  horizontal?: boolean;
  className?: string;
  animate?: boolean;
  lightMode?: boolean;
}

export function BillKartLogo({
  size = 'md',
  showTagline = true,
  horizontal = false,
  className = '',
}: BillKartLogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    splash: 'w-12 h-12',
  }[size];

  const boxSizes = {
    sm: 'w-9 h-9 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
    splash: 'w-20 h-20 rounded-3xl',
  }[size];

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
    splash: 'text-4xl sm:text-5xl font-black',
  }[size];

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
    splash: 'text-sm sm:text-base',
  }[size];

  if (horizontal) {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {/* Crisp Enterprise Emblem */}
        <div className={`${boxSizes} bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs`}>
          <Store className={iconSizes} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${textSizes} tracking-tight text-slate-900 dark:text-white font-display`}>
              Bill<span className="text-blue-600">Kart</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              POS
            </span>
          </div>
          {showTagline && (
            <span className={`${subSizes} text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5`}>
              Retail Billing & UPI POS
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <div className={`${boxSizes} bg-blue-600 text-white flex items-center justify-center shadow-md mb-2`}>
        <Receipt className={iconSizes} />
      </div>
      <div className="flex items-center gap-1.5 leading-tight">
        <span className={`${textSizes} tracking-tight text-slate-900 dark:text-white font-display`}>
          Bill<span className="text-blue-600">Kart</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
          POS
        </span>
      </div>
      {showTagline && (
        <p className={`${subSizes} text-slate-500 dark:text-slate-400 font-medium mt-1`}>
          স্মার্ট রিটেল বিলিং ও বিজনেস সমাধান
        </p>
      )}
    </div>
  );
}
