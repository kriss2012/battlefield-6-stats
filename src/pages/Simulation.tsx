/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PointerLockControls, 
  Sky, 
  Stars, 
  PerspectiveCamera,
  useKeyboardControls,
  KeyboardControls,
  Plane,
  Environment
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { missions } from '../utils/missionData';
import { BACKEND_URL } from '../services/api';
import { audio } from '../utils/audio';
import CharacterModel from '../components/CharacterModel';
import OrangeRobot from '../components/OrangeRobot';
import AsianTemple from '../components/AsianTemple';
import VintageComputer from '../components/VintageComputer';

// --- Level Themes Config ---
interface LevelConfig {
  gridColor: string;
  skyColor: string;
  ambientIntensity: number;
  spotlightColor: string;
  wallColor: string;
  floorColor: string;
  fogColor: string;
  ambientPreset: 'night' | 'studio' | 'warehouse';
}

const getLevelConfig = (missionId: string | null): LevelConfig => {
  switch (missionId) {
    case 'm0': // The Workshop Shed
      return {
        gridColor: '#eab308',
        skyColor: '#0c0802',
        ambientIntensity: 0.3,
        spotlightColor: '#f59e0b',
        wallColor: '#27272a',
        floorColor: '#18181b',
        fogColor: '#0c0802',
        ambientPreset: 'studio',
      };
    case 'm1': // The Textile District
      return {
        gridColor: '#3b82f6',
        skyColor: '#020617',
        ambientIntensity: 0.15,
        spotlightColor: '#3b82f6',
        wallColor: '#1e293b',
        floorColor: '#0f172a',
        fogColor: '#020617',
        ambientPreset: 'warehouse',
      };
    case 'm2': // The Forty-Seventh Hour
      return {
        gridColor: '#ef4444',
        skyColor: '#0a0002',
        ambientIntensity: 0.35,
        spotlightColor: '#ef4444',
        wallColor: '#4c0519',
        floorColor: '#1c0005',
        fogColor: '#0a0002',
        ambientPreset: 'night',
      };
    case 'm3': // The Hillside Villa
      return {
        gridColor: '#a855f7',
        skyColor: '#0b001a',
        ambientIntensity: 0.25,
        spotlightColor: '#a855f7',
        wallColor: '#311042',
        floorColor: '#12001a',
        fogColor: '#0b001a',
        ambientPreset: 'night',
      };
    default: // Training / Neural Forge
      return {
        gridColor: '#00f3ff',
        skyColor: '#050a1f',
        ambientIntensity: 0.3,
        spotlightColor: '#00f3ff',
        wallColor: '#1e293b',
        floorColor: '#0a0f1c',
        fogColor: '#050a1f',
        ambientPreset: 'night',
      };
  }
};

// const getTargetScore = (missionId: string | null): number => {
//   switch (missionId) {
//     case 'm0': return 300;
//     case 'm1': return 500;
//     case 'm2': return 800;
//     case 'm3': return 1200;
//     default: return 99999;
//   }
// };

// --- Enemy State Interface ---
interface EnemyState {
  id: string;
  name: string;
  type: 'enemy' | 'boss';
  position: [number, number, number];
  waypoints: [number, number, number][];
  health: number;
}

const getInitialEnemies = (missionId: string | null): EnemyState[] => {
  switch (missionId) {
    case 'm0':
      return [
        { id: 'dev', name: 'DEV', type: 'enemy', position: [-10, 0, -18], waypoints: [[-10, 0, -18], [5, 0, -18]], health: 100 },
        { id: 'prashant', name: 'PRASHANT', type: 'enemy', position: [12, 0, -28], waypoints: [[12, 0, -28], [12, 0, -12]], health: 100 },
        { id: 'kabir_boss', name: 'KABIR RAO', type: 'boss', position: [0, 0, -42], waypoints: [[0, 0, -42], [5, 0, -38], [-5, 0, -40]], health: 250 },
      ];
    case 'm1':
      return [
        { id: 'sentry_a', name: 'SENTRY ALPHA', type: 'enemy', position: [-16, 0, -12], waypoints: [[-16, 0, -12], [-16, 0, -32]], health: 100 },
        { id: 'sentry_b', name: 'SENTRY BETA', type: 'enemy', position: [16, 0, -15], waypoints: [[16, 0, -15], [16, 0, -35]], health: 100 },
        { id: 'sentry_c', name: 'SENTRY GAMMA', type: 'enemy', position: [0, 0, -22], waypoints: [[0, 0, -22], [10, 0, -22]], health: 100 },
        { id: 'veer_boss', name: 'VEER CHOUDHARY', type: 'boss', position: [0, 0, -38], waypoints: [[0, 0, -38], [-8, 0, -35]], health: 300 },
      ];
    case 'm2':
      return [
        { id: 'elite_a', name: 'ELITE VANGUARD A', type: 'enemy', position: [-12, 0, -10], waypoints: [[-12, 0, -10], [-5, 0, -20]], health: 120 },
        { id: 'elite_b', name: 'ELITE VANGUARD B', type: 'enemy', position: [12, 0, -15], waypoints: [[12, 0, -15], [5, 0, -25]], health: 120 },
        { id: 'elite_c', name: 'ELITE HACKER', type: 'enemy', position: [-25, 0, -28], waypoints: [[-25, 0, -28], [-15, 0, -28]], health: 100 },
        { id: 'elite_d', name: 'ELITE HEAVY', type: 'enemy', position: [25, 0, -30], waypoints: [[25, 0, -30], [15, 0, -30]], health: 150 },
        { id: 'compound_boss', name: 'GARRISON COMMANDER', type: 'boss', position: [0, 0, -45], waypoints: [[0, 0, -45], [5, 0, -40]], health: 450 },
      ];
    case 'm3':
      return [
        { id: 'commando_a', name: 'COMMANDO ALPHA', type: 'enemy', position: [-18, 0, -15], waypoints: [[-18, 0, -15], [-18, 0, -35]], health: 150 },
        { id: 'commando_b', name: 'COMMANDO BETA', type: 'enemy', position: [18, 0, -15], waypoints: [[18, 0, -15], [18, 0, -35]], health: 150 },
        { id: 'commando_c', name: 'ESTATE GUARD A', type: 'enemy', position: [-5, 0, -25], waypoints: [[-5, 0, -25], [10, 0, -25]], health: 120 },
        { id: 'commando_d', name: 'ESTATE GUARD B', type: 'enemy', position: [5, 0, -30], waypoints: [[5, 0, -30], [-10, 0, -30]], health: 120 },
        { id: 'commando_e', name: 'ESTATE SNIPER', type: 'enemy', position: [0, 0, -10], waypoints: [[0, 0, -10], [5, 0, -8]], health: 100 },
        { id: 'hasan_boss', name: 'COMMANDER HASAN', type: 'boss', position: [0, 0, -46], waypoints: [[0, 0, -46], [8, 0, -42], [-8, 0, -42]], health: 600 },
      ];
    default:
      return [];
  }
};

