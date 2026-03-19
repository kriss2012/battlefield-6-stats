export interface Mission {
  id: string;
  title: string;
  location: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'REDACTED';
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED';
  description: string;
  objectives: string[];
  rewards: string[];
  briefing: {
    commander: string;
    text: string;
  };
}

export const missions: Mission[] = [
  {
    id: 'm1',
    title: 'OPERATION NEON SHADOW',
    location: 'DOHA, QATAR',
    difficulty: 'EASY',
    status: 'AVAILABLE',
    description: 'Intercept encrypted data from a rogue PMC cell operating in the city center.',
    objectives: [
      'Infiltrate the server room at the Q-Center.',
      'Download the classified "Icarus" protocols.',
      'Extract via the rooftop helipad.'
    ],
    rewards: [
      '1500 XP',
      'Attachment: Tactical Suppressor',
      'Operator Skin: Night Stalker'
    ],
    briefing: {
      commander: 'COLONEL VANCE',
      text: 'Vanguard, we’ve tracked a rogue PMC cell to Doha. They’re sitting on data that could trigger a global blackout. Your job is simple: get in, grab the data, and get out before they realize the firewall is breached. Zero footprint. Over.'
    }
  },
  {
    id: 'm2',
    title: 'ARCTIC SILENCE',
    location: 'SVALBARD, NORWAY',
    difficulty: 'MEDIUM',
    status: 'LOCKED',
    description: 'Sabotage a secret research facility hidden beneath the ice.',
    objectives: [
      'Neutralize the perimeter sentries.',
      'Plant explosives on the cooling generators.',
      'Escape before the facility self-destructs.'
    ],
    rewards: [
      '2500 XP',
      'Weapon: SWS-10 Winter Camo',
      'New Operator: Glacier'
    ],
    briefing: {
      commander: 'MAJOR KORT',
      text: 'It’s cold out there, Vanguard. The Arkangelsk Group is testing something they shouldn’t be in the Arctic circle. We need that facility offline. Move fast, the cold isn’t the only thing that kills up there.'
    }
  },
  {
    id: 'm3',
    title: 'TITAN FALL',
    location: 'ORBITAL STATION',
    difficulty: 'HARD',
    status: 'LOCKED',
    description: 'Reclaim control of a hijacked orbital kinetic weapon.',
    objectives: [
      'Perform zero-G breach of the airlock.',
      'Disable the manual override on the bridge.',
      'Secure the station commander.'
    ],
    rewards: [
      '5000 XP',
      'Title: Orbital Vanguard',
      'Legendary Skin: Zero Gravity'
    ],
    briefing: {
      commander: 'GENERAL CHASE',
      text: 'Listen up. The "Titan" orbital platform has been hijacked. If they fire that thing, millions die. You’re launching in 20 minutes. I expect results, not excuses. Good luck, soldier.'
    }
  }
];
