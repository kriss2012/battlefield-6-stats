import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PointerLockControls, 
  Sky, 
  Stars, 
  Environment, 
  PerspectiveCamera,
  useKeyboardControls,
  KeyboardControls,
  Plane
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import TacticalHUD from '../components/TacticalHUD';
import * as THREE from 'three';
import { missions } from '../utils/missionData';

// --- First-Person Weapon ---
const Weapon: React.FC<{ isFiring: boolean }> = ({ isFiring }) => {
  const meshRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const { mouse } = state;
    // Weapon sway
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0.5 + -mouse.x * 0.1, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -0.4 + mouse.y * 0.1, 0.1);
    if (isFiring) {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -0.7, 0.5);
    } else {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -0.8, 0.1);
    }
  });

  return (
    <group ref={meshRef} position={[0.5, -0.4, -0.8]}>
      {/* Muzzle Flash */}
      {isFiring && (
        <pointLight position={[0, 0.05, -1]} intensity={5} color="#fbbf24" distance={5} />
      )}
      {/* Gun Body */}
      <mesh rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.05, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0} />
      </mesh>
      {/* Scope */}
      <mesh position={[0, 0.12, -0.1]} castShadow>
        <boxGeometry args={[0.04, 0.06, 0.3]} />
        <meshStandardMaterial color="#444" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// --- Guard AI Component ---
