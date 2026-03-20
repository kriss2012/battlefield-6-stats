import React, { useState, useRef, Suspense } from 'react';
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
import TacticalHUD from '../components/TacticalHUD';
import * as THREE from 'three';

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
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [ammo, setAmmo] = useState(30);

  const handleHit = () => {
    setScore(s => s + 100);
  };

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo(a => a - 1);
      // Play sound or muzzle flash logic here
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
      <div className="fixed inset-0 bg-black cursor-crosshair" onClick={handleShoot}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
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

            {/* Simulation Targets */}
            {isStarted && Array.from({ length: 5 }).map((_, i) => (
              <Target 
                key={i} 
                position={[(i - 2) * 5, 2, -10]} 
                onHit={handleHit} 
              />
            ))}

            <Player />
            <PointerLockControls />
            <Environment preset="night" />
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
          </div>
        </div>

        {/* Simulation UI */}
        <div className="absolute top-24 left-10 space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Score</span>
            <span className="text-4xl font-black italic text-white leading-none">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Ammo</span>
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
              <h2 className="text-4xl font-black italic uppercase mb-4 tracking-tighter">Neural <span className="text-blue-500">Forge</span></h2>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                Welcome to Balwant's training module. Objective: Neutralize all ISF thermal signatures with maximum precision. Punishment is for pain; training is for results. Movement: WASD. Aim: Mouse. Shoot: Click.
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStarted(true);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
              >
                START SIMULATION
              </button>
            </motion.div>
          </div>
        )}

        {ammo === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 px-8 py-3 bg-red-600 text-white font-black italic uppercase tracking-widest rounded-full animate-bounce"
          >
            LOW AMMO - RELOAD REQUIRED
          </motion.div>
        )}
      </div>
    </KeyboardControls>
  );
};

export default Simulation;