// --- Boundary Collisions Check ---
const checkCollision = (pos: THREE.Vector3) => {
  pos.x = THREE.MathUtils.clamp(pos.x, -49, 49);
  pos.z = THREE.MathUtils.clamp(pos.z, -49, 49);
  
  // Outer containers
  if (pos.x > -18 && pos.x < -12 && pos.z > -20 && pos.z < -10) {
    if (Math.abs(pos.x - -15) > Math.abs(pos.z - -15)) {
      pos.x = pos.x > -15 ? -12 : -18;
    } else {
      pos.z = pos.z > -15 ? -10 : -20;
    }
  }
  if (pos.x > 12 && pos.x < 18 && pos.z > -25 && pos.z < -15) {
    if (Math.abs(pos.x - 15) > Math.abs(pos.z - -20)) {
      pos.x = pos.x > 15 ? 18 : 12;
    } else {
      pos.z = pos.z > -20 ? -15 : -25;
    }
  }
  if (pos.x > -1.5 && pos.x < 1.5 && pos.z > -6.5 && pos.z < -3.5) {
    if (Math.abs(pos.x) > Math.abs(pos.z - -5)) {
      pos.x = pos.x > 0 ? 1.5 : -1.5;
    } else {
      pos.z = pos.z > -5 ? -3.5 : -6.5;
    }
  }
};

