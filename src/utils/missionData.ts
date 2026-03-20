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
    title: 'THE TEXTILE DISTRICT',
    location: 'NAGPUR, INDIA',
    difficulty: 'EASY',
    status: 'AVAILABLE',
    description: 'Infiltrate ISF Safehouse 3 and extract the location of the high-value target.',
    objectives: [
      'Bypass the perimeter security cameras.',
      'Enter the building via the north service door.',
      'Confront Veer Choudhary in the logistics office.'
    ],
    rewards: [
      '1500 XP',
      'Tactical Map: District 7',
      'Skill: Spatial Awareness'
    ],
    briefing: {
      commander: 'BALWANT SINGH',
      text: 'Aryan, this is the first step. Safehouse 3 is where they took her initially. Find Veer Choudhary. He processes all transits. He’ll know exactly where she was moved. Remember your training: zero footprint.'
    }
  },
  {
    id: 'm2',
    title: 'THE FORTY-SEVENTH HOUR',
    location: 'DISTRICT 7, NAGPUR',
    difficulty: 'MEDIUM',
    status: 'LOCKED',
    description: 'Bypass the garrison at the District 7 compound and rescue Savita Sharma.',
    objectives: [
      'Infiltrate the north wall blind spot.',
      'Descend to Basement Level 2.',
      'Secure Savita Sharma and extract.'
    ],
    rewards: [
      '2500 XP',
      'Weapon: Balwant’s Custom Sidearm',
      'Trait: Unyielding Resolve'
    ],
    briefing: {
      commander: 'BALWANT SINGH',
      text: 'The forty-eight-hour window is closing. District 7 is a fortress, Aryan. They’re expecting trouble, but they’re not expecting you. Get in there, find her, and bring her home. No matter what happens, you don’t stop moving.'
    }
  },
  {
    id: 'm3',
    title: 'THE HILLSIDE VILLA',
    location: 'HILL STATION, NAGPUR',
    difficulty: 'HARD',
    status: 'LOCKED',
    description: 'Infiltrate Commander Hasan’s fortified estate and dismantle ISF’s military structure.',
    objectives: [
      'Eliminate the outer perimeter sentries.',
      'Breach the main villa ground floor.',
      'Neutralize Commander Hasan.'
    ],
    rewards: [
      '5000 XP',
      'Title: Shadow Rising',
      'Legendary Gear: ISF Encryption Key'
    ],
    briefing: {
      commander: 'BALWANT SINGH',
      text: 'This is it. Hasan is the one who ran the enforcement chain. He’s protected by a dozen professionals. If you take him down, the rest of the network will fracture. This won’t be a clean operation, Aryan. It will be war.'
    }
  }
];
