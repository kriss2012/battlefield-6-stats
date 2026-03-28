import React from 'react';

import React from 'react';

export interface CharacterLore {
  id: string;
  name: string;
  role: string;
  bio: string;
  traits: string[];
  specialization: string;
  status: 'ACTIVE' | 'MIA' | 'REDACTED' | 'DECEASED';
}

export const characterLore: Record<string, CharacterLore> = {
  aryan_shadow: {
    id: 'aryan_shadow',
    name: 'ARYAN SHARMA',
    role: 'THE SHADOW OPERATIVE',
    bio: 'Once a quiet student in Nagpur, Aryan was forged into a ghost by the Iron Shadow Front. After his mother was taken, he dismantled the organization from within. Now, he operates as a freelance asset, tracking ISF remnants across the globe.',
    traits: ['Invisible', 'Analytic', 'Relentless'],
    specialization: 'Infiltration & Strategic Disruption',
    status: 'ACTIVE'
  },
  savita: {
    id: 'savita',
    name: 'SAVITA SHARMA',
    role: 'THE ANCHOR',
    bio: 'A teacher whose quiet strength defined Aryan\'s moral compass. Her abduction by the ISF was the catalyst for the Shadow Rising. Her final words remain the only thing keeping Aryan from fully disappearing into the darkness.',
    traits: ['Resilient', 'Observant', 'Principled'],
    specialization: 'Cultural Intelligence & Ethics',
    status: 'DECEASED'
  },
  balwant: {
    id: 'balwant',
    name: 'BALWANT SINGH',
    role: 'THE MENTOR',
    bio: 'Former RAW operative with thirty years of off-book experience. He saw the potential in Aryan\'s rage and shaped it into a weapon. He provides the tactical oversight and global network required for Shadow operations.',
    traits: ['Strategic', 'Cynical', 'Loyal'],
    specialization: 'Tactical Training & Logistics',
    status: 'ACTIVE'
  },
  kabir: {
    id: 'kabir',
    name: 'KABIR RAO',
    role: 'THE INSTRUMENT',
    bio: 'The son of a powerful MLA, Kabir was the catalyst for Aryan\'s initial fall. His entitled cruelty led to the confrontation that first revealed Aryan\'s latent combat potential.',
    traits: ['Aggressive', 'Entitled', 'Unpredictable'],
    specialization: 'Political Enforcement',
    status: 'MIA'
  },
  director: {
    id: 'director',
    name: 'THE DIRECTOR',
    role: 'THE ARCHITECT',
    bio: 'The enigmatic leader of the Iron Shadow Front. He viewed human conflict as a series of mathematical equations to be solved through pressure and leverage.',
    traits: ['Calculating', 'Enigmatic', 'Ruthless'],
    specialization: 'Global Network Architecture',
    status: 'REDACTED'
  }
};

const TacticalOverlay = () => (
  <>
    <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5" />
    <path d="M0 10 L5 10 M95 10 L100 10 M0 90 L5 90 M95 90 L100 90" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
    <circle cx="10" cy="10" r="1" fill="rgba(59, 130, 246, 0.5)" />
    <circle cx="90" cy="10" r="1" fill="rgba(59, 130, 246, 0.5)" />
    <circle cx="10" cy="90" r="1" fill="rgba(59, 130, 246, 0.5)" />
    <circle cx="90" cy="90" r="1" fill="rgba(59, 130, 246, 0.5)" />
  </>
);

