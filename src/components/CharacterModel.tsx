import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterModelProps {
  color?: string;
  type?: 'player' | 'enemy' | 'boss';
  isMoving?: boolean;
  isFiring?: boolean;
  scale?: number;
  gender?: 'male' | 'female';
  costume?: string;
}

const CharacterModel: React.FC<CharacterModelProps> = ({
  color = '#3b82f6',
  type = 'player',
  isMoving = false,
  isFiring = false,
  scale = 1.0,
  gender = 'male',
  costume = '',
}) => {
  const modelRef = useRef<THREE.Group>(null!);
  const chestCoreRef = useRef<THREE.Mesh>(null!);
  const scannerRef = useRef<THREE.Group>(null!);
  
  // Limbs for animation
  const leftArmPivot = useRef<THREE.Group>(null!);
  const rightArmPivot = useRef<THREE.Group>(null!);
  const leftLegPivot = useRef<THREE.Group>(null!);
  const rightLegPivot = useRef<THREE.Group>(null!);
  const headGroup = useRef<THREE.Group>(null!);

  // Visor and core colors based on type
  const isFriendly = type === 'player';
  const visorColor = isFriendly ? '#00f3ff' : type === 'boss' ? '#ff0055' : '#ff3300';
  
  // Costume logic
  const isJuggernaut = costume.includes('Juggernaut') || costume.includes('EOD');
  const isCivilian = costume.includes('Civilian') || costume.includes('Tailored Suit');
  const isGhillie = costume.includes('Ghillie');
  const isVR = costume.includes('VR');
  const isCatsuit = costume.includes('Catsuit');
  const isHeavy = costume.includes('Heavy Combat') || costume.includes('Riot');

  // Custom premium color palettes matching the video
  // Male character is bronze/gold metallic armor. Female character is dark blue polished armor.
  let primaryColor = '#1e3a8a'; // Default polished blue
  let secondaryColor = '#0f172a'; // Navy steel slate
  let metalnessValue = 0.85;
  let roughnessValue = 0.15;

  if (gender === 'male') {
    // Gold/Bronze theme
    primaryColor = '#b8860b'; // Gold bronze
    secondaryColor = '#4a3b1a'; // Dark brass metal
    metalnessValue = 0.9;
    roughnessValue = 0.12;
  } else {
    // Sleek Navy Blue theme
    primaryColor = '#1e3e62'; // Polished dark blue
    secondaryColor = '#0b132b'; // Dark midnight steel
    metalnessValue = 0.88;
    roughnessValue = 0.15;
  }

  // Override colors for special costumes
  if (isCivilian) {
    primaryColor = '#111827';
    secondaryColor = '#374151';
    metalnessValue = 0.1;
    roughnessValue = 0.9;
  } else if (isGhillie) {
    primaryColor = '#3b422e';
    secondaryColor = '#1c2214';
    metalnessValue = 0.2;
    roughnessValue = 0.95;
  } else if (isCatsuit) {
    primaryColor = '#0a0a0a';
    secondaryColor = '#171717';
    metalnessValue = 0.8;
    roughnessValue = 0.2;
  } else if (isJuggernaut) {
    primaryColor = '#475569';
    secondaryColor = '#1e293b';
    metalnessValue = 0.9;
    roughnessValue = 0.25;
  }

  const armorColor = primaryColor;
  const underSuitColor = secondaryColor;
  const highlightColor = isFriendly ? '#60a5fa' : type === 'boss' ? '#ef4444' : '#f97316';
  
  // Apply visual size scale factor
  let finalScale = scale * (type === 'boss' ? 1.35 : type === 'enemy' ? 1.05 : 1.0);
  if (isJuggernaut) finalScale *= 1.2;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Pulse chest core reactor
    if (chestCoreRef.current) {
      const pulse = 1.0 + Math.sin(time * 4) * 0.08;
      chestCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Holographic scanner wave sweep
    if (scannerRef.current) {
      // Moves up and down between y = -1.2 and y = 1.15
      scannerRef.current.position.y = Math.sin(time * 1.8) * 1.15;
    }

    if (isMoving) {
      const speed = 10;
      const angle = 0.65;
      const swing = Math.sin(time * speed) * angle;

      if (leftLegPivot.current) leftLegPivot.current.rotation.x = swing;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -swing;

      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -swing * 0.7;
      if (rightArmPivot.current) {
        if (isFiring) {
          rightArmPivot.current.rotation.x = -Math.PI / 2.2 + Math.sin(time * 35) * 0.04;
          rightArmPivot.current.rotation.y = -0.1;
        } else {
          rightArmPivot.current.rotation.x = swing * 0.7;
          rightArmPivot.current.rotation.y = 0;
        }
      }

      if (modelRef.current) {
        modelRef.current.position.y = Math.abs(Math.sin(time * speed * 2)) * 0.08;
        // Lean slightly forward when moving
        modelRef.current.rotation.x = 0.08;
      }
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(time * speed) * 0.05;
        headGroup.current.rotation.x = 0.03;
      }
    } else {
      const breathe = Math.sin(time * 2.2);
      
      if (leftLegPivot.current) leftLegPivot.current.rotation.set(0, 0, 0);
      if (rightLegPivot.current) rightLegPivot.current.rotation.set(0, 0, 0);
      
      if (leftArmPivot.current) {
        leftArmPivot.current.rotation.set(breathe * 0.02, 0, breathe * 0.02 - 0.04);
      }
      
      if (rightArmPivot.current) {
        if (isFiring) {
          rightArmPivot.current.rotation.x = -Math.PI / 2.2 + Math.sin(time * 35) * 0.04;
          rightArmPivot.current.rotation.y = -0.1;
        } else {
          rightArmPivot.current.rotation.set(-breathe * 0.02, 0, -breathe * 0.02 + 0.04);
          rightArmPivot.current.rotation.y = 0;
        }
      }

      if (headGroup.current) {
        headGroup.current.rotation.set(breathe * 0.02, Math.sin(time * 0.6) * 0.06, 0);
      }
      
      if (modelRef.current) {
        modelRef.current.position.y = breathe * 0.025;
        modelRef.current.rotation.x = 0;
      }
    }

    if (isFiring && rightArmPivot.current) {
      rightArmPivot.current.position.z = -0.06;
    } else if (rightArmPivot.current) {
      rightArmPivot.current.position.z = 0;
    }
  });

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      {/* Dynamic Holographic Scanline Ring - Sweeps up/down */}
      <group ref={scannerRef} position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.78, 32]} />
          <meshBasicMaterial color={visorColor} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[0, 0.75, 32]} />
          <meshBasicMaterial color={visorColor} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={modelRef} position={[0, 0, 0]}>
        
        {/* === NECK === */}
        <Cylinder args={[0.08, 0.12, 0.18, 8]} position={[0, 0.82, 0]} castShadow>
          <meshStandardMaterial color={underSuitColor} metalness={0.6} roughness={0.4} />
        </Cylinder>

        {/* === HEAD & TACTICAL HELMET === */}
        <group ref={headGroup} position={[0, 0.92, 0]}>
          {/* Main Helmet Dome */}
          <Sphere args={[0.28, 20, 20]} position={[0, 0.15, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
          </Sphere>
          
          {/* Helmet Ridge (Center crest) */}
          {!isCivilian && (
            <Box args={[0.06, 0.32, 0.32]} position={[0, 0.22, 0.05]} rotation={[-0.1, 0, 0]} castShadow>
              <meshStandardMaterial color={underSuitColor} metalness={0.9} roughness={0.1} />
            </Box>
          )}
          
          {/* Ear Module Plates (Headset) */}
          {!isCivilian && (
            <>
              <Cylinder args={[0.07, 0.07, 0.08, 8]} position={[0.26, 0.14, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color={underSuitColor} metalness={0.8} />
              </Cylinder>
              <Cylinder args={[0.07, 0.07, 0.08, 8]} position={[-0.26, 0.14, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color={underSuitColor} metalness={0.8} />
              </Cylinder>
              <Box args={[0.02, 0.1, 0.12]} position={[0.29, 0.14, 0.02]} castShadow>
                <meshStandardMaterial color={armorColor} metalness={metalnessValue} />
              </Box>
              <Box args={[0.02, 0.1, 0.12]} position={[-0.29, 0.14, 0.02]} castShadow>
                <meshStandardMaterial color={armorColor} metalness={metalnessValue} />
              </Box>
            </>
          )}

          {/* Tactical Wrapping Visor (Modular Panels) */}
          {!isCivilian && !isCatsuit && (
            <>
              {/* Central Visor Panel */}
              <Box args={[0.34, 0.1, 0.1]} position={[0, 0.18, 0.22]} rotation={[0.05, 0, 0]} castShadow>
                <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={3} metalness={0.1} roughness={0.05} />
              </Box>
              {/* Right Visor Panel Wrap */}
              <Box args={[0.16, 0.1, 0.08]} position={[0.15, 0.18, 0.18]} rotation={[0, -0.4, 0]} castShadow>
                <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={2.5} metalness={0.1} roughness={0.05} />
              </Box>
              {/* Left Visor Panel Wrap */}
              <Box args={[0.16, 0.1, 0.08]} position={[-0.15, 0.18, 0.18]} rotation={[0, 0.4, 0]} castShadow>
                <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={2.5} metalness={0.1} roughness={0.05} />
              </Box>
            </>
          )}

          {/* VR Visor Alternative */}
          {isVR && (
            <Box args={[0.46, 0.18, 0.16]} position={[0, 0.2, 0.2]} castShadow>
              <meshStandardMaterial color="#0a0f1d" emissive={visorColor} emissiveIntensity={3.5} roughness={0.1} />
            </Box>
          )}

          {/* Tactical Jaw Guard / Respirator */}
          {!isCivilian && (
            <Box args={[0.2, 0.12, 0.15]} position={[0, 0.03, 0.2]} rotation={[0.2, 0, 0]} castShadow>
              <meshStandardMaterial color={underSuitColor} metalness={0.7} roughness={0.3} />
            </Box>
          )}
          
          {/* Antenna */}
          {!isCivilian && !isCatsuit && (
            <Cylinder args={[0.01, 0.015, 0.28, 4]} position={[0.24, 0.35, -0.06]} rotation={[0.25, 0, -0.2]} castShadow>
              <meshStandardMaterial color={highlightColor} metalness={0.9} />
            </Cylinder>
          )}
        </group>

        {/* === TORSO & COLLAR PLATES === */}
        {/* Under-suit Torso Base */}
        <Box args={[0.56, 0.65, 0.35]} position={[0, 0.44, 0]} castShadow>
          <meshStandardMaterial color={underSuitColor} metalness={0.5} roughness={0.5} />
        </Box>

        {/* Modular Shoulder/Collar Plates (Plated Pauldrons) */}
        {!isCivilian && (
          <>
            <Box args={[0.24, 0.08, 0.38]} position={[-0.18, 0.74, 0.02]} rotation={[0.1, 0, 0.08]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
            <Box args={[0.24, 0.08, 0.38]} position={[0.18, 0.74, 0.02]} rotation={[0.1, 0, -0.08]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
          </>
        )}

        {/* Main Chest Plate (Segmented) */}
        <Box 
          args={[
            isJuggernaut ? 0.95 : (gender === 'male' ? 0.66 : 0.54), 
            isJuggernaut ? 0.85 : 0.65, 
            isCatsuit ? 0.28 : (gender === 'male' ? 0.42 : 0.36)
          ]} 
          position={[0, 0.46, 0.02]} 
          castShadow
        >
          <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
        </Box>
        
        {/* Tactical Vest Panels (Detailing on Chest) */}
        {!isCivilian && !isCatsuit && (
          <>
            {/* Left Upper Chest Plate */}
            <Box args={[0.22, 0.28, 0.04]} position={[-0.14, 0.56, gender === 'male' ? 0.22 : 0.19]} rotation={[0, 0, 0.02]} castShadow>
              <meshStandardMaterial color={underSuitColor} metalness={0.7} />
            </Box>
            {/* Right Upper Chest Plate */}
            <Box args={[0.22, 0.28, 0.04]} position={[0.14, 0.56, gender === 'male' ? 0.22 : 0.19]} rotation={[0, 0, -0.02]} castShadow>
              <meshStandardMaterial color={underSuitColor} metalness={0.7} />
            </Box>
          </>
        )}

        {/* Costume: Civilian Suit Tie */}
        {isCivilian && (
          <Box args={[0.07, 0.55, 0.02]} position={[0, 0.44, 0.21]} castShadow>
            <meshStandardMaterial color="#ef4444" roughness={0.9} />
          </Box>
        )}

        {/* Lower Abdomen Ab-Plate */}
        <Box 
          args={[
            isJuggernaut ? 0.78 : (gender === 'male' ? 0.52 : 0.44), 
            isJuggernaut ? 0.45 : 0.36, 
            isCatsuit ? 0.24 : 0.32
          ]} 
          position={[0, 0.08, 0.01]} 
          castShadow
        >
          <meshStandardMaterial color={underSuitColor} metalness={0.8} roughness={0.3} />
        </Box>

        {/* Segmented Ab-Plate Armor */}
        {!isCivilian && !isCatsuit && (
          <Box args={[gender === 'male' ? 0.38 : 0.3, 0.22, 0.04]} position={[0, 0.08, 0.16]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
          </Box>
        )}

        {/* Glowing TRIANGULAR Reactor Core (Downward pointing cylinder-3) */}
        {!isCivilian && (
          <group ref={chestCoreRef} position={[0, 0.48, isJuggernaut ? 0.48 : (gender === 'male' ? 0.23 : 0.20)]} rotation={[Math.PI / 2, 0, Math.PI]}>
            {/* Dark core container */}
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.05, 3]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing dynamic core */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 3]} />
              <meshBasicMaterial color={visorColor} toneMapped={false} />
            </mesh>
          </group>
        )}
        
        {/* Spine Plating (Backpack / Reactor Exhaust) */}
        {!isCivilian && !isCatsuit && (
          <group position={[0, 0.38, -0.18]}>
            <Cylinder args={[0.04, 0.06, 0.8, 8]} position={[0, 0, 0]} rotation={[0.05, 0, 0]} castShadow>
              <meshStandardMaterial color={highlightColor} metalness={0.9} />
            </Cylinder>
            <Box args={[0.18, 0.4, 0.12]} position={[0, 0.1, -0.04]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} />
            </Box>
          </group>
        )}
        
        {/* Tactical Belt */}
        {!isCivilian && !isCatsuit && (
          <group position={[0, -0.12, 0]}>
            <Box args={[gender === 'male' ? 0.58 : 0.48, 0.08, 0.32]} castShadow>
              <meshStandardMaterial color="#111827" roughness={0.9} />
            </Box>
            {/* Mag Pouches */}
            <Box args={[0.08, 0.12, 0.1]} position={[0.14, 0, 0.16]} castShadow>
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </Box>
            <Box args={[0.08, 0.12, 0.1]} position={[-0.14, 0, 0.16]} castShadow>
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </Box>
            {/* Belt Buckle (Glowing) */}
            <Box args={[0.08, 0.08, 0.02]} position={[0, 0, 0.16]}>
              <meshBasicMaterial color={visorColor} />
            </Box>
          </group>
        )}

        {/* === LEFT ARM & PAULDRON === */}
        <group ref={leftArmPivot} position={[gender === 'male' ? -0.42 : -0.36, 0.65, 0]}>
          {/* Shoulder Joint */}
          <Sphere args={[0.09, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color={underSuitColor} />
          </Sphere>
          
          {/* Layered Shoulder Pauldron */}
          {!isCivilian && !isCatsuit && (
            <group position={[-0.04, -0.02, 0]}>
              {/* Lower layer */}
              <Box args={[0.22, 0.2, 0.32]} castShadow>
                <meshStandardMaterial color={underSuitColor} metalness={0.7} />
              </Box>
              {/* Overlapping outer layer */}
              <Box args={[0.25, 0.12, 0.35]} position={[-0.03, 0.05, 0]} rotation={[0, 0, 0.12]} castShadow>
                <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
              </Box>
              {/* Glowing Pauldron Stripe */}
              <Box args={[0.26, 0.02, 0.2]} position={[-0.04, 0.05, 0]}>
                <meshBasicMaterial color={visorColor} />
              </Box>
            </group>
          )}

          {/* Upper Arm Bone */}
          <Box args={[isJuggernaut ? 0.24 : 0.16, 0.38, isJuggernaut ? 0.24 : 0.16]} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial color={underSuitColor} metalness={0.6} />
          </Box>
          
          {/* Forearm Bracer */}
          <group position={[0, -0.52, 0.02]} rotation={[-0.1, 0, 0]}>
            <Box args={[isJuggernaut ? 0.22 : 0.15, 0.36, isJuggernaut ? 0.22 : 0.15]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
            {/* Neon wrist display */}
            {!isCivilian && (
              <Box args={[0.02, 0.12, 0.08]} position={[-0.08, 0, 0]} rotation={[0, 0, 0.1]}>
                <meshBasicMaterial color={visorColor} />
              </Box>
            )}
          </group>

          {/* Left Hand Glove */}
          <Sphere args={[isJuggernaut ? 0.1 : 0.065, 8, 8]} position={[0, -0.74, 0.04]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </Sphere>
        </group>

        {/* === RIGHT ARM & PAULDRON (Weapon holder) === */}
        <group ref={rightArmPivot} position={[gender === 'male' ? 0.42 : 0.36, 0.65, 0]}>
          {/* Shoulder Joint */}
          <Sphere args={[0.09, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color={underSuitColor} />
          </Sphere>

          {/* Layered Shoulder Pauldron */}
          {!isCivilian && !isCatsuit && (
            <group position={[0.04, -0.02, 0]}>
              {/* Lower layer */}
              <Box args={[0.22, 0.2, 0.32]} castShadow>
                <meshStandardMaterial color={underSuitColor} metalness={0.7} />
              </Box>
              {/* Overlapping outer layer */}
              <Box args={[0.25, 0.12, 0.35]} position={[0.03, 0.05, 0]} rotation={[0, 0, -0.12]} castShadow>
                <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
              </Box>
              {/* Glowing Pauldron Stripe */}
              <Box args={[0.26, 0.02, 0.2]} position={[0.04, 0.05, 0]}>
                <meshBasicMaterial color={visorColor} />
              </Box>
            </group>
          )}

          {/* Upper Arm Bone */}
          <Box args={[isJuggernaut ? 0.24 : 0.16, 0.38, isJuggernaut ? 0.24 : 0.16]} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial color={underSuitColor} metalness={0.6} />
          </Box>
          
          {/* Forearm Bracer */}
          <group position={[0, -0.52, 0.02]} rotation={[-0.1, 0, 0]}>
            <Box args={[isJuggernaut ? 0.22 : 0.15, 0.36, isJuggernaut ? 0.22 : 0.15]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
            {/* Neon wrist display */}
            {!isCivilian && (
              <Box args={[0.02, 0.12, 0.08]} position={[0.08, 0, 0]} rotation={[0, 0, -0.1]}>
                <meshBasicMaterial color={visorColor} />
              </Box>
            )}
          </group>

          {/* Right Hand Glove */}
          <Sphere args={[isJuggernaut ? 0.1 : 0.065, 8, 8]} position={[0, -0.74, 0.04]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </Sphere>
          
          {/* Tactical Weapon (holding) */}
          <group position={[0.04, -0.74, 0.18]} rotation={[0, -Math.PI / 2, 0.08]}>
            {isHeavy || isJuggernaut ? (
              // Heavy LMG with muzzle brake & scope
              <>
                <Box args={[0.9, 0.16, 0.09]} castShadow><meshStandardMaterial color="#111827" metalness={0.9} /></Box>
                <Cylinder args={[0.035, 0.035, 0.65, 8]} position={[-0.55, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><meshStandardMaterial color="#374151" metalness={1} /></Cylinder>
                <Cylinder args={[0.08, 0.08, 0.26, 16]} position={[-0.1, -0.16, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#1f2937" /></Cylinder>
                {/* Heavy Scope */}
                <Box args={[0.18, 0.08, 0.06]} position={[0.1, 0.12, 0]}><meshStandardMaterial color="#2d3748" /></Box>
              </>
            ) : isGhillie ? (
              // Sniper Rifle with large scope and bipod
              <>
                <Box args={[1.15, 0.07, 0.05]} castShadow><meshStandardMaterial color="#1f2937" metalness={0.95} /></Box>
                <Cylinder args={[0.015, 0.015, 0.85, 8]} position={[-0.85, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><meshStandardMaterial color="#0f172a" metalness={1} /></Cylinder>
                {/* Large Scope */}
                <Cylinder args={[0.03, 0.02, 0.35, 12]} position={[0.05, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#090d16" metalness={0.9} /></Cylinder>
                <Box args={[0.01, 0.08, 0.04]} position={[0.05, 0.04, 0]}><meshStandardMaterial color="#111827" /></Box>
              </>
            ) : isCivilian ? (
              // Suppressed Pistol
              <>
                <Box args={[0.24, 0.08, 0.03]} position={[-0.08, 0, 0]} castShadow><meshStandardMaterial color="#111827" /></Box>
                <Cylinder args={[0.02, 0.02, 0.25, 8]} position={[-0.26, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#050505" metalness={0.6} /></Cylinder>
              </>
            ) : (
              // Default Assault Rifle (Tactical with Holo Scope and suppressor)
              <>
                {/* Gun Body */}
                <Box args={[0.66, 0.12, 0.06]} castShadow><meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} /></Box>
                {/* Holographic Scope */}
                <Box args={[0.14, 0.06, 0.04]} position={[0.08, 0.08, 0]}><meshStandardMaterial color="#0f172a" emissive={visorColor} emissiveIntensity={1} /></Box>
                {/* Long Tactical Suppressed Barrel */}
                <Cylinder args={[0.022, 0.022, 0.36, 10]} position={[-0.45, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><meshStandardMaterial color="#111827" metalness={1} /></Cylinder>
                {/* Hand Grip & Mag */}
                <Box args={[0.06, 0.18, 0.05]} position={[-0.04, -0.12, 0]} rotation={[0, 0, -0.28]}><meshStandardMaterial color="#0f172a" /></Box>
                <Box args={[0.06, 0.12, 0.04]} position={[-0.22, -0.08, 0]}><meshStandardMaterial color="#111827" /></Box>
              </>
            )}

            {/* Firing Muzzle Flash */}
            {isFiring && (
              <Sphere args={[0.07]} position={[-0.72, 0.01, 0]}>
                <meshBasicMaterial color="#fbbf24" toneMapped={false} />
              </Sphere>
            )}

            {/* Tactical Red Laser Sight Line (Euler Math Projection) */}
            {!isCivilian && (
              <mesh position={[-7.5, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.003, 0.003, 15, 4]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        </group>

        {/* === LEFT LEG & SHIN GUARD === */}
        <group ref={leftLegPivot} position={[-0.18, -0.1, 0]}>
          {/* Hip Joint */}
          <Sphere args={[0.1, 8, 8]}>
            <meshStandardMaterial color={underSuitColor} />
          </Sphere>

          {/* Upper Thigh */}
          <Box args={[0.22, 0.52, 0.22]} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial color={underSuitColor} metalness={0.5} />
          </Box>
          {/* Thigh Plate */}
          {!isCivilian && (
            <Box args={[0.24, 0.32, 0.24]} position={[-0.02, -0.2, 0.02]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
          )}

          {/* Shin Guard (Greave) with Glowing Neon Strip */}
          <group position={[0, -0.72, 0.01]}>
            <Box args={[isJuggernaut ? 0.25 : 0.18, 0.44, isJuggernaut ? 0.25 : 0.18]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
            {/* Glowing shin strip */}
            {!isCivilian && (
              <Box args={[0.02, 0.3, 0.2]} position={[0, 0, 0.1]} castShadow>
                <meshBasicMaterial color={visorColor} />
              </Box>
            )}
          </group>

          {/* Combat Boot */}
          <Box args={[0.2, 0.12, 0.34]} position={[0, -1.02, 0.08]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.7} />
          </Box>
          <Box args={[0.22, 0.04, 0.36]} position={[0, -1.08, 0.08]} castShadow>
            <meshStandardMaterial color="#1f2937" metalness={0.9} />
          </Box>
        </group>

        {/* === RIGHT LEG & SHIN GUARD === */}
        <group ref={rightLegPivot} position={[0.18, -0.1, 0]}>
          {/* Hip Joint */}
          <Sphere args={[0.1, 8, 8]}>
            <meshStandardMaterial color={underSuitColor} />
          </Sphere>

          {/* Upper Thigh */}
          <Box args={[0.22, 0.52, 0.22]} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial color={underSuitColor} metalness={0.5} />
          </Box>
          {/* Thigh Plate */}
          {!isCivilian && (
            <Box args={[0.24, 0.32, 0.24]} position={[0.02, -0.2, 0.02]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
          )}

          {/* Shin Guard (Greave) with Glowing Neon Strip */}
          <group position={[0, -0.72, 0.01]}>
            <Box args={[isJuggernaut ? 0.25 : 0.18, 0.44, isJuggernaut ? 0.25 : 0.18]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={metalnessValue} roughness={roughnessValue} />
            </Box>
            {/* Glowing shin strip */}
            {!isCivilian && (
              <Box args={[0.02, 0.3, 0.2]} position={[0, 0, 0.1]} castShadow>
                <meshBasicMaterial color={visorColor} />
              </Box>
            )}
          </group>

          {/* Combat Boot */}
          <Box args={[0.2, 0.12, 0.34]} position={[0, -1.02, 0.08]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.7} />
          </Box>
          <Box args={[0.22, 0.04, 0.36]} position={[0, -1.08, 0.08]} castShadow>
            <meshStandardMaterial color="#1f2937" metalness={0.9} />
          </Box>
        </group>

      </group>
    </group>
  );
};

export default CharacterModel;