// --- First-Person Weapon ---
const Weapon: React.FC<{ isFiring: boolean; isAiming: boolean }> = ({ isFiring, isAiming }) => {
  const meshRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const { mouse } = state;
    // Weapon sway & aim down sights positioning
    
    // Target positions
    const targetX = isAiming ? 0 : 0.45;
    const targetY = isAiming ? -0.13 : -0.35;
    const targetZ = isAiming ? -0.4 : -0.75;
    
    // Target rotation (recoil kick)
    const targetRotX = isFiring ? 0.15 : 0;
    
    // Apply sway only if not aiming
    const swayX = isAiming ? 0 : -mouse.x * 0.08;
    const swayY = isAiming ? 0 : mouse.y * 0.08;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX + swayX, 0.15);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY + swayY, 0.15);
    
    if (isFiring) {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ + 0.1, 0.5); // kick back
    } else {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.15);
    }
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.2);
  });

  return (
    <group ref={meshRef} position={[0.45, -0.35, -0.75]}>
      {/* Muzzle Flash Pointlight */}
      {isFiring && (
        <pointLight position={[0, 0.05, -0.8]} intensity={6} color="#f59e0b" distance={6} />
      )}
      
      {/* Gun Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.14, 0.5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Grip */}
      <mesh castShadow position={[0, -0.12, 0.15]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.8} />
      </mesh>
      
      {/* Magazine */}
      <mesh castShadow position={[0, -0.12, -0.05]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.05, 0.18, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      
      {/* Long barrel */}
      <mesh position={[0, 0.03, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.6, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Muzzle Brake */}
      <mesh position={[0, 0.03, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={1} />
      </mesh>

      {/* Hologram Scope / Red Dot */}
      <group position={[0, 0.11, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.04, 0.06, 0.1]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Scope Glass / Dot */}
        <mesh position={[0, 0.01, -0.051]}>
          <planeGeometry args={[0.015, 0.015]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};



// --- Glowing Tracer Mesh (Advanced Ballistic Simulation) ---
const BulletTracer: React.FC<{ start: THREE.Vector3; direction: THREE.Vector3; color?: string }> = ({ start, direction, color = '#ef4444' }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = useRef(start.clone());
  const vel = useRef(direction.clone().multiplyScalar(95.0)); // 95 m/s speed
  const gravity = -3.5; // bullet drops over distance
  const life = useRef(0.6); // destroy after 0.6 seconds

  useFrame((_, delta) => {
    if (life.current <= 0) return;
    life.current -= delta;
    
    const mesh = meshRef.current;
    if (mesh) {
      // Apply gravity to bullet path (parabolic calculation)
      vel.current.y += gravity * delta;
      pos.current.addScaledVector(vel.current, delta);
      mesh.position.copy(pos.current);
      
      // Align cylinder with travel direction
      const dir = vel.current.clone().normalize();
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      mesh.quaternion.copy(quaternion);
    }
  });

  return (
    <mesh ref={meshRef} position={start.clone()}>
      <cylinderGeometry args={[0.012, 0.012, 0.8, 4]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

// --- Newtonian Shell Casing Ejection Simulator ---
const ShellCasing: React.FC<{ startPos: THREE.Vector3; startVel: THREE.Vector3 }> = ({ startPos, startVel }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const vel = useRef(startVel.clone());
  const rot = useRef(new THREE.Vector3(Math.random() * 5 + 2, Math.random() * 5 + 2, Math.random() * 5 + 2));
  const gravity = -9.81;
  const bounceCoefficient = 0.55;
  const life = useRef(2.0); // 2 seconds lifetime

  useFrame((_, delta) => {
    if (life.current <= 0) return;
    life.current -= delta;
    
    const mesh = meshRef.current;
    if (mesh) {
      // Apply gravity
      vel.current.y += gravity * delta;
      
      // Update position
      mesh.position.addScaledVector(vel.current, delta);
      
      // Rotate casing
      mesh.rotation.x += rot.current.x * delta;
      mesh.rotation.y += rot.current.y * delta;
      mesh.rotation.z += rot.current.z * delta;
      
      // Floor bounce collision
      if (mesh.position.y < 0.02) {
        mesh.position.y = 0.02;
        vel.current.y = -vel.current.y * bounceCoefficient; // bounce up
        vel.current.x *= 0.6; // friction
        vel.current.z *= 0.6; // friction
        rot.current.multiplyScalar(0.5); // slow down rotation
      }
    }
  });

  return (
    <mesh ref={meshRef} position={startPos.clone()} castShadow>
      <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
      <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.15} />
    </mesh>
  );
};

// --- Spark / Blood Particle Kinematics ---
const ImpactParticle: React.FC<{ startPos: THREE.Vector3; color: string }> = ({ startPos, color }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  // Random velocity in a dome pointing upwards/outwards
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * (Math.PI / 3.0); // 60 degree dome
  const speed = 2.0 + Math.random() * 4.0;
  const vel = useRef(new THREE.Vector3(
    Math.cos(theta) * Math.sin(phi) * speed,
    Math.cos(phi) * speed + 1.0, // extra vertical push
    Math.sin(theta) * Math.sin(phi) * speed
  ));
  
  const gravity = -9.81;
  const life = useRef(0.6 + Math.random() * 0.4); // ~0.8s life

  useFrame((_, delta) => {
    if (life.current <= 0) return;
    life.current -= delta;
    
    const mesh = meshRef.current;
    if (mesh) {
      vel.current.y += gravity * delta;
      mesh.position.addScaledVector(vel.current, delta);
      // Fade out scale
      const scale = Math.max(0, life.current);
      mesh.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={startPos.clone()}>
      <boxGeometry args={[0.04, 0.04, 0.04]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};


// --- Guard AI Component ---
const Guard: React.FC<{ 
  id: string;
  name: string;
  type: 'enemy' | 'boss';
  position: [number, number, number]; 
  waypoints: [number, number, number][];
  health: number;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  isAlarmActive: boolean;
  onDetect: () => void;
  onHit: () => void;
  onShootPlayer: (start: THREE.Vector3, end: THREE.Vector3) => void;
}> = ({ id: _id, name: _name, type, position, waypoints, health, playerPosRef, isAlarmActive, onDetect, onHit, onShootPlayer }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const [targetIdx, setTargetIdx] = useState(0);
  const [isShooting, setIsShooting] = useState(false);
  const detectionRef = useRef(0);
  const lastShotTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (health <= 0) {
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -1, 0.1);
      return;
    }

    const playerPos = playerPosRef.current;
    const dist = meshRef.current.position.distanceTo(playerPos);
    
    // Core detection vision cone
    let playerDetected = false;
    if (dist < 40) {
      const guardToPlayer = playerPos.clone().sub(meshRef.current.position).normalize();
      const guardForward = new THREE.Vector3(0, 0, 1).applyQuaternion(meshRef.current.quaternion);
      const angle = guardForward.angleTo(guardToPlayer);
      
      if (angle < Math.PI / 2) { // ~90 degree vision cone
        detectionRef.current += delta * 3.0;
        if (detectionRef.current >= 0.5) {
          playerDetected = true;
          onDetect();
        }
      } else {
        detectionRef.current = Math.max(0, detectionRef.current - delta * 0.8);
      }
    }

    // Shoots back if alarm active or detected
    if ((isAlarmActive || playerDetected) && dist < 40) {
      // Turn directly towards player
      meshRef.current.lookAt(playerPos.x, meshRef.current.position.y, playerPos.z);
      
      const now = state.clock.getElapsedTime();
      if (now - lastShotTimeRef.current > 1.3) {
        lastShotTimeRef.current = now;
        setIsShooting(true);
        setTimeout(() => setIsShooting(false), 80);
        
        // Weapon coordinates offset
        const gunMuzzle = meshRef.current.position.clone().add(new THREE.Vector3(0.3, 0.7, 0.4).applyQuaternion(meshRef.current.quaternion));
        const playerChest = playerPos.clone().add(new THREE.Vector3(0, 1.1, 0));
        
        onShootPlayer(gunMuzzle, playerChest);
      }
    } else {
      // Patrolling waypoint paths
      if (waypoints.length > 0) {
        const target = new THREE.Vector3(...waypoints[targetIdx]);
        const dir = target.clone().sub(meshRef.current.position).normalize();
        if (meshRef.current.position.distanceTo(target) < 0.6) {
          setTargetIdx((targetIdx + 1) % waypoints.length);
        } else {
          meshRef.current.position.add(dir.multiplyScalar(delta * 1.8));
          meshRef.current.lookAt(target.x, meshRef.current.position.y, target.z);
        }
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={(e) => { e.stopPropagation(); onHit(); }}
    >
      {/* 3D Humanoid Soldier Model */}
      <group rotation={[0, Math.PI, 0]}>
        <CharacterModel 
          color={type === 'boss' ? '#991b1b' : '#374151'} 
          type={type} 
          isMoving={health > 0 && waypoints.length > 0 && !isShooting} 
          isFiring={isShooting} 
          scale={type === 'boss' ? 1.25 : 0.95} 
        />
      </group>

      {/* Red Alert / Danger Search Ring */}
      {health > 0 && (
        <mesh position={[0, 0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.9, 3.2, 16]} />
          <meshBasicMaterial 
            color={isAlarmActive ? "#ef4444" : "#f59e0b"} 
            transparent 
            opacity={isAlarmActive ? 0.06 : 0.02} 
          />
        </mesh>
      )}
    </group>
  );
};

const RadarDish: React.FC = () => {
  const dishRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (dishRef.current) {
      dishRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={dishRef}>
      {/* Dish */}
      <mesh rotation={[Math.PI / 3.5, 0, 0]} castShadow>
        <cylinderGeometry args={[1.5, 0.2, 0.35, 16, 1, true]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Center Subreflector Feed */}
      <mesh position={[0, 0.6, 0.2]} rotation={[Math.PI / 3.5, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

const ScanlineWave: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Moves vertical sweep between y = 0.05 and y = 7.5
      meshRef.current.position.y = 3.8 + Math.sin(t * 1.3) * 3.7;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#00f3ff" transparent opacity={0.045} side={THREE.DoubleSide} />
    </mesh>
  );
};

// --- Industrial Warehouse Layout ---
const Warehouse: React.FC = () => {
  return (
    <group>
      {/* Fullscreen Holographic Grid Scanner Wave */}
      <ScanlineWave />

      {/* Structural boundary walls */}
      <mesh position={[0, 10, -50]} castShadow receiveShadow>
        <boxGeometry args={[100, 20, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[50, 10, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[100, 20, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[-50, 10, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[100, 20, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Pillars */}
      {[-35, -15, 15, 35].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x, 10, -25]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 20, 2.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Glowing Telemetry Screen on Pillars */}
          <mesh position={[x, 12, -23.7]}>
            <planeGeometry args={[1.3, 1.9]} />
            <meshBasicMaterial color="#00f3ff" transparent opacity={0.65} toneMapped={false} />
          </mesh>

          <mesh position={[x, 10, 25]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 20, 2.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Blue Solar Power Generator (Left) */}
      <group position={[-16, 1.5, -16]} rotation={[0, 0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.5, 3, 7.5]} />
          <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Indicator Strip */}
        <mesh position={[0, 0.5, 3.8]}>
          <boxGeometry args={[3.2, 0.15, 0.1]} />
          <meshBasicMaterial color="#00f3ff" toneMapped={false} />
        </mesh>
        {/* Tilted Solar Grid Panel Array on top */}
        <group position={[0, 1.6, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.0, 0.12, 6.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Subdivided Solar Cells Grid */}
          <gridHelper args={[6, 6, "#60a5fa", "#3b82f6"]} position={[0, 0.08, 0]} />
        </group>
      </group>

      {/* Red Radar Power Generator (Right) */}
      <group position={[16, 1.5, -21]} rotation={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.5, 3, 7.5]} />
          <meshStandardMaterial color="#991b1b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Alert Strip */}
        <mesh position={[0, 0.5, 3.8]}>
          <boxGeometry args={[3.2, 0.15, 0.1]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>
        {/* Spinning Radar Dish Mount */}
        <group position={[0, 1.5, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 1.2, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <group position={[0, 1.2, 0]}>
            <RadarDish />
          </group>
        </group>
      </group>

      {/* Center Tactical Obstacle Box */}
      <mesh position={[0, 1, -5]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Additional Tactical Obstacles */}
      <mesh position={[-10, 1, 10]} castShadow receiveShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.4} />
      </mesh>
      <mesh position={[12, 1.5, 5]} castShadow receiveShadow rotation={[0, -0.4, 0]}>
        <boxGeometry args={[2, 3, 2.5]} />
        <meshStandardMaterial color="#475569" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Background Troopers Standing at Attention (Squads) */}
      {/* Left Row */}
      {[-32, -37, -42].map((z, idx) => (
        <group key={`trooper-l-${idx}`} position={[-38, 0, z]} rotation={[0, Math.PI / 2.3, 0]}>
          <CharacterModel color="#1e3e62" type="player" isMoving={false} isFiring={false} scale={0.92} costume="Heavy Combat Suit" />
        </group>
      ))}
      {/* Right Row */}
      {[-32, -37, -42].map((z, idx) => (
        <group key={`trooper-r-${idx}`} position={[38, 0, z]} rotation={[0, -Math.PI / 2.3, 0]}>
          <CharacterModel color="#1e3e62" type="player" isMoving={false} isFiring={false} scale={0.92} costume="Heavy Combat Suit" />
        </group>
      ))}

      {/* Decorative Assets */}
      <OrangeRobot position={[-25, 0.8, -10]} rotation={[0, 0.5, 0]} scale={1.5} />
      <AsianTemple position={[25, 0, -10]} rotation={[0, -0.5, 0]} scale={0.8} />
      <VintageComputer position={[0, 0, -10]} rotation={[0, Math.PI, 0]} scale={1.2} />
    </group>
  );
};

// --- Target Dummy (Training Mode) ---
const Target: React.FC<{ position: [number, number, number]; onHit: (pos: THREE.Vector3) => void }> = ({ position, onHit }) => {
  const [hit, setHit] = useState(false);
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (hit) {
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 15);
      if (meshRef.current.scale.x < 0.05) {
        setHit(false);
        onHit(meshRef.current.position.clone().add(new THREE.Vector3(0, 1.1, 0)));
        meshRef.current.scale.set(1, 1, 1);
        meshRef.current.position.set(
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 30
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
      {/* Humanoid 3D silhouette */}
      <group position={[0, 0, 0]}>
        <CharacterModel 
          color={hit ? "#ef4444" : "#1e293b"} 
          type="enemy" 
          isMoving={false} 
          isFiring={false} 
          scale={0.8} 
        />
      </group>
      {/* Hologram Floating health node */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={hit ? "#ef4444" : "#00f3ff"} />
      </mesh>
    </group>
  );
};

// --- Player Camera & Movement Controller ---
interface PlayerProps {
  cameraMode: 'first-person' | 'third-person';
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  isMovingRef: React.MutableRefObject<boolean>;
  isSprintingRef: React.MutableRefObject<boolean>;
  shakeRef: React.MutableRefObject<number>;
  touchMovementRef: React.MutableRefObject<{ forward: boolean; backward: boolean; left: boolean; right: boolean }>;
}

const Player: React.FC<PlayerProps> = ({ cameraMode, playerPosRef, isMovingRef, isSprintingRef, shakeRef, touchMovementRef }) => {
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const yVelocity = useRef(0.0);
  const gravity = -19.5;
  const groundY = 0.0;

  useFrame((state, delta) => {
    // get jump & sprint key from mapping
    const { forward, backward, left, right, jump, sprint } = getKeys() as any;
    
    // Camera forward projected horizontally
    const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion);
    camForward.y = 0;
    camForward.normalize();
    
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(state.camera.quaternion);
    camRight.y = 0;
    camRight.normalize();

    // Map keyboard inputs + touch thumbstick
    direction.current.set(0, 0, 0);
    if (forward || touchMovementRef.current.forward) direction.current.add(camForward);
    if (backward || touchMovementRef.current.backward) direction.current.sub(camForward);
    if (left || touchMovementRef.current.left) direction.current.sub(camRight);
    if (right || touchMovementRef.current.right) direction.current.add(camRight);

    const isMoving = direction.current.lengthSq() > 0;
    isMovingRef.current = isMoving;
    isSprintingRef.current = isMoving && sprint;

    if (isMoving) {
      direction.current.normalize();
      const speedMult = sprint ? 55 : 30; // Sprint multiplier
      velocity.current.addScaledVector(direction.current, delta * speedMult);
    }

    // Velocity decay friction (X & Z)
    velocity.current.multiplyScalar(0.8);

    // Apply horizontal velocity translation
    playerPosRef.current.addScaledVector(velocity.current, delta);

    // --- Jump and Gravity Physics (Kinematics) ---
    const onGround = playerPosRef.current.y <= groundY;
    if (onGround) {
      playerPosRef.current.y = groundY;
      yVelocity.current = 0;
      if (jump) {
        yVelocity.current = 7.8; // Initial vertical velocity impulse
        audio.playClickSound(); // Play feedback sound
      }
    } else {
      // Euler integration of gravity acceleration
      yVelocity.current += gravity * delta;
    }
    
    playerPosRef.current.y += yVelocity.current * delta;

    if (playerPosRef.current.y < groundY) {
      playerPosRef.current.y = groundY;
      yVelocity.current = 0;
    }
    
    // Clamp to map boundaries
    checkCollision(playerPosRef.current);

    // Set camera coordinates (with head height offset)
    const headHeight = 1.6;
    if (cameraMode === 'first-person') {
      state.camera.position.copy(playerPosRef.current).add(new THREE.Vector3(0, headHeight, 0));
    } else {
      // 3rd Person: Offset 3.5m back along look vector, 1.8m up
      state.camera.position.copy(playerPosRef.current)
        .addScaledVector(camForward, -3.4)
        .add(new THREE.Vector3(0, 1.8, 0));
    }

    // Apply damage or recoil screen shakes
    if (shakeRef.current > 0.002) {
      shakeRef.current = THREE.MathUtils.lerp(shakeRef.current, 0, delta * 12);
      const s = shakeRef.current;
      state.camera.position.x += (Math.random() - 0.5) * s;
      state.camera.position.y += (Math.random() - 0.5) * s;
      state.camera.position.z += (Math.random() - 0.5) * s;
    }
  });

  return null;
};

// --- Player 3D Mesh (visible in 3rd Person) ---
interface PlayerModelMeshProps {
  cameraMode: 'first-person' | 'third-person';
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  isMovingRef: React.MutableRefObject<boolean>;
  isSprintingRef: React.MutableRefObject<boolean>;
  isFiring: boolean;
  color: string;
}

const PlayerCharacterModelMesh: React.FC<PlayerModelMeshProps> = ({ cameraMode, playerPosRef, isMovingRef, isSprintingRef, isFiring, color }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const lastPos = useRef(new THREE.Vector3());
  const tiltX = useRef(0);
  const tiltZ = useRef(0);

  useFrame((state, delta) => {
    const currentPos = playerPosRef.current;
    
    // Calculate speed velocity vector
    const velocityVec = currentPos.clone().sub(lastPos.current).divideScalar(delta || 0.016);
    lastPos.current.copy(currentPos);
    
    // Prevent huge jumps
    if (velocityVec.length() > 25) velocityVec.setLength(25);
    
    groupRef.current.position.copy(currentPos);
    
    // Rotate character mesh to align with camera forward look
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion);
    forward.y = 0;
    forward.normalize();
    
    const angle = Math.atan2(forward.x, forward.z);
    groupRef.current.rotation.y = angle;

    // Transform velocity to character local space to calculate lean (Euler Math)
    const charQuat = groupRef.current.quaternion.clone();
    const localVel = velocityVec.clone().applyQuaternion(charQuat.invert());
    
    // Lean formulas: pitch (X) for forward/backward speed, roll (Z) for strafe side speed
    const targetTiltX = -localVel.z * 0.055;
    const targetTiltZ = -localVel.x * 0.055;
    
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, targetTiltX, delta * 9);
    tiltZ.current = THREE.MathUtils.lerp(tiltZ.current, targetTiltZ, delta * 9);
    
    // Apply tilt to first child group of CharacterModel
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].rotation.x = tiltX.current;
      groupRef.current.children[0].rotation.z = tiltZ.current;
    }
  });

  if (cameraMode === 'first-person') return null;

  return (
    <group ref={groupRef}>
      <CharacterModel color={color} type="player" isMoving={isMovingRef.current} isSprinting={isSprintingRef.current} isFiring={isFiring} scale={0.95} />
    </group>
  );
};

// === MAIN SIMULATION MODULE ===
const SimulationContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const missionId = queryParams.get('missionId');
  const mission = missions.find(m => m.id === missionId);

  // Gameplay variables
  const [, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [ammo, setAmmo] = useState(999);
  const [health, setHealth] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  
  // Animation states
  const [isFiring, setIsFiring] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [showHitMarker, setShowHitMarker] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [cameraMode, setCameraMode] = useState<'first-person' | 'third-person'>('first-person');

  // Input states (touch screens)
  const [isLocked, setIsLocked] = useState(false);
  const [isAiming, setIsAiming] = useState(false);
  const [sensitivity, setSensitivity] = useState(() => parseFloat(localStorage.getItem('mouse_sensitivity') || '1.0'));
  // const [joystickActive, setJoystickActive] = useState(false);
  // const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  // Persist mouse sensitivity
  useEffect(() => {
    localStorage.setItem('mouse_sensitivity', sensitivity.toString());
  }, [sensitivity]);



  // Refs for canvas-loop communications
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 5));
  const isMovingRef = useRef(false);
  const isSprintingRef = useRef(false);
  const shakeRef = useRef(0);
  const controlsRef = useRef<any>(null);
  
  // Mobile touch references
  // const joystickStartRef = useRef<{ x: number; y: number } | null>(null);
  // const lastLookTouchRef = useRef<{ x: number; y: number } | null>(null);
  const touchMovementRef = useRef({ forward: false, backward: false, left: false, right: false });
  // const touchLookRef = useRef({ yaw: 0, pitch: 0 });

  // Custom targets configuration
  const [enemies, setEnemies] = useState<EnemyState[]>([]);
  const [tracers, setTracers] = useState<{ id: number; start: THREE.Vector3; direction: THREE.Vector3; color?: string }[]>([]);
  const [spawnedCasings, setSpawnedCasings] = useState<{ id: number; pos: THREE.Vector3; vel: THREE.Vector3 }[]>([]);
  const [particles, setParticles] = useState<{ id: number; pos: THREE.Vector3; color: string }[]>([]);

  // const _targetScore = getTargetScore(missionId);
  const levelTheme = getLevelConfig(missionId);
  const themeColor = levelTheme.gridColor;

  // Pointer lock status detection
  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, []);

  // Sync background music loops
  useEffect(() => {
    if (isStarted && !isDead && !missionComplete) {
      audio.startBackgroundMusic();
    } else {
      audio.stopBackgroundMusic();
    }
    return () => {
      audio.stopBackgroundMusic();
    };
  }, [isStarted, isDead, missionComplete]);

  // Restart / Deploy setup
  const handleStart = () => {
    setIsStarted(true);
    setEnemies(getInitialEnemies(missionId));
    setHealth(100);
    setIsDead(false);
    setScore(0);
    setAmmo(999);
    setIsAlarmActive(false);
    setMissionComplete(false);
    playerPosRef.current.set(0, 0, 5);
    
    if (controlsRef.current) {
      controlsRef.current.lock();
    }
  };

  // Check mission status
  useEffect(() => {
    if (isStarted && enemies.length > 0 && enemies.every(e => e.health <= 0) && !missionComplete) {
      setMissionComplete(true);
      audio.stopBackgroundMusic();
      if (controlsRef.current) {
        controlsRef.current.unlock();
      }
    }
  }, [enemies, isStarted, missionComplete]);

  // Process player weapon firing (Newtonian Ballistics & Ejections)
  const handleShoot = () => {
    if (!isDead && isStarted && !missionComplete) {
      if (ammo <= 0) return;
      setAmmo(a => a - 1);
      setIsFiring(true);
      setTimeout(() => setIsFiring(false), 60);
      audio.playShootSound();
      shakeRef.current = 0.09; // Screen recoil

      // Spawn bullet tracer from weapon into world
      let camera;
      if (controlsRef.current && controlsRef.current.getObject) {
        camera = controlsRef.current.getObject();
      }
      
      const start = camera ? camera.position.clone() : playerPosRef.current.clone().add(new THREE.Vector3(0, 1.5, 0));
      const direction = camera 
        ? new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
        : new THREE.Vector3(0, 0, -1);
      
      // Spawn golden shell casing ejecting right-upwards from gun ejector port
      const casingId = Math.random();
      const cameraQuat = camera ? camera.quaternion : new THREE.Quaternion();
      const ejectPos = start.clone().add(new THREE.Vector3(0.22, -0.2, -0.3).applyQuaternion(cameraQuat));
      const ejectVel = new THREE.Vector3(1.6 + Math.random() * 0.8, 1.8 + Math.random() * 1.0, -0.5 + Math.random() * 0.4).applyQuaternion(cameraQuat);
      setSpawnedCasings(c => [...c, { id: casingId, pos: ejectPos, vel: ejectVel }]);
      setTimeout(() => {
        setSpawnedCasings(c => c.filter(x => x.id !== casingId));
      }, 2100);

      // Add temporary dynamic bullet tracer line
      const tracerId = Math.random();
      setTracers(t => [...t, { id: tracerId, start, direction, color: '#00f3ff' }]);
      setTimeout(() => {
        setTracers(t => t.filter(x => x.id !== tracerId));
      }, 800);
    }
  };

  // Process hit marks on targets (Blood Particle Splashes)
  const handleHitEnemy = (id: string, type: 'enemy' | 'boss') => {
    if (isDead || !isStarted) return;
    
    let hitPosition = new THREE.Vector3();
    setEnemies(prev => prev.map(enemy => {
      if (enemy.id === id) {
        hitPosition.set(...enemy.position).add(new THREE.Vector3(0, 1.1, 0));
        const nextH = Math.max(0, enemy.health - 50);
        if (nextH <= 0) {
          audio.playExplosionSound();
          setScore(s => s + (type === 'boss' ? 500 : 100));
        } else {
          audio.playHitSound();
        }
        return { ...enemy, health: nextH };
      }
      return enemy;
    }));

    // Kinematic Blood Splashes (Hemispherical Velocity Dome)
    const bloodParticles: any[] = [];
    for (let i = 0; i < 12; i++) {
      bloodParticles.push({ id: Math.random(), pos: hitPosition.clone(), color: '#ef4444' });
    }
    setParticles(p => [...p, ...bloodParticles]);
    setTimeout(() => {
      const ids = bloodParticles.map(bp => bp.id);
      setParticles(p => p.filter(x => !ids.includes(x.id)));
    }, 1100);

    setShowHitMarker(true);
    setTimeout(() => setShowHitMarker(false), 140);
  };

  // Neural Forge target hit (Glowing Metal Spark Sparks)
  const handleHitDummy = (pos: THREE.Vector3) => {
    if (isDead) return;
    setScore(s => s + 100);
    audio.playHitSound();

    // Kinematic Sparks (Hemispherical Gold Dome)
    const sparkParticles: any[] = [];
    for (let i = 0; i < 10; i++) {
      sparkParticles.push({ id: Math.random(), pos: pos.clone(), color: '#eab308' });
    }
    setParticles(p => [...p, ...sparkParticles]);
    setTimeout(() => {
      const ids = sparkParticles.map(sp => sp.id);
      setParticles(p => p.filter(x => !ids.includes(x.id)));
    }, 1100);

    setShowHitMarker(true);
    setTimeout(() => setShowHitMarker(false), 140);
  };

  // Process guard returning fire to player (Direct Tracer and Player Blood Splatter)
  const handleShootPlayer = (start: THREE.Vector3, end: THREE.Vector3) => {
    if (isDead || !isStarted || missionComplete) return;

    // Bullet tracer
    const direction = end.clone().sub(start).normalize();
    const tracerId = Math.random();
    setTracers(t => [...t, { id: tracerId, start, direction, color: '#ef4444' }]);
    setTimeout(() => {
      setTracers(t => t.filter(x => x.id !== tracerId));
    }, 800);

    // Inflict damage
    setHealth(h => {
      const nextH = Math.max(0, h - 12);
      if (nextH <= 0) {
        setIsDead(true);
        audio.playExplosionSound();
        if (controlsRef.current) controlsRef.current.unlock();
      } else {
        audio.playHitSound();
      }
      return nextH;
    });

    // Spawn player blood splatter
    const playerChest = playerPosRef.current.clone().add(new THREE.Vector3(0, 1.1, 0));
    const playerBlood: any[] = [];
    for (let i = 0; i < 10; i++) {
      playerBlood.push({ id: Math.random(), pos: playerChest, color: '#ef4444' });
    }
    setParticles(p => [...p, ...playerBlood]);
    setTimeout(() => {
      const ids = playerBlood.map(pb => pb.id);
      setParticles(p => p.filter(x => !ids.includes(x.id)));
    }, 1100);

    // Screen flash & camera shake
    setHitFlash(true);
    setTimeout(() => setHitFlash(false), 120);
    shakeRef.current = 0.35;
  };

  // Keyboard controls key toggle binding
  const [sub] = useKeyboardControls();
  useEffect(() => {
    return sub(
      (state) => (state as any).toggleCamera,
      (pressed) => {
        if (pressed && isStarted && !isDead && !missionComplete) {
          setCameraMode(m => m === 'first-person' ? 'third-person' : 'first-person');
          audio.playClickSound();
        }
      }
    );
  }, [sub, isStarted, isDead, missionComplete]);

  // Touch look input listeners
  // const TouchLookController: React.FC = () => {
  //   useFrame((state) => {
  //     if (touchLookRef.current.yaw !== 0 || touchLookRef.current.pitch !== 0) {
  //       state.camera.rotation.y += touchLookRef.current.yaw;
  //       state.camera.rotation.x += touchLookRef.current.pitch;
  //       state.camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, state.camera.rotation.x));
  //       
  //       touchLookRef.current.yaw = 0;
  //       touchLookRef.current.pitch = 0;
  //     }
  //   });
  //   return null;
  // };

  return (
      <div 
        className="fixed inset-0 bg-black overflow-hidden select-none" 
        onMouseDown={(e) => {
          if (!isStarted || isDead || missionComplete || !isLocked) return;
          if (e.button === 0) handleShoot();
          else if (e.button === 2) setIsAiming(true);
        }}
        onMouseUp={(e) => {
          if (e.button === 2) setIsAiming(false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Render Canvas */}
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={isAiming && cameraMode === 'first-person' ? 40 : 75} />
          <fog attach="fog" args={[levelTheme.fogColor, 15, 60]} />
          
          <Sky sunPosition={[80, 25, 80]} />
          <Stars radius={90} depth={45} count={1000} factor={3} saturation={0} fade speed={1.2} />

          <Suspense fallback={null}>
            <ambientLight intensity={levelTheme.ambientIntensity} />
            <pointLight position={[12, 12, 12]} intensity={1.2} castShadow />

            {/* Ground Plane */}
            <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <meshStandardMaterial color={levelTheme.floorColor} roughness={0.7} metalness={0.2} />
            </Plane>

            {/* Tactical Grid */}
            <gridHelper args={[100, 50, themeColor, "#1e293b"]} position={[0, 0.015, 0]} />

            {/* Spawns Active Guard list */}
            {isStarted && enemies.map((guard) => (
              <Guard 
                key={guard.id}
                id={guard.id}
                name={guard.name}
                type={guard.type}
                position={guard.position}
                waypoints={guard.waypoints}
                health={guard.health}
                playerPosRef={playerPosRef}
                isAlarmActive={isAlarmActive}
                onDetect={() => {
                  if (!isAlarmActive) {
                    setIsAlarmActive(true);
                    audio.playAlertSound();
                  }
                }}
                onHit={() => handleHitEnemy(guard.id, guard.type)}
                onShootPlayer={handleShootPlayer}
              />
            ))}

            {/* Spawns Target Dummies for Neural Forge */}
            {isStarted && !mission && Array.from({ length: 4 }).map((_, i) => (
              <Target 
                key={i}
                position={[(i - 1.5) * 8, 0, -15]}
                onHit={handleHitDummy}
              />
            ))}

            {/* Bullet Tracer lines */}
            {tracers.map((t) => (
              <BulletTracer key={t.id} start={t.start} direction={t.direction} color={t.color} />
            ))}

            {/* Spawned Brass Casing Particles */}
            {spawnedCasings.map((c) => (
              <ShellCasing key={c.id} startPos={c.pos} startVel={c.vel} />
            ))}

            {/* Impact Spark & Blood Particles */}
            {particles.map((p) => (
              <ImpactParticle key={p.id} startPos={p.pos} color={p.color} />
            ))}

            {/* Unified Player Controller & Character */}
            <Player 
              cameraMode={cameraMode} 
              playerPosRef={playerPosRef} 
              isMovingRef={isMovingRef} 
              isSprintingRef={isSprintingRef}
              shakeRef={shakeRef}
              touchMovementRef={touchMovementRef}
            />

            <PlayerCharacterModelMesh 
              cameraMode={cameraMode} 
              playerPosRef={playerPosRef} 
              isMovingRef={isMovingRef}
              isSprintingRef={isSprintingRef}
              isFiring={isFiring} 
              color="#3b82f6" 
            />

            {/* First-person Weapon HUD element */}
            {cameraMode === 'first-person' && isStarted && !isDead && !missionComplete && (
              <Weapon isFiring={isFiring} isAiming={isAiming} />
            )}

            {/* Environmental Setup */}
            <Environment preset={levelTheme.ambientPreset} />
            <Warehouse />

            {/* Pointer lock controls */}
            <PointerLockControls ref={controlsRef} pointerSpeed={isAiming ? sensitivity * 0.4 : sensitivity} />

            {/* Cyber Lights */}
            <spotLight position={[0, 18, 0]} angle={0.35} penumbra={1} intensity={2.5} castShadow color={levelTheme.spotlightColor} />
            <spotLight position={[-25, 18, -25]} angle={0.4} penumbra={1} intensity={1.5} color={isAlarmActive ? '#ef4444' : '#3b82f6'} />
          </Suspense>
        </Canvas>

        {/* --- RETREAT/NAV HEADER (Responsive positioning) --- */}
        <div className="absolute top-6 left-6 z-[75] pointer-events-auto flex items-center gap-4">
          <button 
            onClick={() => {
              audio.playClickSound();
              navigate(mission ? '/campaign' : '/');
            }}
            className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-[10px] font-mono tracking-widest text-gray-400 hover:text-white uppercase transition-all backdrop-blur-md"
          >
            ← RETREAT TO NEXUS
          </button>
          
          <button 
            onClick={() => {
              setCameraMode(m => m === 'first-person' ? 'third-person' : 'first-person');
              audio.playClickSound();
            }}
            className="hidden sm:inline-block px-4 py-2 bg-black/60 hover:bg-blue-950/20 border border-blue-500/20 text-[10px] font-mono tracking-widest text-blue-400 uppercase rounded-xl transition-all backdrop-blur-md"
          >
            Camera: {cameraMode === 'first-person' ? '1ST PERS' : '3RD PERS'} (V)
          </button>

          <div className="flex items-center gap-3 px-3 py-1.5 bg-black/60 border border-white/10 hover:border-blue-500/30 rounded-xl backdrop-blur-md transition-all text-white">
            <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase select-none">SENSITIVITY: {sensitivity.toFixed(1)}</span>
            <input 
              type="range" 
              min="0.1" 
              max="4.0" 
              step="0.1" 
              value={sensitivity} 
              onChange={(e) => {
                setSensitivity(parseFloat(e.target.value));
              }}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:bg-white/30 transition-all outline-none"
            />
          </div>
        </div>

        {/* --- DYNAMIC STATS HUD --- */}
        {/* Crosshair */}
        {isStarted && !isDead && !missionComplete && cameraMode === 'first-person' && !isAiming && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] opacity-80" />
            <div className="absolute w-8 h-8 border border-cyan-500/30 rounded-full opacity-50" />
          </div>
        )}
        <div className="absolute top-20 sm:top-6 right-6 flex flex-col items-end gap-2 z-30 pointer-events-none font-mono">
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Detection</span>
            <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isAlarmActive ? '100%' : '0%' }}
                className={`h-full ${isAlarmActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-400'}`}
              />
            </div>
          </div>
          {isAlarmActive && (
            <motion.span 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-[10px] font-bold text-red-500 uppercase tracking-widest"
            >
              ALARM ACTIVE
            </motion.span>
          )}
        </div>

        {/* Gun Crosshair HUD */}
        {cameraMode === 'first-person' && isStarted && !isDead && !missionComplete && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <div className="w-5 h-[1.5px] bg-blue-400 absolute left-1/2 -translate-x-1/2" />
              <div className="h-5 w-[1.5px] bg-blue-400 absolute top-1/2 -translate-y-1/2" />
              <div className="w-1 h-1 bg-red-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              
              {/* Recoil damage tick indicator */}
              {showHitMarker && (
                <motion.div 
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 relative">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-red-500" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-red-500" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-red-500" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* --- DYNAMIC DIGITAL VITALITY HUD --- */}
        {isStarted && !isDead && !missionComplete && (
          <>
            {/* Left HUD: Shield & Level Load */}
            <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-30 font-hud w-64 pointer-events-none">
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest flex items-center justify-between">
                  <span>SHIELD STATUS</span>
                  <span className="text-cyan-600/50">{health}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 border border-cyan-500/20 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-300"
                    style={{ width: `${health}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 bg-black/60 border border-white/5 px-4 py-3 flex items-center justify-between w-56 backdrop-blur-md rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:10px_10px]" />
                <div className="flex items-center gap-3 relative z-10">
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">LEVEL LOAD</span>
                  <span className="text-sm font-bold text-white">24%</span>
                </div>
                <span className="text-xl font-black text-white relative z-10">∞</span>
              </div>
            </div>

            {/* Right HUD: Abilities Info */}
            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 z-40 pointer-events-none">
              <div className="flex flex-col items-end gap-1 font-mono mb-2 bg-black/30 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                <div className="text-[10px] text-gray-400 tracking-widest uppercase flex justify-between w-40">
                  <span>WEAPON AMMO</span>
                  <span className="text-white font-bold">{ammo} / 999</span>
                </div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase flex justify-between w-40">
                  <span>SPECIAL ABILITY</span>
                  <span className="text-white font-bold">100%</span>
                </div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase flex justify-between w-40">
                  <span>RENEW</span>
                  <span className="text-cyan-400 font-bold">27%</span>
                </div>
              </div>
            </div>
          </>
        )}



        {/* --- FULLSCREEN DAMAGE RED FLASH --- */}
        {hitFlash && (
          <div className="absolute inset-0 bg-red-600/25 pointer-events-none z-50 animate-pulse" />
        )}

        {/* --- CLICK TO RESUME / PAUSE OVERLAY --- */}
        {isStarted && !isDead && !missionComplete && !isLocked && (
          <div 
            onClick={() => {
              if (controlsRef.current) controlsRef.current.lock();
            }}
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-[55] cursor-pointer backdrop-blur-sm pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 text-center max-w-sm border border-blue-500/30 shadow-neon-blue animate-fade-in"
            >
              <h3 className="text-2xl font-black italic uppercase text-blue-400 mb-2 tracking-wide">SIMULATION PAUSED</h3>
              <p className="text-gray-400 text-xs mb-6 font-mono leading-relaxed">
                NEURAL SYNC SUSPENDED. AIM CALIBRATION OPTIONS ARE BELOW.
              </p>
              
              {/* Calibration Slider inside Pause Screen */}
              <div className="bg-black/30 border border-blue-500/20 p-4 rounded-xl mb-6 text-left">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-2 font-black">
                  <span>⚙️ SENSITIVITY CALIBRATION</span>
                  <span>{sensitivity.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="4.0" 
                  step="0.1" 
                  value={sensitivity} 
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <button 
                onClick={() => {
                  if (controlsRef.current) controlsRef.current.lock();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95"
              >
                CLICK TO RESUME
              </button>
            </motion.div>
          </div>
        )}

        {/* --- RETREAT/START SCREEN --- */}
        {!isStarted && (
          <div className="absolute inset-0 bg-black/85 flex items-center justify-center backdrop-blur-md z-[60] p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 md:p-12 text-center max-w-lg border border-blue-500/30 shadow-neon-blue"
            >
              <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-4 tracking-tighter text-white">
                {mission ? mission.title : "Neural Forge"}
              </h2>
              <div className="text-left bg-black/40 border border-white/5 p-4 rounded-xl font-serif text-sm italic text-gray-300 mb-6 leading-relaxed">
                "{mission ? mission.briefing.text : "Welcome to Balwant's training module. Objective: Neutralize all ISF thermal signatures with maximum precision. Punishment is for pain; training is for results."}"
                <div className="mt-4 font-mono not-italic text-[10px] text-blue-400 tracking-[0.3em] font-black uppercase">
                  OPERATOR CLEARANCE: ARYAN SHARMA
                </div>
              </div>

              {/* Calibration Slider inside Start Screen */}
              <div className="bg-black/30 border border-blue-500/20 p-4 rounded-xl mb-6 text-left">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-2 font-black">
                  <span>⚙️ MOUSE SENSITIVITY CALIBRATION</span>
                  <span>{sensitivity.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="4.0" 
                  step="0.1" 
                  value={sensitivity} 
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <button 
                onClick={handleStart}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
              >
                {mission ? "INITIALIZE UPLINK" : "ENGAGE SIMULATOR"}
              </button>
            </motion.div>
          </div>
        )}

        {/* --- MISSION SUCCESS SCREEN --- */}
        {missionComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center z-[70] p-10 text-center"
          >
            <h3 className="text-6xl font-black italic text-emerald-500 uppercase mb-4 tracking-tighter shadow-sm animate-pulse">Mission Complete</h3>
            <p className="text-gray-400 mb-8 max-w-sm text-sm">Objective achieved. Target signatures neutralized. Syncing tactical data with Sector Command.</p>
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch(`${BACKEND_URL}/api/game/save`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: 'guest_user',
                        currentScene: 's8_shadow_ascendant',
                        rage: 60,
                        resolve: 60,
                        skills: ['combat'],
                        itemIds: ['map']
                      })
                    });
                    if (!response.ok) throw new Error('Save failed');
                    navigate('/campaign');
                  } catch (e) {
                    navigate('/campaign');
                  }
                }}
                className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
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

        {/* --- CRITICAL FAILURE / DEATH SCREEN --- */}
        {isDead && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-[70] p-10 text-center"
          >
            <h3 className="text-5xl md:text-7xl font-black italic text-red-600 uppercase mb-2 tracking-tighter animate-pulse">
              CONNECTION TERMINATED
            </h3>
            <p className="text-[11px] font-mono text-red-500/60 uppercase tracking-[0.4em] mb-12">
              CRITICAL SHIELD BREACH // OPERATIVE DECEASED
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleStart}
                className="px-12 py-4 bg-red-700 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-700/20"
              >
                REDEPLOY UPLINK
              </button>
              <button 
                onClick={() => navigate(mission ? '/campaign' : '/')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                RETREAT TO NEXUS
              </button>
            </div>
          </motion.div>
        )}
      </div>
  );
};

const Simulation: React.FC = () => (
  <KeyboardControls
    map={[
      { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
      { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
      { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
      { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
      { name: 'toggleCamera', keys: ['v', 'V'] },
      { name: 'jump', keys: ['Space', ' '] },
      { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
    ]}
  >
    <SimulationContent />
  </KeyboardControls>
);

export default Simulation;
