import { motion } from 'motion/react';

interface BillKartLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showScript?: boolean;
  className?: string;
  animate?: boolean;
}

export function BillKartLogo({
  size = 'lg',
  showTagline = true,
  showScript = true,
  className = '',
  animate = true,
}: BillKartLogoProps) {
  const iconDimensions = {
    sm: { w: 48, h: 48, text: 'text-2xl', sub: 'text-xs' },
    md: { w: 68, h: 68, text: 'text-3xl', sub: 'text-sm' },
    lg: { w: 96, h: 96, text: 'text-4xl md:text-5xl', sub: 'text-sm md:text-base' },
    xl: { w: 120, h: 120, text: 'text-5xl md:text-6xl', sub: 'text-base md:text-lg' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center text-center ${className}`}>
      {/* Top-right subtle handwritten script accent (from reference mockup) */}
      {showScript && (
        <motion.div
          initial={animate ? { opacity: 0, y: -10, rotate: -6 } : false}
          animate={{ opacity: 0.9, y: 0, rotate: -6 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-6 right-2 md:right-4 z-10 select-none pointer-events-none"
        >
          <span className="font-script text-lg md:text-xl text-[#A9B8B3] tracking-wide block leading-tight">
            Simpler<br />
            <span className="text-[#57E39B]">Smarter</span><br />
            <span className="text-[#B8F500]">Better</span>
          </span>
        </motion.div>
      )}

      {/* 3D BillKart "B" Icon with receipt dispensing & speed trails */}
      <motion.div
        initial={animate ? { scale: 0.85, opacity: 0, y: 15 } : false}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-3 md:mb-4 group"
      >
        {/* Ambient Glow behind icon */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#19D66B]/30 via-[#B8F500]/20 to-transparent rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow" />

        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_12px_24px_rgba(25,214,107,0.35)]"
        >
          <defs>
            {/* Gradients for the 3D 'B' Body */}
            <linearGradient id="bBodyGrad" x1="20" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#25F27D" />
              <stop offset="45%" stopColor="#19D66B" />
              <stop offset="80%" stopColor="#0E9F4C" />
              <stop offset="100%" stopColor="#0B5C2E" />
            </linearGradient>

            <linearGradient id="bHighlight" x1="45" y1="18" x2="100" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B8F500" />
              <stop offset="100%" stopColor="#19D66B" />
            </linearGradient>

            <linearGradient id="speedGrad" x1="0" y1="0" x2="35" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B8F500" stopOpacity="0" />
              <stop offset="100%" stopColor="#B8F500" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="receiptGrad" x1="48" y1="20" x2="78" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5F7F6" />
              <stop offset="100%" stopColor="#D9E4E0" />
            </linearGradient>

            <filter id="receiptShadow" x="38" y="22" width="50" height="66" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#04120F" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* Speed / Motion lines on the left */}
          <g className="animate-pulse">
            <rect x="14" y="38" width="22" height="4.5" rx="2.25" fill="url(#speedGrad)" />
            <rect x="8" y="48" width="28" height="5" rx="2.5" fill="url(#speedGrad)" />
            <rect x="18" y="59" width="18" height="4.5" rx="2.25" fill="url(#speedGrad)" />
          </g>

          {/* Main 3D 'B' Backbone & Spine */}
          <path
            d="M42 20C42 16.6863 44.6863 14 48 14H78C89.0457 14 98 22.9543 98 34C98 42.1154 93.1818 49.1062 86.2647 52.2031C94.4093 55.4385 100 63.4682 100 72.5C100 85.4787 89.4787 96 76.5 96H48C44.6863 96 42 93.3137 42 90V20Z"
            fill="url(#bBodyGrad)"
          />

          {/* Inner cutout lower curve for 'B' */}
          <path
            d="M58 64H75C79.4183 64 83 67.5817 83 72C83 76.4183 79.4183 80 75 80H58V64Z"
            fill="#061B16"
            opacity="0.85"
          />

          {/* 3D Top bevel curve */}
          <path
            d="M48 14H78C89.0457 14 98 22.9543 98 34C98 38.6 96.4 42.8 93.7 46.1C89.8 41.5 82.5 38 74 38H42V20C42 16.6863 44.6863 14 48 14Z"
            fill="url(#bHighlight)"
            opacity="0.9"
          />

          {/* The White Bill Receipt emerging and folding down */}
          <g filter="url(#receiptShadow)">
            <path
              d="M48 24C48 22.8954 48.8954 22 50 22H78C81.3137 22 84 24.6863 84 28V68L80 65L76 68L72 65L68 68L64 65L60 68L56 65L52 68L48 65V24Z"
              fill="url(#receiptGrad)"
            />
            {/* Printed lines on the receipt paper */}
            <rect x="54" y="32" width="24" height="3" rx="1.5" fill="#10352D" />
            <rect x="54" y="39" width="18" height="3" rx="1.5" fill="#10352D" />
            <rect x="54" y="46" width="22" height="3" rx="1.5" fill="#10352D" />
            {/* Small barcode representation at bottom of receipt */}
            <rect x="54" y="54" width="2" height="6" fill="#10352D" opacity="0.7" />
            <rect x="58" y="54" width="3.5" height="6" fill="#10352D" opacity="0.7" />
            <rect x="63" y="54" width="1.5" height="6" fill="#10352D" opacity="0.7" />
            <rect x="66" y="54" width="3" height="6" fill="#10352D" opacity="0.7" />
            <rect x="71" y="54" width="2" height="6" fill="#10352D" opacity="0.7" />
            <rect x="75" y="54" width="1.5" height="6" fill="#10352D" opacity="0.7" />
          </g>

          {/* Small bright lime leaf / spark accent */}
          <circle cx="94" cy="24" r="3.5" fill="#B8F500" />
        </svg>
      </motion.div>

      {/* BillKart Typography */}
      <motion.div
        initial={animate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex items-center tracking-tight font-display font-extrabold"
      >
        <span className={`text-[#F5F7F6] ${iconDimensions.text} drop-shadow-sm`}>
          Bill
        </span>
        <span
          className={`bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] bg-clip-text text-transparent ${iconDimensions.text} drop-shadow-[0_4px_12px_rgba(25,214,107,0.3)] ml-0.5`}
        >
          Kart
        </span>
      </motion.div>

      {/* Tagline: Smart Billing • Simple Business */}
      {showTagline && (
        <motion.div
          initial={animate ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-1.5 flex items-center justify-center gap-2"
        >
          <span className={`font-semibold tracking-wider text-[#A9B8B3] uppercase text-xs md:text-sm`}>
            Smart Billing
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#19D66B] shadow-[0_0_6px_#19D66B]" />
          <span className={`font-semibold tracking-wider text-[#A9B8B3] uppercase text-xs md:text-sm`}>
            Simple Business
          </span>
        </motion.div>
      )}
    </div>
  );
}