const Guard: React.FC<{ 
  position: [number, number, number]; 
  waypoints: [number, number, number][];
  onDetect: () => void;
  onHit: () => void;
}> = ({ position, waypoints, onDetect, onHit }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const [targetIdx, setTargetIdx] = useState(0);
  const [hit, setHit] = useState(false);
  const detectionRef = useRef(0);

  useFrame((state, delta) => {
    if (hit) {
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      return;
    }

    // Patrolling logic
    const target = new THREE.Vector3(...waypoints[targetIdx]);
    const dir = target.clone().sub(meshRef.current.position).normalize();
    if (meshRef.current.position.distanceTo(target) < 0.5) {
      setTargetIdx((targetIdx + 1) % waypoints.length);
    } else {
      meshRef.current.position.add(dir.multiplyScalar(delta * 2));
      meshRef.current.lookAt(target);
    }

    // Detection logic
    const playerPos = state.camera.position;
    const dist = meshRef.current.position.distanceTo(playerPos);
    if (dist < 15) {
      const guardToPlayer = playerPos.clone().sub(meshRef.current.position).normalize();
      const guardForward = new THREE.Vector3(0, 0, 1).applyQuaternion(meshRef.current.quaternion);
      const angle = guardForward.angleTo(guardToPlayer);
      
      if (angle < Math.PI / 4) { // 45 degree vision cone
        detectionRef.current += delta * 2;
        if (detectionRef.current >= 1) onDetect();
      } else {
        detectionRef.current = Math.max(0, detectionRef.current - delta);
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={(e) => { e.stopPropagation(); setHit(true); onHit(); }}
    >
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1.2, 8, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Vision Cone (Visual helper) */}
      <mesh position={[0, 1.8, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 3, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

// --- Industrial Assets ---
const Warehouse: React.FC = () => {
  return (
    <group>
      {/* Perimeter Walls */}
      <mesh position={[0, 10, -50]}>
        <boxGeometry args={[100, 20, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[50, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[100, 20, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[-50, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[100, 20, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Structural Pillars */}
      {[-40, -20, 0, 20, 40].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x, 10, -25]}>
            <boxGeometry args={[2, 20, 2]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[x, 10, 25]}>
            <boxGeometry args={[2, 20, 2]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Shipping Containers / Crates */}
      <mesh position={[-15, 2, -15]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[4, 4, 8]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[15, 2, -20]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[4, 4, 8]} />
        <meshStandardMaterial color="#7f1d1d" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1, -5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#444" roughness={1} />
      </mesh>
    </group>
  );
};

// --- Target Component ---
const Target: React.FC<{ position: [number, number, number]; onHit: () => void }> = ({ position, onHit }) => {
  const [hit, setHit] = useState(false);
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (hit) {
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      if (meshRef.current.scale.x < 0.01) {
        setHit(false);
        onHit();
        meshRef.current.scale.set(1, 1, 1);
        meshRef.current.position.set(
          (Math.random() - 0.5) * 20,
          0,
          (Math.random() - 0.5) * 20
        );
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setHit(true);
      }}
    >
      {/* Humanoid Silhouette */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial 
          color={hit ? "#ef4444" : "#1e293b"} 
          emissive={hit ? "#ef4444" : "#3b82f6"} 
          emissiveIntensity={hit ? 5 : 0.5} 
        />
      </mesh>
      {/* Tactical Glow Core */}
      <mesh position={[0, 1.7, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

// --- Player Character (Camera Logic) ---
const Player: React.FC = () => {
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((state) => {
    const { forward, backward, left, right } = getKeys();
    
    // Movement logic
    direction.current.set(
      Number(right) - Number(left),
      0,
      Number(backward) - Number(forward)
    ).normalize();

    if (forward || backward) velocity.current.z -= direction.current.z * 0.1;
    if (left || right) velocity.current.x -= direction.current.x * 0.1;

    state.camera.translateX(-velocity.current.x);
    state.camera.translateZ(-velocity.current.z);

    velocity.current.multiplyScalar(0.9); // Friction
  });

  return null;
};

const Simulation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const missionId = queryParams.get('missionId');
  const mission = missions.find(m => m.id === missionId);

  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [ammo, setAmmo] = useState(30);
  const [missionComplete, setMissionComplete] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [showHitMarker, setShowHitMarker] = useState(false);
  const controlsRef = useRef<any>(null);

  // Auto-lock controls when simulation starts
  useEffect(() => {
    if (isStarted && controlsRef.current) {
      controlsRef.current.lock();
    }
  }, [isStarted]);

  const handleHit = () => {
    setScore(s => s + 100);
    setShowHitMarker(true);
    setTimeout(() => setShowHitMarker(false), 150);
    if (mission && score + 100 >= 500) {
      setMissionComplete(true);
    }
  };

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo(a => a - 1);
      setIsFiring(true);
      setTimeout(() => setIsFiring(false), 50);
    }
  };

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
        { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
        { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
        { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <div className="fixed inset-0 bg-black cursor-crosshair" onMouseDown={() => {
        if (isStarted && !missionComplete) handleShoot();
      }}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
          <fog attach="fog" args={["#000", 10, 50]} />
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            
            {/* Ground */}
            <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <meshStandardMaterial color="#171717" roughness={0.8} metalness={0.2} />
            </Plane>

            {/* Grid Helper for Tactical Look */}
            <gridHelper args={[100, 50, "#3b82f6", "#1f2937"]} position={[0, 0.01, 0]} />

            {/* Simulation Guards */}
            {isStarted && mission?.id === 'm0' && (
              <>
                <Guard 
                  position={[-10, 0, -20]} 
                  waypoints={[[-10, 0, -20], [10, 0, -20]]} 
                  onHit={handleHit}
                  onDetect={() => setIsAlarmActive(true)}
                />
                <Guard 
                  position={[15, 0, -30]} 
                  waypoints={[[15, 0, -30], [15, 0, -10]]} 
                  onHit={handleHit}
                  onDetect={() => setIsAlarmActive(true)}
                />
              </>
            )}

            {isStarted && !mission && Array.from({ length: 5 }).map((_, i) => (
              <Target 
                key={i} 
                position={[(i - 2) * 5, 2, -10]} 
                onHit={handleHit} 
              />
            ))}

            <Player />
            <Weapon isFiring={isFiring} />
            <PointerLockControls ref={controlsRef} />
            <Environment preset="night" />
            <Warehouse />
            
            {/* Cinematic Spotlights */}
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} castShadow color="#3b82f6" />
            <spotLight position={[-30, 15, -30]} angle={0.5} penumbra={1} intensity={1} color="#ef4444" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <TacticalHUD />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Crosshair */}
          <div className="relative">
            <div className="w-8 h-[2px] bg-blue-400 absolute left-1/2 -translate-x-1/2" />
            <div className="h-8 w-[2px] bg-blue-400 absolute top-1/2 -translate-y-1/2" />
            <div className="w-1 h-1 bg-red-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            {/* Hit Marker */}
            {showHitMarker && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-8 h-8 relative">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* STEALTH HUD */}
        <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
          <div className="flex gap-1 items-center">
            <span className="text-xs font-mono text-gray-500 uppercase">Detection Level</span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isAlarmActive ? '100%' : '0%' }}
                className={`h-full ${isAlarmActive ? 'bg-red-500' : 'bg-blue-400'}`}
              />
            </div>
          </div>
          {isAlarmActive && (
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-xs font-black italic text-red-500 uppercase tracking-widest"
            >
              ALARM STATUS: COMPROMISED
            </motion.span>
          )}
        </div>

        {/* Simulation UI */}
        <div className="absolute top-24 left-10 space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Score</span>
            <span className="text-4xl font-black italic text-white leading-none">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Ammo</span>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black italic text-white leading-none">{ammo}</span>
              <span className="text-xs text-gray-500 font-mono mb-1">/ 30</span>
            </div>
          </div>
        </div>

        {!isStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-[60]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-12 text-center max-w-md"
            >
              <h2 className="text-4xl font-black italic uppercase mb-4 tracking-tighter">
                {mission ? mission.title : "Neural Forge"}
              </h2>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                {mission ? mission.briefing.text : "Welcome to Balwant's training module. Objective: Neutralize all ISF thermal signatures with maximum precision. Punishment is for pain; training is for results. Movement: WASD. Aim: Mouse. Shoot: Click."}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStarted(true);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
              >
                {mission ? "INITIALIZE MISSION" : "START SIMULATION"}
              </button>
            </motion.div>
          </div>
        )}

        {missionComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-[70] p-10 text-center"
          >
            <h3 className="text-6xl font-black italic text-emerald-500 uppercase mb-4">Mission Success</h3>
            <p className="text-gray-400 mb-8 max-w-sm">Objective achieved. Intelligence recovered. Tactical state synchronized with HQ.</p>
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  try {
                    await fetch('/api/game/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: 'guest_user', // Fallback for demo
                        currentScene: 's8_shadow_ascendant',
                        rage: 50,
                        resolve: 50,
                        skills: ['combat'],
                        itemIds: ['map']
                      })
                    });
                    navigate('/campaign');
                  } catch (e) {
                    navigate('/campaign');
                  }
                }}
                className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                SAVE & EXIT
              </button>
              <button 
                onClick={() => navigate('/campaign')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                DISCARD
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </KeyboardControls>
  );
};

export default Simulation;
