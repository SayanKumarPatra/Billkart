import { motion } from 'motion/react';

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
  size = 'lg',
  showTagline = true,
  showScript = false,
  horizontal = false,
  className = '',
  animate = true,
  lightMode = false,
}: BillKartLogoProps) {
  // Dimensions scaling based on size
  const config = {
    sm: { w: 42, h: 42, text: 'text-xl', sub: 'text-[10px]', swooshW: 70 },
    md: { w: 64, h: 64, text: 'text-2xl md:text-3xl', sub: 'text-xs', swooshW: 100 },
    lg: { w: 100, h: 100, text: 'text-4xl md:text-5xl', sub: 'text-xs md:text-sm', swooshW: 140 },
    xl: { w: 140, h: 140, text: 'text-5xl md:text-6xl', sub: 'text-sm md:text-base', swooshW: 180 },
    splash: { w: 200, h: 200, text: 'text-5xl sm:text-6xl md:text-7xl', sub: 'text-sm sm:text-base tracking-widest', swooshW: 240 },
  }[size];

  // Horizontal layout (for compact headers)
  if (horizontal) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* 3D BillKart 'B' Emblem */}
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF1E42]/30 via-[#FF6A00]/20 to-transparent rounded-2xl blur-md" />
          <svg
            width={config.w}
            height={config.h}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-[0_6px_14px_rgba(255,30,66,0.4)]"
          >
            <defs>
              <linearGradient id="bBodyGradH" x1="40" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF4A6B" />
                <stop offset="25%" stopColor="#FF1E42" />
                <stop offset="65%" stopColor="#D90E30" />
                <stop offset="100%" stopColor="#7A0518" />
              </linearGradient>
              <linearGradient id="bHighlightH" x1="60" y1="20" x2="160" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFB300" />
                <stop offset="40%" stopColor="#FF6A00" />
                <stop offset="100%" stopColor="#FF1E42" />
              </linearGradient>
              <linearGradient id="speedGradH" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFA000" />
                <stop offset="100%" stopColor="#FF6A00" />
              </linearGradient>
              <linearGradient id="receiptGradH" x1="80" y1="30" x2="135" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#F7F7FA" />
                <stop offset="100%" stopColor="#E6E6ED" />
              </linearGradient>
              <filter id="receiptShadowH" x="65" y="30" width="85" height="120" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#1F030A" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Speed streaks on the left */}
            <g>
              <rect x="20" y="62" width="48" height="10" rx="5" fill="url(#speedGradH)" />
              <rect x="10" y="80" width="60" height="11" rx="5.5" fill="url(#speedGradH)" />
              <rect x="26" y="100" width="42" height="10" rx="5" fill="url(#speedGradH)" />
            </g>

            {/* 3D 'B' Main Body */}
            <path
              d="M70 30C70 24.4772 74.4772 20 80 20H132C154.091 20 172 37.9086 172 60C172 72.8 164.5 84 153.5 89.5C167 95.5 176 109.5 176 126C176 150.3 156.3 170 132 170H80C74.4772 170 70 165.523 70 160V30Z"
              fill="url(#bBodyGradH)"
            />
            {/* Top curved crest highlight */}
            <path
              d="M80 20H132C154.091 20 172 37.9086 172 60C172 68 169 75 164 81C158 72 147 66 132 66H70V30C70 24.4772 74.4772 20 80 20Z"
              fill="url(#bHighlightH)"
              opacity="0.95"
            />
            {/* Receipt folding out */}
            <g filter="url(#receiptShadowH)">
              <path
                d="M82 40C82 36.6863 84.6863 34 88 34H134C137.314 34 140 36.6863 140 40V136L135 131L130 136L125 131L120 136L115 131L110 136L105 131L100 136L95 131L90 136L85 131L82 134V40Z"
                fill="url(#receiptGradH)"
              />
              <rect x="92" y="52" width="38" height="4.5" rx="2.25" fill="#FF7B90" />
              <rect x="92" y="64" width="30" height="4.5" rx="2.25" fill="#FF7B90" />
              <rect x="92" y="76" width="22" height="4.5" rx="2.25" fill="#FF7B90" />
            </g>
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col">
          <div className="flex items-center font-display font-extrabold tracking-tight leading-none">
            <span className={lightMode ? 'text-[#181B22]' : 'text-white'}>
              Bill
            </span>
            <span className="bg-gradient-to-r from-[#FF6A00] via-[#FF1E42] to-[#E01032] bg-clip-text text-transparent ml-0.5">
              Kart
            </span>
          </div>
          {showTagline && (
            <span className={`text-[10px] tracking-wider font-semibold uppercase mt-0.5 ${lightMode ? 'text-[#5C5A65]' : 'text-[#A09CA8]'}`}>
              Smart Billing • Simple Business
            </span>
          )}
        </div>
      </div>
    );
  }

  // Centered / Vertical Display Logo (Matching LOGO.png exactly)
  return (
    <div className={`relative flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* 3D BillKart "B" Icon with Speed Streaks & Bill Receipt */}
      <motion.div
        initial={animate ? { scale: 0.82, opacity: 0, y: 20 } : false}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative group flex items-center justify-center"
      >
        {/* Soft Ambient Radiance Glow behind 3D emblem */}
        <div className="absolute -inset-8 bg-gradient-to-tr from-[#FF1E42]/35 via-[#FF6A00]/25 to-[#FFA000]/15 rounded-full blur-3xl opacity-85 pointer-events-none animate-pulse-glow" />

        <svg
          width={config.w}
          height={config.h}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_20px_40px_rgba(255,30,66,0.45)]"
        >
          <defs>
            {/* 3D 'B' Body Gradient: Vivid Red to Deep Crimson */}
            <linearGradient id="bBodyGradV" x1="40" y1="20" x2="185" y2="185" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4A6B" />
              <stop offset="28%" stopColor="#FF1E42" />
              <stop offset="70%" stopColor="#D90E30" />
              <stop offset="100%" stopColor="#7A0518" />
            </linearGradient>

            {/* Glossy Top Bevel: Radiant Orange-Red to Amber Highlight */}
            <linearGradient id="bHighlightV" x1="60" y1="16" x2="165" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="45%" stopColor="#FF6A00" />
              <stop offset="100%" stopColor="#FF1E42" />
            </linearGradient>

            {/* Left Speed Streaks Gradient */}
            <linearGradient id="speedGradV" x1="0" y1="0" x2="65" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FF6A00" />
            </linearGradient>

            {/* Paper Receipt Shading */}
            <linearGradient id="receiptGradV" x1="80" y1="35" x2="135" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#F7F7FA" />
              <stop offset="100%" stopColor="#E4E4EB" />
            </linearGradient>

            {/* Drop Shadow for Paper Receipt */}
            <filter id="receiptShadowV" x="65" y="28" width="85" height="124" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#240209" floodOpacity="0.55" />
            </filter>

            {/* Subtle Inner Cutout Glow */}
            <linearGradient id="innerCutGrad" x1="90" y1="105" x2="135" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B080D" />
              <stop offset="100%" stopColor="#1B0C14" />
            </linearGradient>
          </defs>

          {/* 1. Left Speed / Motion Streaks (staggered animated pills) */}
          <motion.g
            initial={animate ? { x: -25, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top streak: medium width */}
            <rect x="20" y="62" width="48" height="10" rx="5" fill="url(#speedGradV)" />
            {/* Middle streak: longest width */}
            <rect x="10" y="80" width="60" height="11" rx="5.5" fill="url(#speedGradV)" />
            {/* Bottom streak: shorter width */}
            <rect x="26" y="100" width="42" height="10" rx="5" fill="url(#speedGradV)" />
          </motion.g>

          {/* 2. Main 3D 'B' Body */}
          <path
            d="M70 30C70 24.4772 74.4772 20 80 20H132C154.091 20 172 37.9086 172 60C172 72.8 164.5 84 153.5 89.5C167 95.5 176 109.5 176 126C176 150.3 156.3 170 132 170H80C74.4772 170 70 165.523 70 160V30Z"
            fill="url(#bBodyGradV)"
          />

          {/* 3. Lower Inner Hollow of 'B' */}
          <path
            d="M95 110H128C136.837 110 144 117.163 144 126C144 134.837 136.837 142 128 142H95V110Z"
            fill="url(#innerCutGrad)"
          />

          {/* 4. Glossy Top Bevel Crest & Specular Highlight */}
          <path
            d="M80 20H132C154.091 20 172 37.9086 172 60C172 68 169 75 164 81C158 72 147 66 132 66H70V30C70 24.4772 74.4772 20 80 20Z"
            fill="url(#bHighlightV)"
            opacity="0.96"
          />

          {/* Specular White Light Reflection on top curve */}
          <path
            d="M84 24H128C145 24 160 36 164 52C152 46 135 42 120 42H76C78 30 80 24 84 24Z"
            fill="#FFFFFF"
            opacity="0.32"
          />

          {/* 5. White Bill Receipt emerging and folding down */}
          <motion.g
            filter="url(#receiptShadowV)"
            initial={animate ? { y: -15, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Paper body with zig-zag serrated bottom edge */}
            <path
              d="M82 40C82 36.6863 84.6863 34 88 34H134C137.314 34 140 36.6863 140 40V136L135 131L130 136L125 131L120 136L115 131L110 136L105 131L100 136L95 131L90 136L85 131L82 134V40Z"
              fill="url(#receiptGradV)"
            />

            {/* 3 Coral-Pink Bill Lines (matching LOGO.png perfectly) */}
            {/* Line 1: Long */}
            <rect x="92" y="52" width="38" height="4.5" rx="2.25" fill="#FF7B90" />
            {/* Line 2: Medium */}
            <rect x="92" y="64" width="30" height="4.5" rx="2.25" fill="#FF7B90" />
            {/* Line 3: Short */}
            <rect x="92" y="76" width="22" height="4.5" rx="2.25" fill="#FF7B90" />
          </motion.g>
        </svg>
      </motion.div>

      {/* Brand Typography: "BillKart" */}
      <motion.div
        initial={animate ? { opacity: 0, y: 15 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center font-display font-black tracking-tight mt-2 md:mt-3 select-none"
      >
        {/* "Bill" with stylized leaf dot on 'i' */}
        <div className="flex items-center text-[#1C1F28] dark:text-white">
          <span className={`${config.text} font-black drop-shadow-sm`}>
            B
          </span>

          {/* Lowercase 'i' with leaf-shaped orange dot */}
          <div className="relative inline-flex flex-col items-center">
            {/* Leaf dot */}
            <motion.svg
              initial={animate ? { scale: 0, rotate: -20 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.6, type: 'spring', stiffness: 350 }}
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 md:w-5 md:h-5 absolute -top-3 md:-top-4 left-0.5"
              fill="none"
            >
              <path
                d="M6 18C6 18 18 17 20 6C9 4 6 18 6 18Z"
                fill="#FF6A00"
              />
              <path
                d="M6 18C11 15 15 11 18 7"
                stroke="#FFB300"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.svg>
            <span className={`${config.text} font-black mt-0.5`}>
              ı
            </span>
          </div>

          <span className={`${config.text} font-black`}>
            ll
          </span>
        </div>

        {/* "Kart" in vibrant gradient */}
        <span
          className={`bg-gradient-to-r from-[#FF7A00] via-[#FF1E42] to-[#E01032] bg-clip-text text-transparent ${config.text} font-black drop-shadow-[0_4px_16px_rgba(255,30,66,0.35)] ml-0.5`}
        >
          Kart
        </span>
      </motion.div>

      {/* Tagline: "Smart Billing • Simple Business" */}
      {showTagline && (
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 flex items-center justify-center gap-2 select-none"
        >
          <span className={`font-semibold text-[#8C8894] dark:text-[#A09CA8] uppercase ${config.sub}`}>
            Smart Billing
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF1E42] shadow-[0_0_8px_#FF1E42]" />
          <span className={`font-semibold text-[#8C8894] dark:text-[#A09CA8] uppercase ${config.sub}`}>
            Simple Business
          </span>
        </motion.div>
      )}

      {/* Orange Curved Swoosh Underline */}
      <motion.svg
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        style={{ width: config.swooshW }}
        className="h-3 mt-1.5 select-none"
        viewBox="0 0 160 12"
        fill="none"
      >
        <path
          d="M8 3C55 11 105 11 152 3"
          stroke="url(#swooshGradV)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="swooshGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF1E42" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FF6A00" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
