import React from 'react';

/**
 * SportPulse Brand Logo Component
 * Combines an energetic athletic shield crest, electric pulse/heartbeat ECG wave, 
 * and modern athletic typography.
 */
export const SportPulseLogo = ({ 
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true, 
  variant = 'full', // 'full' | 'mark' | 'white'
  className = '' 
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', svg: 28, text: 'text-base', sub: 'text-[8px]' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10', svg: 38, text: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    lg: { box: 'w-12 h-12 sm:w-14 sm:h-14', svg: 48, text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16 sm:w-20 sm:h-20', svg: 64, text: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Dynamic Vector Emblem Crest */}
      <div className={`relative ${currentSize.box} rounded-2xl p-1.5 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 overflow-hidden group`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white drop-shadow"
        >
          <defs>
            <linearGradient id="spGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="pulseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>

          {/* Athletic Shield Apex Outer Path */}
          <path 
            d="M24 4L39 9.5V23C39 32.5 32.6 40.8 24 44C15.4 40.8 9 32.5 9 23V9.5L24 4Z" 
            stroke="url(#spGrad)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="opacity-90"
          />

          {/* Athletic Victory Torch / Apex Chevron */}
          <path 
            d="M24 10L28 17H20L24 10Z" 
            fill="url(#spGrad)" 
          />

          {/* Dynamic Heartbeat / Sport Pulse Line across shield */}
          <path 
            d="M13 26H19L21.5 20L25 32L28.5 24L31 26H35" 
            stroke="url(#pulseGlow)" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Pulse Live Core Dot */}
          <circle cx="25" cy="32" r="2" fill="#FACC15" />
          <circle cx="25" cy="32" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Wordmark with Sport + Pulse styling */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight font-urbanist ${currentSize.text} ${variant === 'white' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            <span>SPORT</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">PULSE</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5 animate-pulse"></span>
          </div>
          <span className={`font-extrabold uppercase tracking-[0.2em] ${currentSize.sub} text-slate-400 dark:text-slate-400 mt-0.5`}>
            TOURNAMENT SUITE
          </span>
        </div>
      )}
    </div>
  );
};
