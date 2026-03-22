import React from 'react';

export const CharacterPortraits: Record<string, React.ReactNode> = {
  aryan_young: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="25" fill="#2d2d2d" stroke="#555" strokeWidth="1"/>
      <path d="M30 65 Q50 90 70 65" fill="none" stroke="#555" strokeWidth="2"/>
      <circle cx="42" cy="38" r="2" fill="#555"/>
      <circle cx="58" cy="38" r="2" fill="#555"/>
      <path d="M45 48 Q50 52 55 48" fill="none" stroke="#555" strokeWidth="1"/>
    </svg>
  ),
  aryan_shadow: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="shadowG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="40" r="25" fill="url(#shadowG)" stroke="#8B0000" strokeWidth="1.5"/>
      <path d="M25 70 Q50 100 75 70" fill="none" stroke="#8B0000" strokeWidth="2"/>
      <path d="M40 38 L44 38" stroke="#8B0000" strokeWidth="2"/>
      <path d="M56 38 L60 38" stroke="#8B0000" strokeWidth="2"/>
      <path d="M45 50 Q50 48 55 50" fill="none" stroke="#8B0000" strokeWidth="1"/>
    </svg>
  ),
  savita: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="24" fill="#a09080" opacity="0.2" stroke="#a09080" strokeWidth="1"/>
      <path d="M30 70 Q50 95 70 70" fill="none" stroke="#a09080" strokeWidth="1.5"/>
      <path d="M42 38 Q45 35 48 38" fill="none" stroke="#a09080" strokeWidth="1"/>
      <path d="M52 38 Q55 35 58 38" fill="none" stroke="#a09080" strokeWidth="1"/>
      <path d="M45 50 Q50 55 55 50" fill="none" stroke="#a09080" strokeWidth="1"/>
    </svg>
  ),
  balwant: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="26" fill="#1a1a1a" stroke="#d4ac0d" strokeWidth="1.5" strokeOpacity="0.5"/>
      <path d="M28 72 L72 72" stroke="#d4ac0d" strokeWidth="2" strokeOpacity="0.5"/>
      <path d="M40 38 L43 38" stroke="#d4ac0d" strokeWidth="2"/>
      <path d="M57 38 L60 38" stroke="#d4ac0d" strokeWidth="2"/>
      <path d="M40 55 L60 55" stroke="#d4ac0d" strokeWidth="1.5" strokeOpacity="0.3"/>
    </svg>
  ),
  kabir: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="25" fill="#2a1414" stroke="#c0392b" strokeWidth="1"/>
      <path d="M30 70 Q50 90 70 70" fill="none" stroke="#c0392b" strokeWidth="2"/>
      <path d="M42 35 L48 37" stroke="#c0392b" strokeWidth="2"/>
      <path d="M52 37 L58 35" stroke="#c0392b" strokeWidth="2"/>
    </svg>
  ),
  director: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="26" fill="#000" stroke="#f5f0ea" strokeWidth="2" strokeOpacity="0.8"/>
      <path d="M25 75 L75 75" stroke="#f5f0ea" strokeWidth="3" strokeOpacity="0.6"/>
      <circle cx="40" cy="38" r="1.5" fill="#f5f0ea"/>
      <circle cx="60" cy="38" r="1.5" fill="#f5f0ea"/>
      <path d="M45 52 L55 52" stroke="#f5f0ea" strokeWidth="1" strokeOpacity="0.5"/>
    </svg>
  ),
  priya: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="24" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M35 35 Q50 30 65 35" fill="none" stroke="#3b82f6" strokeWidth="1"/>
      <path d="M40 40 L44 40" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M56 40 L60 40" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M48 55 L52 55" stroke="#3b82f6" strokeWidth="1"/>
    </svg>
  ),
  suresh: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="25" fill="#111" stroke="#a09080" strokeWidth="2"/>
      <path d="M30 75 L70 75" stroke="#a09080" strokeWidth="3"/>
      <path d="M42 38 L45 38" stroke="#a09080" strokeWidth="2"/>
      <path d="M55 38 L58 38" stroke="#a09080" strokeWidth="2"/>
      <path d="M45 50 L55 50" stroke="#a09080" strokeWidth="1.5"/>
    </svg>
  ),
  dev: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="27" fill="#1a0a0a" stroke="#8b0000" strokeWidth="1"/>
      <path d="M25 78 L75 78" stroke="#8b0000" strokeWidth="4"/>
      <circle cx="42" cy="38" r="1" fill="#8b0000"/>
      <circle cx="58" cy="38" r="1" fill="#8b0000"/>
    </svg>
  ),
  prashant: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="23" fill="#0d0d0d" stroke="#555" strokeWidth="1"/>
      <path d="M35 70 Q50 85 65 70" fill="none" stroke="#555" strokeWidth="1.5"/>
      <circle cx="44" cy="38" r="1.5" fill="#555"/>
      <circle cx="56" cy="38" r="1.5" fill="#555"/>
    </svg>
  )
};
