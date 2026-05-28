/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 */
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40, glow = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={glow ? "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : ""}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Hexagon Target Ring */}
        <polygon
          points="50,5 90,28 90,72 50,95 10,72 10,28"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          strokeDasharray="10 5"
          opacity="0.6"
        />

        {/* Tactical Crosshairs */}
        <line x1="50" y1="0" x2="50" y2="15" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
        <line x1="50" y1="85" x2="50" y2="100" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
        <line x1="0" y1="50" x2="15" y2="50" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
        <line x1="85" y1="50" x2="100" y2="50" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />

        {/* Inner Stylized S-Blade */}
        <path
          d="M 68 30 
             C 68 20, 32 20, 32 35 
             C 32 50, 68 50, 68 65 
             C 68 80, 32 80, 32 70"
          stroke="url(#logoGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logoGlow)"
        />

        {/* Core Node */}
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
      </svg>
      <div className="flex flex-col">
        <span className="text-lg font-black italic tracking-wider leading-none text-white uppercase">
          SPECTRE <span className="text-blue-500 font-black">DIVISION</span>
        </span>
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.4em] leading-none mt-1">
          SHADOW RECKONING
        </span>
      </div>
    </div>
  );
};

export default Logo;
