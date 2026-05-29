/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: storyData.ts
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
export interface Choice {
  text: string;
  goto: string;
  tag?: 'fight' | 'intel' | 'stealth' | 'empathy';
  raiseRage?: boolean;
  lowerRage?: boolean;
  setFought?: boolean;
  saveEvidence?: boolean;
  setAlliance?: boolean;
  unlockSkill?: 'combat' | 'stealth' | 'intel';
  collectItem?: 'drawing' | 'map' | 'flashDrive' | 'gear';
  timed?: number; // Time in ms
}

export interface Scene {
  chapter: string;
  title: string;
  text: string;
  art: string;
  portrait?: string;
  speaker?: string;
  choices: Choice[];
  condition?: (state: any) => boolean;
}

export const storyData: Record<string, Scene> = {
  // CHAPTER 1: THE BOY WHO DISAPPEARED
  s1_intro: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "NAGPUR, 2009",
    text: "The city of Nagpur woke up every morning with the smell of chai and diesel. It was a city of ordinary ambitions and ordinary cruelties, completely indifferent to the small devastations it produced in its people.",
    art: "schoolyard",
    choices: [
      { text: "Enter the flow of the city", goto: "s1_aryan_ghost" }
    ]
  },
  s1_aryan_ghost: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE GHOST IN THE CORRIDOR",
    text: "Aryan Sharma was sixteen years old and had been disappearing for two years. He walked the corridors of St. Xavier's like a ghost. His classmates registered his existence the way you register a piece of furniture — you work around it, you don't actually see it.",
    art: "schoolyard",
    choices: [
      { text: "Remember who you were", goto: "s1_original_aryan" },
      { text: "Keep your head down", goto: "s1_instrument" }
    ]
  },
  s1_original_aryan: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE BOY WHO LAUGHED",
    text: "At fourteen, Aryan had been the kind of boy who laughed too loudly and drew cartoons. He had won the district drawing competition. That boy had been systematically destroyed over two school years.",
    art: "schoolyard",
    choices: [
      { text: "Whose hand held the instrument?", goto: "s1_instrument" }
    ]
  },
  s1_instrument: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE INSTRUMENT",
    text: "Kabir Rao was seventeen, broad-shouldered, and possessed of the confidence that grows in a boy who has never been told 'no'. His father was an MLA. Kabir had absorbed his father's power like a second inheritance.",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "How did it begin?", goto: "s1_social_math" }
    ]
  },
  s1_social_math: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "SOCIAL MATHEMATICS",
    text: "Kabir chose Aryan with a predator's instinct. Aryan was quiet, had no powerful friends, and his mother was a teacher, not a politician. In the logic of St. Xavier's, this meant he had no protection.",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Avoid the gauntlet", goto: "s1_tuesday_morning" }
    ]
  },
  s1_tuesday_morning: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "TUESDAY — 8:17 AM",
    text: "Aryan arrived early to avoid the crowds. His route was carefully planned: side entrance, library passage. It added seven minutes to his morning but subtracted a significant quantity of fear.",
    art: "schoolyard",
    choices: [
      { text: "Enter the library passage", goto: "s1_ambush" }
    ]
  },
  s1_ambush: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE AMBUSH",
    text: "Kabir and his associates — Dev and Prashant — were waiting. Laughter surrounded him like water surrounding a drowning person, impersonal and everywhere.",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Absorb the damage", goto: "s1_the_theatre" }
    ]
  },
  s1_the_theatre: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE THEATRE OF CRUELTY",
    text: "Kabir took Aryan's bag and shook it. Books and a folded drawing fell. The drawing was of Savita, mid-laugh. Kabir torn it in half. 'Who's this? Your mummy?'",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Leave it and walk away", goto: "s1_home_laxmi", collectItem: "drawing" }
    ]
  },
  s1_home_laxmi: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "LAXMI NAGAR ROAD",
    text: "The flat was on the third floor. The lift was broken. The staircase smelled of spices. This was home, the only place the pressure didn't reach.",
    art: "schoolyard",
    choices: [
      { text: "Enter the kitchen", goto: "s1_savita_intro" }
    ]
  },
  s1_savita_intro: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "SAVITA",
    text: "Savita Sharma was forty-one and the center of Aryan's world. She had been raising him alone since he was seven. She looked at him now, sensing the stillness.",
    art: "schoolyard",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "Wait for the chai", goto: "s1_the_confession" }
    ]
  },
  s1_the_confession: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE CONFESSION",
    text: "'He tore the drawing,' Aryan said. 'The one of you.' Savita's hands tightened around her cup. Her face remained still.",
    art: "schoolyard",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "Listen to her promise", goto: "s1_the_vow" }
    ]
  },
  s1_the_vow: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE PROMISE",
    text: "'Aryan,' she said gently. 'One day you will not need to take the long road home.' He believed her. It felt true, like a compass.",
    art: "schoolyard",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "TWO YEARS LATER...", goto: "s2_weight_of_water" }
    ]
  },

  // CHAPTER 2: THE WEIGHT OF WATER
  s2_weight_of_water: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "TWO YEARS LATER",
    text: "Time accumulates weight on top of wounds until they become foundational. Aryan had stopped drawing. He had stopped laughing. Visibility was dangerous.",
    art: "warehouse",
    choices: [
      { text: "Find the gym on Nehru Street", goto: "s2_the_gym" }
    ]
  },
  s2_the_gym: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "THE GYM",
    text: "The gym above the tailor shop had no sign. Aryan found it by the thud of a heavy bag. He stood at the bottom of the stairs for four minutes. The sound was an invitation.",
    art: "warehouse",
    choices: [
      { text: "Go up", goto: "s2_balwant_eval" }
    ]
  },
  s2_balwant_eval: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "BALWANT",
    text: "Balwant Singh, sixty-four, moved like fifty and thought like forty. He looked at Aryan once — a comprehensive assessment.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "'Hit it until it hurts you back.'", goto: "s2_training_pain" }
    ]
  },
  s2_training_pain: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "PUNISHMENT",
    text: "Aryan hit the bag until his hands bled. 'You're not training,' Balwant warned. 'Punishment is about pain. Training is about precision.'",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Choose Precision", goto: "s2_training_focus", unlockSkill: "combat" },
      { text: "Choose Rage", goto: "s2_training_focus", raiseRage: true }
    ]
  },
  s2_training_focus: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "ABSORBING DAMAGE",
    text: "Aryan learned that pain had a shape and a duration. He found something essential: the knowledge that his body could be hit and continue functioning.",
    art: "warehouse",
    choices: [
      { text: "Continue training", goto: "s3_chapter_three" }
    ]
  },

  // CHAPTER 3: THE DAY THE STONE MOVED
  s3_chapter_three: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE WALLET",
    text: "A Thursday in March. Kabir had taken Aryan's wallet two days earlier. It contained Savita's photograph. Kabir was waiting behind the workshop shed.",
    art: "firstfight",
    choices: [
      { text: "Face Kabir by the shed", goto: "s3_workshop_trap" }
    ]
  },
  s3_workshop_trap: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE WORKSHOP SHED",
    text: "Kabir held up the photograph. 'Your mummy's kind of pretty. Maybe we pay her a visit sometime. My father knows people.'",
    art: "firstfight",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "React now!", goto: "s3_fight_start", timed: 2000 }
    ]
  },
  s3_fight_start: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE SUBSIDENCE",
    text: "The ground of compliance gave way. Aryan felt absolute, scientific clarity. He moved before he had fully decided to move.",
    art: "firstfight",
    choices: [
      { text: "[COMBAT] Strike his solar plexus", goto: "s3_kabir_down", tag: "fight", setFought: true },
      { text: "[STEALTH] Step inside the swing", goto: "s3_kabir_down", tag: "stealth", setFought: true }
    ]
  },
  s3_kabir_down: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE SHIFT",
    text: "Kabir went down. Dev hit the wall. Prashant ran. Aryan picked up the photograph. 'Stay away from my mother,' he said. His voice was very calm.",
    art: "firstfight",
    choices: [
      { text: "Take the short road home", goto: "s4_machinery" }
    ]
  },

  // CHAPTER 4: THE IRON SHADOW FRONT
  s4_machinery: {
    chapter: "CHAPTER FOUR — THE IRON SHADOW FRONT",
    title: "THE MACHINERY WAKES",
    text: "Kabir went home and spoke to his father. Durgesh Rao listened with-careful attention. 'I'll handle it,' he said. He didn't call the police. He called the ISF.",
    art: "warehouse",
    choices: [
      { text: "What is the ISF?", goto: "s4_isf_history" }
    ]
  },
  s4_isf_history: {
    chapter: "CHAPTER FOUR — THE IRON SHADOW FRONT",
    title: "THE SHADOW",
    text: "The Iron Shadow Front began as an off-book intelligence network forty years ago. It had become a monstrous enterprise. Its leader, THE DIRECTOR, expanded it to seventeen cities.",
    art: "warehouse",
    portrait: "director",
    speaker: "THE DIRECTOR",
    choices: [
      { text: "The Political Face", goto: "s4_durgesh_rao" }
    ]
  },
  s4_durgesh_rao: {
    chapter: "CHAPTER FOUR — THE IRON SHADOW FRONT",
    title: "DURGESH RAO",
    text: "Durgesh Rao had been ISF's political face in Nagpur for eleven years. He owed them his first election. Now, he wanted ISF to make Aryan's life uncomfortable. Pressure.",
    art: "warehouse",
    choices: [
      { text: "The Man with the Map", goto: "s4_balwant_past" }
    ]
  },
  s4_balwant_past: {
    chapter: "CHAPTER FOUR — THE IRON SHADOW FRONT",
    title: "THE OPERATIVE",
    text: "Balwant Singh was a former RAW operative. He had been watching ISF's growth for seven years. He had the map, but he lacked the motivation. Until he saw the line cross.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Wait for the moment", goto: "s5_open_door" }
    ]
  },

  // CHAPTER 5: THE EMPTY KITCHEN
  s5_open_door: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE OPEN DOOR",
    text: "Wednesday evening in late April. The door to the flat was open. The chain lock was broken, the clasp hanging at an angle that indicated force.",
    art: "kidnap",
    choices: [
      { text: "Enter through the gap", goto: "s5_empty_flat" }
    ]
  },
  s5_empty_flat: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "EMPTY",
    text: "Corridor. Bathroom. Her bedroom. Empty. The chai pot was on the stove, the tea reduced to thick liquid. She had been making it when they came.",
    art: "kidnap",
    choices: [
      { text: "Look at the fridge", goto: "s5_the_marker" }
    ]
  },
  s5_the_marker: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE MARKER",
    text: "On the refrigerator, scratched with a fingernail in the last seconds before being taken, were three letters: ISF. She had left him a name.",
    art: "kidnap",
    choices: [
      { text: "Call Balwant", goto: "s5_balwant_call" }
    ]
  },
  s5_balwant_call: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE RECKONING",
    text: "'They took my mother,' Aryan said. 'Come to the gym. Now,' Balwant replied. The map was already spread on the floor.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Enter the gym", goto: "s5_the_window" }
    ]
  },
  s5_the_window: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE 72-HOUR WINDOW",
    text: "'Safehouse 3. High security. She will not stay there long. After three days, if she hasn't been exchanged, the protocol changes.' Balwant's eyes warned of the stakes.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Plan the infiltration", goto: "s6_mahal_road", collectItem: "map" }
    ]
  },

  // CHAPTER 6: THE TEXTILE DISTRICT
  s6_mahal_road: {
    chapter: "CHAPTER SIX — THE TEXTILE DISTRICT",
    title: "MAHAL ROAD WAREHOUSE",
    text: "Mahal Road was anonymous. Functional. Security cameras covered the exterior with a twelve-second overlap gap. Aryan had studied it for six hours.",
    art: "warehouse",
    choices: [
      { text: "Wait for 2:07 AM", goto: "s6_the_approach" }
    ]
  },
  s6_the_approach: {
    chapter: "CHAPTER SIX — THE TEXTILE DISTRICT",
    title: "THE APPROACH",
    text: "Acoustic distraction: a motorcycle exhaust. The guard turned his head. Aryan moved through the camera gap and reached the north service entrance.",
    art: "warehouse",
    choices: [
      { text: "Pick the lock", goto: "s6_pick_lock", timed: 3000 }
    ]
  },
  s6_pick_lock: {
    chapter: "CHAPTER SIX — THE TEXTILE DISTRICT",
    title: "INTERIOR",
    text: "The lock clicked. Aryan moved along the wall. In the corridor, he encountered a worker. Sudden action was required to keep the silence.",
    art: "warehouse",
    choices: [
      { text: "[STEALTH] Subdue with pressure", goto: "s6_veer", tag: "stealth", unlockSkill: "stealth" },
      { text: "[FIGHT] Heavy strike", goto: "s6_veer", tag: "fight", raiseRage: true }
    ]
  },
  s6_veer: {
    chapter: "CHAPTER SIX — THE TEXTILE DISTRICT",
    title: "VEER CHOUDHARY",
    text: "The logistics coordinator sat in his office. 'I processed the transit order,' he stammered. 'District 7 Compound. Basement level. She was alive when they moved her.'",
    art: "warehouse",
    portrait: "prashant", // Substitute for Veer
    speaker: "VEER CHOUDHARY",
    choices: [
      { text: "The next target", goto: "s7_district_seven" }
    ]
  },

  // CHAPTER 7: DISTRICT 7
  s7_district_seven: {
    chapter: "CHAPTER SEVEN — DISTRICT 7",
    title: "THE COMPOUND",
    text: "Industrial facility. Wall with motion sensors. Aryan arrived at 11:43 PM. The 48-hour window was closing in seventeen minutes.",
    art: "final",
    choices: [
      { text: "Scale the north wall", goto: "s7_inside_compound" }
    ]
  },
  s7_inside_compound: {
    chapter: "CHAPTER SEVEN — DISTRICT 7",
    title: "INSIDE",
    text: "He moved across the yard in shadows. It was messier than the plan. A knife across the shoulder. A boot to his ribs. He hit the last man with everything he had left.",
    art: "final",
    choices: [
      { text: "Find the door", goto: "s7_basement_door" },
      { text: "Listen for her voice", goto: "s7_basement_door", unlockSkill: "intel" }
    ]
  },
  s7_basement_door: {
    chapter: "CHAPTER SEVEN — DISTRICT 7",
    title: "BASEMENT LEVEL TWO",
    text: "Concrete corridor. Four doors. The fourth was not locked. Inside, Savita was in the corner, her head resting on her arms. She raised it when he entered.",
    art: "final",
    choices: [
      { text: "Go to her", goto: "s7_reunion" }
    ]
  },
  s7_reunion: {
    chapter: "CHAPTER SEVEN — DISTRICT 7",
    title: "THE REUNION",
    text: "Her hands were cold. Her breathing was shallow. 'I'm here, I'm here,' Aryan whispered. 'I need you to listen to me,' she said, her voice the calm of a final teaching.",
    art: "final",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "The Final Words", goto: "s7_parting" }
    ]
  },
  s7_parting: {
    chapter: "CHAPTER SEVEN — DISTRICT 7",
    title: "THE PARTING",
    text: "'Whatever happens next — don't let him disappear entirely. Keep a little of him for me.' Her eyes were steady, until they weren't. The alarm began to scream.",
    art: "final",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "CHAPTER EIGHT — THE WAR", goto: "s8_shadow_ascendant", raiseRage: true }
    ]
  },

  s8_shadow_ascendant: {
    chapter: "CHAPTER EIGHT — THE WAR",
    title: "THE SHADOW ASCENDANT",
    text: "The boy who drew died in that basement. Aryan took apart ISF's infrastructure with surgical precision. Financial records leaked. Safehouses burned. Durgesh Rao fell in scandal.",
    art: "final",
    choices: [
      { text: "Target the Director", goto: "s9_director_choice" }
    ]
  },
  s9_director_choice: {
    chapter: "CHAPTER NINE — THE DIRECTOR",
    title: "THE TOP FLOOR",
    text: "The Director sat behind a steel door. 'I wanted to see you myself. You are impressive.' He handed over a flash drive. 'I am tired of the arithmetic.'",
    art: "final",
    portrait: "director",
    speaker: "THE DIRECTOR",
    choices: [
      { text: "[RESTRAIN] Take him to justice", goto: "s10_accountability", tag: "intel", collectItem: "flashDrive" },
      { text: "[ELIMINATE] End the cycle", goto: "s10_reckoning", tag: "fight", raiseRage: true }
    ]
  },
  s10_accountability: {
    chapter: "CHAPTER TEN — ACCOUNTABILITY",
    title: "JUSTICE",
    text: "Aryan restrained the Director and called the police. Justice arrived in eleven minutes. The saga of ISF ended not with a bang, but with a series of arrests and a massive trial.",
    art: "final",
    choices: [
      { text: "EPILOGUE", goto: "s_epilogue" }
    ]
  },
  s10_reckoning: {
    chapter: "CHAPTER TEN — RECKONING",
    title: "VOID",
    text: "The Director's office went silent. The shadow had done its work. The city was safer, but the silence in Aryan's room was absolute. He walked out into the rain.",
    art: "final",
    choices: [
      { text: "EPILOGUE", goto: "s_epilogue" }
    ]
  },
  s_epilogue: {
    chapter: "EPILOGUE — SHADOW RISING",
    title: "SHADOW RISING",
    text: "Aryan returned to the gym. He started drawing her again — the boy she remembered. 'There are other cities,' Balwant said. Aryan looked at the new file. 'Tell me about them.'",
    art: "schoolyard",
    choices: [
      { text: "RESTART SAGA", goto: "RESTART" }
    ]
  }
};
