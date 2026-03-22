import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyData } from '../utils/storyData';
import type { Scene, Choice } from '../utils/storyData';
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
      drawing: false,
      map: false,
      flashDrive: false,
      gear: false,
    },
    foughtBack: false,
    savedEvidence: false,
    hadAlliance: false,
    motherDead: false,
  });
  const [showOverlay, setShowOverlay] = useState<'JUSTICE' | 'VICTORY' | null>(null);
  const [flash, setFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [timedProgress, setTimedProgress] = useState(100);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const typingIntervalRef = useRef<any>(null);
  const timedIntervalRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  const scene: Scene = storyData[currentSceneKey] || storyData['s1_intro'];

  const speak = (text: string, person?: string) => {
    if (!narrationEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice profiles
    if (person === 'SAVITA SHARMA') {
      utterance.pitch = 1.2;
      utterance.rate = 0.9;
    } else if (person === 'BALWANT SINGH') {
      utterance.pitch = 0.7;
      utterance.rate = 0.85;
    } else if (person === 'KABIR RAO') {
      utterance.pitch = 1.1;
      utterance.rate = 1.1;
    } else if (person === 'THE DIRECTOR') {
      utterance.pitch = 0.5;
      utterance.rate = 0.8;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    // Typing effect
    let i = 0;
    setDisplayText('');
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    const fullText = scene.text;
    speak(fullText, scene.speaker);

    typingIntervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      }
    }, 12);

    // Timed choice logic
    if (scene.choices.some(c => c.timed)) {
      const timedChoice = scene.choices.find(c => c.timed);
      const duration = timedChoice?.timed || 3000;
      setTimedProgress(100);
      if (timedIntervalRef.current) clearInterval(timedIntervalRef.current);
      
      const start = Date.now();
      timedIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setTimedProgress(remaining);
        if (remaining <= 0) {
          clearInterval(timedIntervalRef.current);
          handleChoice(scene.choices[0]); // Auto-select first choice on timeout
        }
      }, 30);
    } else {
      if (timedIntervalRef.current) clearInterval(timedIntervalRef.current);
      setTimedProgress(100);
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (timedIntervalRef.current) clearInterval(timedIntervalRef.current);
    };
  }, [currentSceneKey, scene.text, scene.choices]);

  const handleChoice = (choice: Choice) => {
    const newState = { ...state };
    
    // Apply state changes
    if (choice.raiseRage && newState.rage < 5) {
      newState.rage++;
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }
    if (choice.lowerRage && newState.rage > 0) newState.rage--;
    if (choice.setFought) newState.foughtBack = true;
    if (choice.saveEvidence) newState.savedEvidence = true;
    if (choice.setAlliance) newState.hadAlliance = true;
    
    if (choice.unlockSkill) {
      newState.skills[choice.unlockSkill as keyof typeof newState.skills] = true;
    }

    if (choice.collectItem) {
      newState.gear[choice.collectItem as keyof typeof newState.gear] = true;
    }

    // Update path
    if (choice.tag === 'fight') newState.path = 'warrior';
    else if (choice.tag === 'intel') newState.path = 'shadow';
    else if (choice.tag === 'stealth') newState.path = 'ghost';

    setState(newState);

    if (synthRef.current) synthRef.current.cancel();

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
      gear: { drawing: false, map: false, flashDrive: false, gear: false },
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
      <svg viewBox="0 0 800 220" className="w-full h-full text-[#333]">
        <rect width="800" height="220" fill="#090909"/>
        <rect x="0" y="60" width="800" height="160" fill="#0d0d0d"/>
        <line x1="0" y1="60" x2="800" y2="60" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="50" y="80" width="60" height="80" fill="#111" stroke="currentColor"/>
        <rect x="160" y="70" width="80" height="90" fill="#111" stroke="currentColor"/>
        <rect x="600" y="75" width="100" height="85" fill="#111" stroke="currentColor"/>
        <text x="400" y="30" fontFamily="monospace" fontSize="8" fill="#1a1a1a" letterSpacing="4" textAnchor="middle">NAGPUR_SECTOR_01 // SCHOOL_DISTRICT</text>
      </svg>
    ),
    firstfight: (
      <svg viewBox="0 0 800 220" className="w-full h-full text-[#8B0000]">
        <rect width="800" height="220" fill="#060606"/>
        <circle cx="400" cy="110" r="100" fill="currentColor" opacity="0.05"/>
        <rect x="380" y="100" width="40" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2"/>
        <text x="400" y="25" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.5">ESTABLISHING_DOMINANCE</text>
      </svg>
    ),
    kidnap: (
      <svg viewBox="0 0 800 220" className="w-full h-full text-[#0a4060]">
        <rect width="800" height="220" fill="#050505"/>
        <line x1="0" y1="110" x2="800" y2="110" stroke="#111" strokeWidth="1" strokeDasharray="8 8"/>
        <circle cx="400" cy="110" r="40" fill="none" stroke="currentColor" opacity="0.2"/>
        <text x="400" y="25" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.5">SIGNAL_LOST // L_ST_07</text>
      </svg>
    ),
    warehouse: (
      <svg viewBox="0 0 800 220" className="w-full h-full text-[#222]">
        <rect width="800" height="220" fill="#080808"/>
        <path d="M0 40 L800 40" stroke="currentColor" strokeWidth="2"/>
        <path d="M0 180 L800 180" stroke="currentColor" strokeWidth="2"/>
        <text x="400" y="25" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="currentColor" opacity="0.3">ISF_INFRASTRUCTURE_NODE</text>
      </svg>
    ),
    final: (
      <svg viewBox="0 0 800 220" className="w-full h-full text-[#500]">
        <rect width="800" height="220" fill="#000"/>
        <radialGradient id="fg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.8"/>
        </radialGradient>
        <rect width="800" height="220" fill="url(#fg1)"/>
        <text x="400" y="25" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="currentColor" opacity="0.4">CRITICAL_OBJECTIVE // RECKONING</text>
      </svg>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#e8e0d5] font-['Crimson_Pro',_serif] overflow-x-hidden relative selection:bg-red-900/40 pb-20 transition-transform duration-100 ${screenShake ? 'translate-x-1 -translate-y-1 scale-[1.01]' : ''}`}>
      <TacticalHUD />
      
      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22/%3E%3C/svg%3E')] " />

      {/* Rage Vignette */}
      <div className={`fixed inset-0 pointer-events-none z-[998] transition-opacity duration-500 shadow-[inset_0_0_150px_rgba(139,0,0,${state.rage * 0.15})]`} />

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/98 z-[1000] flex flex-col items-center justify-center p-10 text-center"
          >
            <h2 className={`text-6xl md:text-8xl font-['Bebas_Neue'] tracking-[10px] mb-5 ${showOverlay === 'JUSTICE' ? 'text-gold-500' : 'text-red-700'}`}>
              {showOverlay === 'JUSTICE' ? 'JUSTICE_SERVED' : 'SHADOW_ASCENDANT'}
            </h2>
            <div className="w-48 h-[1px] bg-red-900/40 mb-8" />
            <p className="max-w-xl text-xl italic text-[#a09080] font-light leading-relaxed mb-12">
              {showOverlay === 'JUSTICE' 
                ? 'The Director is in custody. The files are public. You chose the path of the observer, and the observer saw everything.'
                : 'The machine is broken. You didn\'t just fight the shadow; you became the shadow that the original darkness feared.'
              }
            </p>
            <button
              onClick={restartGame}
              className="bg-transparent border border-red-900/40 hover:bg-red-900/20 text-[#D4AC0D] px-12 py-4 font-mono text-xs tracking-[5px] uppercase transition-all"
            >
              ↺ REINITIATE_SAGA
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1000px] mx-auto p-4 md:p-8 min-h-screen flex flex-col pt-24 animate-in fade-in duration-1000">
        
        {/* ARSENAL TAB */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="md:col-span-8 flex flex-col gap-4">
            {/* Visuals */}
            <div className="w-full h-[280px] bg-[#0d0d0d] border border-white/5 relative overflow-hidden group rounded-sm shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.art}
                  initial={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {Arts[scene.art] || Arts.schoolyard}
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-0 left-0 p-4 border-b border-r border-[#8B0000]/30 bg-black/80 font-mono text-[9px] text-[#8B0000] tracking-[4px] uppercase z-10">
                {scene.chapter}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            {/* NARRATOR CONTROL */}
            <div className="bg-[#0f0f0f] border border-white/5 p-4 rounded-sm flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] tracking-[2px] text-[#555]">AUDIO_LINK // NARRATION</span>
                <span className={`text-[10px] font-bold ${narrationEnabled ? 'text-blue-400' : 'text-gray-600'}`}>
                  {narrationEnabled ? 'SYNTHESIS_ACTIVE' : 'SYNTHESIS_OFFLINE'}
                </span>
              </div>
              <button 
                onClick={() => {
                  setNarrationEnabled(!narrationEnabled);
                  if (narrationEnabled && synthRef.current) synthRef.current.cancel();
                }}
                className={`w-10 h-6 rounded-full p-1 transition-all ${narrationEnabled ? 'bg-blue-600' : 'bg-[#222]'}`}
              >
                <motion.div 
                  animate={{ x: narrationEnabled ? 16 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {/* ARSENAL HUD */}
            <div className="bg-[#0f0f0f] border border-white/5 p-4 flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] tracking-[3px] text-[#555]">ARSENAL // GEAR</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(state.gear).map(([item, has]) => (
                  <div key={item} className={`p-2 border transition-colors flex flex-col gap-1 ${has ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-transparent opacity-30'}`}>
                    <span className="font-mono text-[8px] tracking-[1px] text-[#555]">ITEM_0{Object.keys(state.gear).indexOf(item)+1}</span>
                    <span className={`text-[10px] font-bold ${has ? 'text-emerald-400' : 'text-gray-700'}`}>{item.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-white/5">
                <span className="font-mono text-[10px] tracking-[3px] text-[#555] block mb-2">OPERATIONAL_SKILLS</span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(state.skills).map(([skill, active]) => (
                    <span key={skill} className={`text-[8px] px-2 py-1 rounded-sm border ${active ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 'text-[#333] border-white/5 opacity-50'}`}>
                      {skill.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Engine */}
        <div className="bg-[#0f0f0f] border border-white/5 min-h-[400px] flex flex-col relative overflow-hidden rounded-sm shadow-2xl">
          <div className="flex flex-col md:flex-row flex-1">
            {/* Portrait */}
            {(scene.portrait || scene.speaker) && (
              <div className="w-full md:w-[280px] border-r border-white/5 bg-[#0d0d0d] p-8 flex flex-col items-center justify-center gap-6 relative">
                <div className="w-40 h-40 border border-[#8B0000]/20 bg-black rounded-full overflow-hidden p-3 relative group">
                  <div className="absolute inset-0 bg-[#8B0000]/5 group-hover:bg-[#8B0000]/10 transition-colors" />
                  {scene.portrait && CharacterPortraits[scene.portrait]}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="text-center z-10">
                  <div className="font-mono text-[9px] text-[#8B0000] tracking-[5px] mb-2 uppercase font-black">IDENTITY_ID</div>
                  <div className="font-['Bebas_Neue'] text-3xl tracking-[3px] text-[#f5f0ea]">{scene.speaker || 'UNKNOWN'}</div>
                </div>
                <div className="absolute top-4 right-4 text-[8px] font-mono text-[#222]">LVL_7_INTEL</div>
              </div>
            )}

            {/* Story Text */}
            <div className="flex-1 p-10 md:p-14 relative flex flex-col">
              <div className="absolute left-0 top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#8B0000] via-[#8B0000]/40 to-transparent" />
              
              <motion.h2 
                key={scene.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-['Bebas_Neue'] text-5xl tracking-[6px] text-[#f5f0ea] mb-8 uppercase"
              >
                {scene.title}
              </motion.h2>

              <div className="text-xl md:text-2xl leading-[1.8] text-[#c8bfb0] font-light flex-1 italic relative min-h-[140px]">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="inline-block w-3 h-6 bg-[#8B0000] ml-2 align-middle shadow-[0_0_8px_rgb(139,0,0)]"
                />
              </div>

              {/* Timed Progress Bar */}
              {scene.choices.some(c => c.timed) && (
                <div className="mt-8 h-1 bg-[#222] w-full overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${timedProgress}%` }}
                    className="h-full bg-red-600 shadow-[0_0_10px_rgb(220,38,38)]"
                  />
                </div>
              )}

              {/* Choices */}
              <div className="mt-12 grid grid-cols-1 gap-3">
                <div className="font-mono text-[9px] tracking-[5px] text-[#333] mb-4 uppercase border-t border-white/5 pt-6 font-black">INTERACTION_PROMPT_WAITING...</div>
                {scene.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(c)}
                    className="w-full bg-transparent border border-white/10 text-[#e8e0d5] px-8 py-5 text-left font-serif text-lg cursor-pointer transition-all duration-500 group relative overflow-hidden hover:border-[#8B0000] hover:text-white hover:bg-red-950/5 shadow-sm"
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <span className="font-mono text-xs text-[#8B0000] font-black w-8 h-8 rounded-full border border-[#8B0000]/40 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-black transition-colors">
                        {String.fromCharCode(65+i)}
                      </span>
                      <span className="flex-1 transition-all group-hover:translate-x-2 tracking-wide">
                        {c.text}
                      </span>
                      {c.tag && (
                        <span className="font-mono text-[8px] text-[#555] group-hover:text-[#8B0000] border border-white/5 px-2 py-1 uppercase">{c.tag}</span>
                      )}
                    </div>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8b000010] to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical HUD Footer */}
        <div className="flex justify-between items-center mt-6 px-4 font-mono text-[10px] text-[#222] tracking-[4px] uppercase font-bold">
          <div className="flex items-center gap-4">
            <span>RAGE_INDEX: [ {state.rage} ]</span>
            <span>RESOLVE: {state.resolve}</span>
          </div>
          <div className="hidden md:block">
            ACTIVE_SAGA: {currentSceneKey.toUpperCase()} // P_ID: {state.path.toUpperCase()}
          </div>
          <div>
            NAGPUR_CORE // ENCRYPTED
          </div>
        </div>
      </div>

      {/* Choice Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[2000] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShadowRising;