export const CharacterPortraits: Record<string, React.ReactNode> = {
  aryan_young: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="gradYoung" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
      </defs>
      <TacticalOverlay />
      <circle cx="50" cy="40" r="28" fill="url(#gradYoung)" stroke="#444" strokeWidth="1"/>
      <path d="M30 75 Q50 95 70 75" fill="none" stroke="#444" strokeWidth="2" strokeDasharray="2 2" />
      <g opacity="0.6">
        <circle cx="42" cy="38" r="2" fill="#666"/>
        <circle cx="58" cy="38" r="2" fill="#666"/>
        <path d="M45 50 Q50 54 55 50" fill="none" stroke="#666" strokeWidth="1"/>
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#444" className="font-mono tracking-widest">SUB_ID: 09-AS</text>
    </svg>
  ),
  aryan_shadow: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="gradShadow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="70%" stopColor="#050000" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <filter id="glowRed">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <TacticalOverlay />
      <circle cx="50" cy="40" r="30" fill="url(#gradShadow)" stroke="#8B0000" strokeWidth="1.5" className="animate-pulse" />
      <path d="M25 80 Q50 110 75 80" fill="none" stroke="#8B0000" strokeWidth="2" filter="url(#glowRed)" />
      <path d="M40 38 L44 38" stroke="#ff0000" strokeWidth="2" filter="url(#glowRed)" />
      <path d="M56 38 L60 38" stroke="#ff0000" strokeWidth="2" filter="url(#glowRed)" />
      <path d="M42 52 Q50 48 58 52" fill="none" stroke="#8B0000" strokeWidth="1" opacity="0.5" />
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#8B0000" className="font-mono tracking-[0.2em]">OPERATIVE_ACTIVE</text>
      <rect x="35" y="85" width="30" height="0.5" fill="#8B0000" opacity="0.3" />
    </svg>
  ),
  savita: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <TacticalOverlay />
      <circle cx="50" cy="40" r="26" fill="rgba(160, 144, 128, 0.05)" stroke="#a09080" strokeWidth="0.5" strokeDasharray="4 2" />
      <path d="M30 75 Q50 100 70 75" fill="none" stroke="#a09080" strokeWidth="1" opacity="0.4" />
      <g filter="url(#softGlow)" opacity="0.6">
        <path d="M42 38 Q45 34 48 38" fill="none" stroke="#a09080" strokeWidth="1"/>
        <path d="M52 38 Q55 34 58 38" fill="none" stroke="#a09080" strokeWidth="1"/>
        <path d="M46 52 Q50 56 54 52" fill="none" stroke="#a09080" strokeWidth="1"/>
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#a09080" className="font-mono" opacity="0.5">MEMORY_ENHANCED</text>
    </svg>
  ),
  balwant: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(212, 172, 13, 0.1)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <TacticalOverlay />
      <circle cx="50" cy="40" r="32" fill="url(#grid)" stroke="#d4ac0d" strokeWidth="1" opacity="0.8" />
      <path d="M28 80 L72 80" stroke="#d4ac0d" strokeWidth="3" opacity="0.4"/>
      <g stroke="#d4ac0d" strokeWidth="2">
        <path d="M40 38 L44 38" />
        <path d="M56 38 L60 38" />
      </g>
      <path d="M45 55 L55 55" stroke="#d4ac0d" strokeWidth="1" opacity="0.5" />
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#d4ac0d" className="font-mono tracking-widest">SECTOR_COMMANDER</text>
    </svg>
  ),
  kabir: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <TacticalOverlay />
      <circle cx="50" cy="40" r="28" fill="#1a0a0a" stroke="#c0392b" strokeWidth="1.5" />
      <path d="M30 75 Q50 95 70 75" fill="none" stroke="#c0392b" strokeWidth="2" strokeDasharray="5 2" />
      <g stroke="#c0392b" strokeWidth="2.5">
        <path d="M40 35 L48 38" />
        <path d="M52 38 L60 35" />
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#c0392b" className="font-mono">TARGET_SIGHTED</text>
    </svg>
  ),
  director: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="static">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="desaturated"/>
          <feComponentTransfer in="desaturated">
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic"/>
        </filter>
      </defs>
      <TacticalOverlay />
      <circle cx="50" cy="40" r="30" fill="#000" stroke="#f5f0ea" strokeWidth="1" filter="url(#static)" />
      <path d="M25 85 L75 85" stroke="#f5f0ea" strokeWidth="4" opacity="0.2"/>
      <g fill="#f5f0ea" opacity="0.8">
        <circle cx="40" cy="38" r="1.5" />
        <circle cx="60" cy="38" r="1.5" />
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#f5f0ea" className="font-mono tracking-[0.4em]">ADMIN_NULL</text>
    </svg>
  ),
  priya: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <TacticalOverlay />
      <circle cx="50" cy="40" r="28" fill="rgba(59, 130, 246, 0.05)" stroke="#3b82f6" strokeWidth="1" />
      <path d="M35 35 Q50 30 65 35" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      <g stroke="#3b82f6" strokeWidth="2">
        <path d="M40 40 L44 40" />
        <path d="M56 40 L60 40" />
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#3b82f6" className="font-mono">INTEL_NODE</text>
    </svg>
  ),
  suresh: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <TacticalOverlay />
      <circle cx="50" cy="40" r="29" fill="#090909" stroke="#a09080" strokeWidth="1.5" opacity="0.7" />
      <path d="M30 80 L70 80" stroke="#a09080" strokeWidth="3" opacity="0.3" />
      <g stroke="#a09080" strokeWidth="2" opacity="0.5">
        <path d="M42 38 L46 38" />
        <path d="M54 38 L58 38" />
      </g>
      <text x="50" y="15" textAnchor="middle" fontSize="4" fill="#a09080" className="font-mono">LOGISTICS_SEC</text>
    </svg>
  )
};
