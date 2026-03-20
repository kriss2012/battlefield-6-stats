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
}

export interface Scene {
  chapter: string;
  title: string;
  text: string;
  art: string;
  portrait?: string;
  speaker?: string;
  choices: Choice[];
}

export const storyData: Record<string, Scene> = {
  // CHAPTER 1: THE BOY WHO DISAPPEARED
  s1_intro: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "NAGPUR, 2009",
    text: "The city of Nagpur woke up every morning in the same way it always had — with the smell of chai and diesel, the sound of auto-rickshaws, and the slow grinding noise of a million people beginning their days. Aryan Sharma was sixteen years old, and he had been disappearing for two years.",
    art: "schoolyard",
    choices: [
      { text: "Continue through the school gates", goto: "s1_st_xavier" }
    ]
  },
  s1_st_xavier: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "ST. XAVIER'S SENIOR SECONDARY",
    text: "Aryan walked the corridors like a ghost. His teachers marked him present. His classmates registered his existence the way you register a piece of furniture — it's there; you work around it, you don't actually see it. The disappearing was interior. The slow erasure of a self under sustained pressure.",
    art: "schoolyard",
    choices: [
      { text: "Head to the classroom", goto: "s1_kabir_intro" }
    ]
  },
  s1_kabir_intro: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE PREDATOR",
    text: "Kabir Rao was seventeen, broad-shouldered, and possessed of the particular kind of confidence that grows in a boy who has never been told no. His father, Durgesh Rao, was an MLA. Kabir had absorbed his father's power like a second inheritance. He had chosen Aryan in the second semester of eighth grade.",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Avoid eye contact", goto: "s1_library" },
      { text: "Take the side entrance", goto: "s1_library" }
    ]
  },
  s1_library: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "THE LIBRARY PASSAGE",
    text: "Kabir and his associates, Dev and Prashant, were waiting. 'Look at this. The ghost is trying a new path,' Kabir sneered. He took Aryan's bag, held it upside down, and shook it. Books, a lunch box, and a folded drawing fell. The drawing was of Aryan's mother, laughing. Kabir tore it in half.",
    art: "schoolyard",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Pick up the pieces quietly", goto: "s1_home", lowerRage: true },
      { text: "Clench your fists and walk away", goto: "s1_home", raiseRage: true }
    ]
  },
  s1_home: {
    chapter: "CHAPTER ONE — THE BOY WHO DISAPPEARED",
    title: "LAXMI NAGAR ROAD",
    text: "Home was a two-bedroom flat on the third floor. His mother, Savita, was teaching third grade at Sunrise Primary. She had been raising Aryan alone since he was seven. She looked at him over chai, sensing the stillness in him. 'He tore the drawing,' Aryan said. 'One day,' she replied gently, 'you will not need to take the long road home.'",
    art: "schoolyard",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "Two years later...", goto: "s2_gym_discovery" }
    ]
  },

  // CHAPTER 2: THE WEIGHT OF WATER
  s2_gym_discovery: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "NEHRU STREET",
    text: "Two years of Kabir's systematic attention had made the harassment a geography Aryan navigated with practiced caution. In October of his sixteenth year, he found a gym above a tailor shop. He heard the rhythmic thud of someone working a bag and couldn't walk away. He went up.",
    art: "warehouse",
    choices: [
      { text: "Enter the gym", goto: "s2_balwant_intro" }
    ]
  },
  s2_balwant_intro: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "THE OLD SOLDIER",
    text: "Balwant Singh, sixty-four, moved like fifty and thought like forty. He had cauliflower ears and hands of a craftsman. He looked at Aryan once. 'Hit it until it hurts you back,' he said, pointing at a heavy bag.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Hit the bag until your hands bleed", goto: "s2_training", raiseRage: true },
      { text: "Focus on the technique he shows you", goto: "s2_training", unlockSkill: "combat" }
    ]
  },
  s2_training: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "THE MAKING OF A WEAPON",
    text: "Over the months, Aryan trained with the intensity of someone converting unspeakable rage into something physical. Balwant taught him footwork, spatial awareness, and the geometry of a room. 'You're not training,' Balwant warned. 'You're punishing yourself. Punishment makes you rawer. Training makes you sharper.'",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Learn to be sharp", goto: "s2_map_handover", unlockSkill: "intel" },
      { text: "Embrace the raw power", goto: "s2_map_handover", raiseRage: true }
    ]
  },
  s2_map_handover: {
    chapter: "CHAPTER TWO — THE WEIGHT OF WATER",
    title: "THE GIFT",
    text: "One evening, Balwant handed him a folded piece of paper. 'From a friend,' he said. 'In case you ever need to find someone.' It was a detailed map of Nagpur, with ISF operations marked in red. Aryan folded it and put it in his bag, not asking any questions.",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "CHAPTER THREE", goto: "s3_wallet_theft" }
    ]
  },

  // CHAPTER 3: THE DAY THE STONE MOVED
  s3_wallet_theft: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "ST. XAVIER'S WORKSHOP SHED",
    text: "A Thursday in March. Kabir had taken Aryan's wallet two days earlier. He held it up now, producing a photograph of Savita. 'I've been carrying this for two days,' Kabir mocked. 'Your mummy's kind of pretty, you know? Maybe we pay her a visit sometime. Tell her how her son is doing.'",
    art: "firstfight",
    portrait: "kabir",
    speaker: "KABIR RAO",
    choices: [
      { text: "Wait for the moment", goto: "s3_confrontation" }
    ]
  },
  s3_confrontation: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE SUBSIDENCE",
    text: "The ground of careful compliance simply gave way. Aryan felt an absolute, almost scientific clarity. He moved before Kabir could react. Two years of Balwant's training produced the movement without conscious direction.",
    art: "firstfight",
    choices: [
      { text: "[COMBAT] Strike Kabir's solar plexus", goto: "s3_victory", tag: "fight", setFought: true },
      { text: "[STEALTH] Use Dev's momentum against the wall", goto: "s3_victory", tag: "stealth", setFought: true }
    ]
  },
  s3_victory: {
    chapter: "CHAPTER THREE — THE DAY THE STONE MOVED",
    title: "THE SHIFT",
    text: "Kabir folded. Dev went down. Prashant ran. Aryan picked up the photograph of his mother and put it back in his wallet. 'Stay away from me,' he said, his voice terrifyingly calm. 'Stay away from my mother.' He walked out the side gate and took the short road home.",
    art: "firstfight",
    choices: [
      { text: "The machinery wakes...", goto: "s4_isf_intro" }
    ]
  },
  // To be continued...
  s4_isf_intro: {
    chapter: "CHAPTER FOUR — THE IRON SHADOW FRONT",
    title: "THE DIRECTOR'S REACH",
    text: "The Iron Shadow Front (ISF) was the largest criminal organization in central India. Durgesh Rao, Kabir's father, called them to handle the humiliation. They didn't plan a direct hit. They planned pressure. But they didn't know what the silence of Aryan Sharma was made of.",
    art: "warehouse",
    choices: [
      { text: "[CONTINUE TO CHAPTER 5]", goto: "s5_empty_kitchen" }
    ]
  },
  s5_empty_kitchen: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE BROKEN CHAIN",
    text: "A Wednesday evening in April. The door to the flat was open. The chain lock was broken. The chai pot was still warm on the stove. His mother was gone. On the refrigerator, Aryan found three letters scratched into the paint: 'ISF'. She had left him a name.",
    art: "kidnap",
    choices: [
      { text: "Call Balwant", goto: "s5_balwant_call" }
    ]
  },
  s5_balwant_call: {
    chapter: "CHAPTER FIVE — THE EMPTY KITCHEN",
    title: "THE GATHERING",
    text: "Balwant had the map spread out. 'They'll have taken her to Safehouse 3 in the textile district,' he said. 'She won't stay there long. Three days. After that, the protocol changes. We need to move.'",
    art: "warehouse",
    portrait: "balwant",
    speaker: "BALWANT SINGH",
    choices: [
      { text: "Enter the Textile District", goto: "s6_warehouse_infil" }
    ]
  },
  s6_warehouse_infil: {
    chapter: "CHAPTER SIX — THE TEXTILE DISTRICT",
    title: "SAFEHOUSE 3",
    text: "Aryan went in at two in the morning. Using an acoustic distraction from Balwant, he bypassed the cameras and entered the service door. He confronted Veer Choudhary, the logistics coordinator. 'Safehouse 7,' Veer whispered. 'District 7. Basement level.'",
    art: "warehouse",
    portrait: "aryan_shadow",
    choices: [
      { text: "Head to District 7", goto: "s7_district7" }
    ]
  },
  s7_district7: {
    chapter: "CHAPTER SEVEN — FORTY-SEVEN HOURS",
    title: "THE FORTY-SEVENTH HOUR",
    text: "The basement of the District 7 compound. Concrete, industrial lighting, the smell of water. He found her in the fourth room. She was sitting against the wall, her hands cold. 'Aryan,' she whispered. 'You were always exactly enough. Remember that.'",
    art: "final",
    portrait: "savita",
    speaker: "SAVITA SHARMA",
    choices: [
      { text: "Witness the end", goto: "s7_mother_death" }
    ]
  },
  s7_mother_death: {
    chapter: "CHAPTER SEVEN — FORTY-SEVEN HOURS",
    title: "THE RECKONING BEGINS",
    text: "She died in the corridor, holding his arm. Aryan carried her out. He sat in the kitchen until morning. Then he stood up. Then he began. 'Every single one of you,' he whispered to the silence.",
    art: "final",
    choices: [
      { text: "Take down ISF", goto: "s8_reckoning" }
    ]
  },
  s8_reckoning: {
    chapter: "CHAPTER EIGHT — THE RECKONING",
    title: "THE LONG ARITHMETIC",
    text: "For four months, Aryan dismantled ISF piece by piece. Logistics, money laundering, safehouses. He worked with Balwant, Priya, and an honest inspector named Suresh. He was hurt, but he kept going. He visited the cemetery every week with marigolds.",
    art: "final",
    choices: [
      { text: "Target: Durgesh Rao", goto: "s9_durgesh_fall" },
      { text: "Target: Commander Hasan", goto: "s9_hasan_fight" }
    ]
  },
  s9_durgesh_fall: {
    chapter: "CHAPTER NINE — THE LAST THREE",
    title: "THE FALL OF THE MLA",
    text: "Aryan leaked a file of eleven years of ISF connections to Arif Khan. The stories broke simultaneously. Durgesh Rao resigned and was arrested. Kabir was sent away to Pune. One down.",
    art: "warehouse",
    choices: [
      { text: "Next: Commander Hasan", goto: "s9_hasan_fight" }
    ]
  },
  s9_hasan_fight: {
    chapter: "CHAPTER NINE — THE LAST THREE",
    title: "COMMANDER HASAN",
    text: "A confrontation at a villa in the hills. The fight lasted eleven minutes. Hasan was professional, but Aryan refused to be beaten. 'I'm trying to destroy what you are,' Aryan said as Hasan fell. Two down.",
    art: "final",
    choices: [
      { text: "Force the Director out", goto: "s10_director_meeting" }
    ]
  },
  s10_director_meeting: {
    chapter: "CHAPTER TEN — THE MAN WHO BUILT THE MACHINE",
    title: "THE TOP FLOOR",
    text: "The Director was old, impeccably dressed. He didn't resist. He handed Aryan a flash drive. 'I am tired of the arithmetic,' he said. 'What happened to your mother was not acceptable. I am finished.'",
    art: "final",
    portrait: "director",
    speaker: "THE DIRECTOR",
    choices: [
      { text: "Restrain him and call the Inspector", goto: "s_epilogue" }
    ]
  },
  s_epilogue: {
    chapter: "EPILOGUE — THE SHORT ROAD HOME",
    title: "SHADOW RISING",
    text: "ISF collapsed. Three hundred arrests across seventeen cities. Aryan found a new room, two kilometers away. He went back to the gym. He started drawing again. 'Tell me about the other cities,' he told Balwant one evening. The Shadow was just beginning.",
    art: "schoolyard",
    choices: [
      { text: "THE END", goto: "RESTART" }
    ]
  }
};
