import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyData } from '../utils/storyData';
import type { Scene } from '../utils/storyData';
import { CharacterPortraits } from '../utils/characterAssets';
import TacticalHUD from '../components/TacticalHUD';

const ShadowRising: React.FC = () => {
  const [currentSceneKey, setCurrentSceneKey] = useState('s1_intro');
  const [state, setState] = useState({
    rage: 0,
    resolve: 'broken',
    path: 'shadow',
    chapter: 1,
    skills: {
      combat: false,
      stealth: false,
      intel: false,
    },
    gear: {
      map: false,
      drawing: true,
      flashDrive: false,
    },
    foughtBack: false,
    savedEvidence: false,
    hadAlliance: false,
    motherDead: false,
  });
  const [showOverlay, setShowOverlay] = useState<'JUSTICE' | 'VICTORY' | null>(null);
  const [flash, setFlash] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scene: Scene = storyData[currentSceneKey] || storyData['s1_intro'];

  useEffect(() => {
    // Typing effect
    let i = 0;
    setDisplayText('');
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    const fullText = scene.text;
    typingIntervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      }
    }, 15);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [currentSceneKey]);

  const handleChoice = (choice: any) => {
    const newState = { ...state };
    
    // Apply state changes
    if (choice.raiseRage && newState.rage < 5) newState.rage++;
    if (choice.lowerRage && newState.rage > 0) newState.rage--;
    if (choice.setFought) newState.foughtBack = true;
    if (choice.saveEvidence) newState.savedEvidence = true;
    if (choice.setAlliance) newState.hadAlliance = true;
    
    if (choice.unlockSkill) {
      newState.skills[choice.unlockSkill as keyof typeof newState.skills] = true;
    }

    // Update path
    if (choice.tag === 'fight') newState.path = 'warrior';
    else if (choice.tag === 'intel') newState.path = 'shadow';
    else if (choice.tag === 'stealth') newState.path = 'ghost';

    setState(newState);

    if (choice.goto === 'RESTART') {
      restartGame();
    } else if (choice.goto === 'END_JUSTICE') {
      setShowOverlay('JUSTICE');
    } else if (choice.goto === 'END_FIGHT') {
      setShowOverlay('VICTORY');
    } else {
      setCurrentSceneKey(choice.goto);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restartGame = () => {
    setState({
      rage: 0,
      resolve: 'broken',
      path: 'shadow',
      chapter: 1,
      skills: { combat: false, stealth: false, intel: false },
      gear: { map: false, drawing: true, flashDrive: false },
      foughtBack: false,
      savedEvidence: false,
      hadAlliance: false,
      motherDead: false,
    });
    setCurrentSceneKey('s1_intro');
    setShowOverlay(null);
  };

  const Arts: Record<string, React.ReactNode> = {
    schoolyard: (
      <svg viewBox="0 0 800 220" className="w-full h-full">
        <rect width="800" height="220" fill="#090909"/>
        <rect x="0" y="60" width="800" height="160" fill="#0d0d0d"/>
        <rect x="50" y="80" width="60" height="80" fill="#111" stroke="#1a1a1a"/>
        <rect x="160" y="70" width="80" height="90" fill="#111" stroke="#1a1a1a"/>
        <rect x="600" y="75" width="100" height="85" fill="#111" stroke="#1a1a1a"/>
        <rect x="0" y="185" width="800" height="35" fill="#0a0a0a" stroke="#151515"/>
        <ellipse cx="320" cy="190" rx="18" ry="5" fill="#050505"/>
        <line x1="320" y1="155" x2="320" y2="185" stroke="#1e1e1e" strokeWidth="2"/>
        <circle cx="320" cy="148" r="8" fill="#1e1e1e"/>
        <line x1="320" y1="162" x2="308" y2="172" stroke="#1e1e1e" strokeWidth="2"/>
        <line x1="320" y1="162" x2="332" y2="172" stroke="#1e1e1e" strokeWidth="2"/>
        <circle cx="380" cy="146" r="8" fill="#2a1414"/>
        <line x1="380" y1="154" x2="380" y2="182" stroke="#2a1414" strokeWidth="3"/>
        <circle cx="410" cy="149" r="7" fill="#2a1414"/>
        <line x1="410" y1="156" x2="410" y2="183" stroke="#2a1414" strokeWidth="3"/>
        <line x1="380" y1="163" x2="395" y2="155" stroke="#3d1515" strokeWidth="2"/>
        <text x="400" y="30" fontFamily="monospace" fontSize="10" fill="#2a0000" letterSpacing="4">EASTBROOK SECONDARY — 2009</text>
        <line x1="0" y1="55" x2="800" y2="55" stroke="#1a1a1a" strokeWidth="1"/>
      </svg>
    ),
    firstfight: (
      <svg viewBox="0 0 800 220" className="w-full h-full">
        <defs>
          <radialGradient id="rg1" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="#300000" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="220" fill="#060606"/>
        <rect width="800" height="220" fill="url(#rg1)"/>
        <rect x="0" y="0" width="120" height="220" fill="#0d0b0b"/>
        <rect x="680" y="0" width="120" height="220" fill="#0d0b0b"/>
        <line x1="0" y1="30" x2="120" y2="30" stroke="#111" strokeWidth="1"/>
        <line x1="0" y1="60" x2="120" y2="60" stroke="#111" strokeWidth="1"/>
        <line x1="680" y1="45" x2="800" y2="45" stroke="#111" strokeWidth="1"/>
        <line x1="400" y1="110" x2="140" y2="30" stroke="#1a0000" strokeWidth="1" opacity="0.5"/>
        <line x1="400" y1="110" x2="660" y2="40" stroke="#1a0000" strokeWidth="1" opacity="0.5"/>
        <line x1="400" y1="110" x2="200" y2="220" stroke="#1a0000" strokeWidth="1" opacity="0.4"/>
        <line x1="400" y1="110" x2="600" y2="220" stroke="#1a0000" strokeWidth="1" opacity="0.4"/>
        <circle cx="340" cy="100" r="10" fill="#222"/>
        <line x1="340" y1="110" x2="340" y2="148" stroke="#222" strokeWidth="3"/>
        <line x1="340" y1="120" x2="310" y2="108" stroke="#444" strokeWidth="3"/>
        <line x1="340" y1="148" x2="325" y2="175" stroke="#222" strokeWidth="3"/>
        <line x1="340" y1="148" x2="355" y2="175" stroke="#222" strokeWidth="3"/>
        <circle cx="460" cy="105" r="10" fill="#3d1212"/>
        <line x1="460" y1="115" x2="465" y2="155" stroke="#3d1212" strokeWidth="3"/>
        <line x1="462" y1="125" x2="490" y2="118" stroke="#3d1212" strokeWidth="3"/>
        <circle cx="430" cy="95" r="2" fill="#600"/>
        <circle cx="425" cy="100" r="1.5" fill="#600"/>
        <circle cx="436" cy="88" r="1" fill="#600"/>
        <text x="400" y="20" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#400000" letterSpacing="3">THE DAY HE FOUGHT BACK</text>
      </svg>
    ),
    kidnap: (
      <svg viewBox="0 0 800 220" className="w-full h-full">
        <defs>
          <radialGradient id="lamp" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#1a0800" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#000" stopOpacity="1"/>
          </radialGradient>
        </defs>
        <rect width="800" height="220" fill="#050505"/>
        <rect width="800" height="220" fill="url(#lamp)"/>
        <line x1="200" y1="0" x2="200" y2="220" stroke="#0f0f0f" strokeWidth="3"/>
        <line x1="250" y1="0" x2="250" y2="220" stroke="#0f0f0f" strokeWidth="3"/>
        <line x1="300" y1="0" x2="300" y2="220" stroke="#0f0f0f" strokeWidth="3"/>
        <line x1="350" y1="0" x2="350" y2="220" stroke="#0f0f0f" strokeWidth="3"/>
        <circle cx="580" cy="95" r="9" fill="#1a1414"/>
        <rect x="572" y="104" width="16" height="30" fill="#1a1414"/>
        <rect x="565" y="108" width="50" height="4" fill="#111" rx="2"/>
        <circle cx="660" cy="90" r="9" fill="#2a1414"/>
        <line x1="660" y1="99" x2="660" y2="138" stroke="#2a1414" strokeWidth="4"/>
        <line x1="660" y1="115" x2="640" y2="108" stroke="#2a1414" strokeWidth="3"/>
        <rect x="630" y="105" width="16" height="5" fill="#3a2020" rx="1"/>
        <rect x="100" y="80" width="70" height="50" fill="#030d12" stroke="#0a2030" rx="3"/>
        <text x="135" y="100" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#0a4060">MISSED</text>
        <text x="135" y="112" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#0a4060">CALLS: 23</text>
        <text x="400" y="25" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#3a0000" letterSpacing="3">THEY TOOK HER</text>
      </svg>
    ),
    warehouse: (
      <svg viewBox="0 0 800 220" className="w-full h-full">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080808"/>
            <stop offset="100%" stopColor="#040404"/>
          </linearGradient>
        </defs>
        <rect width="800" height="220" fill="url(#wg)"/>
        <line x1="0" y1="0" x2="0" y2="220" stroke="#111" strokeWidth="8"/>
        <line x1="160" y1="0" x2="160" y2="220" stroke="#111" strokeWidth="6"/>
        <line x1="320" y1="0" x2="320" y2="220" stroke="#111" strokeWidth="6"/>
        <line x1="480" y1="0" x2="480" y2="220" stroke="#111" strokeWidth="6"/>
        <line x1="640" y1="0" x2="640" y2="220" stroke="#111" strokeWidth="6"/>
        <line x1="800" y1="0" x2="800" y2="220" stroke="#111" strokeWidth="8"/>
        <line x1="0" y1="40" x2="800" y2="40" stroke="#111" strokeWidth="4"/>
        <rect x="50" y="155" width="50" height="40" fill="#0d0d0d" stroke="#161616"/>
        <rect x="110" y="165" width="40" height="30" fill="#0d0d0d" stroke="#161616"/>
        <rect x="650" y="150" width="55" height="45" fill="#0d0d0d" stroke="#161616"/>
        <rect x="715" y="162" width="40" height="33" fill="#0d0d0d" stroke="#161616"/>
        <circle cx="400" cy="125" r="10" fill="#1a1a1a"/>
        <line x1="400" y1="135" x2="400" y2="175" stroke="#1a1a1a" strokeWidth="3"/>
        <polygon points="380,40 420,40 440,160 360,160" fill="#ffffff" opacity="0.015"/>
        <text x="400" y="22" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#1a0000" letterSpacing="3">NEMESIS COMPOUND — LEVEL B2</text>
      </svg>
    ),
    final: (
      <svg viewBox="0 0 800 220" className="w-full h-full">
        <defs>
          <radialGradient id="fg" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#1a0400"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>
        </defs>
        <rect width="800" height="220" fill="#000"/>
        <rect width="800" height="220" fill="url(#fg)"/>
        <line x1="300" y1="0" x2="260" y2="220" stroke="#300" strokeWidth="2" opacity="0.4"/>
        <line x1="400" y1="0" x2="380" y2="220" stroke="#400" strokeWidth="3" opacity="0.5"/>
        <line x1="500" y1="0" x2="540" y2="220" stroke="#300" strokeWidth="2" opacity="0.4"/>
        <line x1="200" y1="0" x2="150" y2="220" stroke="#200" strokeWidth="1" opacity="0.3"/>
        <line x1="600" y1="0" x2="650" y2="220" stroke="#200" strokeWidth="1" opacity="0.3"/>
        <rect x="340" y="60" width="120" height="100" fill="#0d0505" stroke="#200"/>
        <circle cx="400" cy="80" r="12" fill="#2a0505"/>
        <line x1="400" y1="92" x2="400" y2="135" stroke="#2a0505" strokeWidth="5"/>
        <line x1="400" y1="105" x2="370" y2="95" stroke="#2a0505" strokeWidth="4"/>
        <line x1="400" y1="105" x2="430" y2="95" stroke="#2a0505" strokeWidth="4"/>
        <circle cx="200" cy="95" r="10" fill="#333"/>
        <line x1="200" y1="105" x2="200" y2="148" stroke="#333" strokeWidth="3"/>
        <line x1="200" y1="118" x2="175" y2="108" stroke="#555" strokeWidth="3"/>
        <circle cx="400" cy="200" r="15" fill="none" stroke="#300" strokeWidth="2" opacity="0.6"/>
        <line x1="388" y1="188" x2="412" y2="212" stroke="#600" strokeWidth="2" opacity="0.7"/>
        <text x="400" y="22" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#500000" letterSpacing="3">NEMESIS HQ — THE FINAL RECKONING</text>
      </svg>
    )
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e0d5] font-['Crimson_Pro',_serif] overflow-x-hidden relative selection:bg-red-900/40">
      <TacticalHUD />
      
      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22/%3E%3C/svg%3E')] " />

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-10 text-center"
          >
            <h2 className={`text-6xl md:text-8xl font-['Bebas_Neue'] tracking-[6px] mb-5 ${showOverlay === 'JUSTICE' ? 'text-[#D4AC0D]' : 'text-[#C0392B]'}`}>
              {showOverlay === 'JUSTICE' ? 'JUSTICE ACHIEVED' : 'SHADOW RISEN'}
            </h2>
            <p className="max-w-xl text-xl italic text-[#a09080] leading-relaxed mb-8">
              {showOverlay === 'JUSTICE' 
                ? 'Through patience, intelligence, and quiet devastation — you dismantled twelve years of organized crime and freed over a hundred trapped lives. Your mother is safe. The Director is caged. The world is marginally less dark.'
                : 'Through fire, blood, and an eighteen-year-old\'s unbending will — you walked into the heart of the world\'s most dangerous criminal network and walked out the other side. The shadows know your name now.'
              }
            </p>
            <button
              onClick={restartGame}
              className="bg-[#8B0000] hover:bg-[#C0392B] text-white px-9 py-3.5 font-mono text-sm tracking-[3px] uppercase transition-colors"
            >
              ↺ TRY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[860px] mx-auto p-5 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-10 border-b border-[#2a2a2a] mb-0 pt-24">
          <div className="font-mono text-[11px] tracking-[4px] text-[#a09080] uppercase mb-2.5">An Interactive Revenge Saga</div>
          <h1 className="font-['Bebas_Neue'] text-6xl md:text-8xl italic tracking-[6px] text-[#f5f0ea] leading-[0.9] relative inline-block">
            SHADOW RISING
            <span className="absolute top-[3px] left-[3px] text-[#8B0000] -z-10">SHADOW RISING</span>
          </h1>
          <div className="italic text-lg text-[#a09080] mt-2">When silence breaks, the world burns.</div>
        </header>

        {/* Stats */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-[#111] border border-[#222] font-mono text-[11px] text-[#a09080] tracking-[2px] flex-wrap gap-2">
          <div className="flex items-center gap-1.5"><span className="text-[#555]">CHAPTER</span><span className="text-[#D4AC0D]">{scene.chapter.split(' — ')[0]}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-[#555]">RESOLVE</span><span className="text-[#D4AC0D]">{state.resolve.toUpperCase()}</span></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#555]">RAGE</span>
            <div className="flex gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 border border-[#333] transition-all duration-300 ${i <= state.rage ? 'bg-[#C0392B] border-[#8B0000] shadow-[0_0_4px_#8B0000]' : 'bg-[#111]'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5"><span className="text-[#555]">PATH</span><span className="text-[#D4AC0D]">{state.path.toUpperCase()}</span></div>
        </div>

        {/* Chapter Title */}
        <div className="text-center py-4 text-[11px] font-mono tracking-[4px] text-[#8B0000] uppercase min-h-[36px]">
          {scene.chapter}
        </div>

        {/* Visuals */}
        <div className="w-full h-[220px] bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.art}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              {Arts[scene.art] || Arts.schoolyard}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Story Box */}
        <div 
          className={`bg-[#0f0f0f] border border-[#1e1e1e] border-t-0 p-8 md:px-9 flex-1 relative transition-all duration-600 ${flash ? 'shadow-[inset_0_0_60px_rgba(139,0,0,0.4)]' : ''}`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#8B0000] to-transparent" />
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-[3px] text-[#f5f0ea] mb-4 uppercase">{scene.title}</h2>
          <div 
            className="text-lg leading-[1.85] text-[#c8bfb0] font-light min-h-[100px] story-content"
            dangerouslySetInnerHTML={{ __html: scene.text }}
          />
        </div>

        {/* Choices */}
        <div className="p-5 md:px-9 pb-8 bg-[#0f0f0f] border border-[#1e1e1e] border-t-[#181818]">
          <div className="font-mono text-[10px] tracking-[3px] text-[#333] mb-3.5 uppercase">— WHAT DO YOU DO —</div>
          <div className="space-y-2">
            {scene.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => handleChoice(c)}
                className="w-full bg-transparent border border-[#252525] text-[#e8e0d5] px-5 py-3.5 text-left font-serif text-lg cursor-pointer transition-all duration-200 group relative overflow-hidden hover:border-[#8B0000] hover:text-white hover:pl-7"
              >
                <span className="font-mono text-[10px] text-[#8B0000] tracking-[1px] mr-2.5 uppercase font-bold">[{String.fromCharCode(65+i)}]</span>
                {c.text.replace(/^\[.*?\]\s*/,'')}
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b00001a] via-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="font-mono text-[10px] text-[#333] tracking-[2px] py-1.5 px-4 text-right bg-[#080808]">
          SCENE: {currentSceneKey.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default ShadowRising;
