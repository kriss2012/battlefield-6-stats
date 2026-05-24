import React, { useRef, useMemo } from 'react';
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
  color = '#1e3a8a', // High-fidelity dark blue base for players
  type = 'player',
  isMoving = false,
  isFiring = false,
  scale = 1.0,
  gender = 'male',
  costume = 'Standard Issue Armor',
}) => {
  const modelRef = useRef<THREE.Group>(null!);
  const chestCoreRef = useRef<THREE.Mesh>(null!);
  
  // Limbs and joints for animation
  const leftArmPivot = useRef<THREE.Group>(null!);
  const rightArmPivot = useRef<THREE.Group>(null!);
  const leftLegPivot = useRef<THREE.Group>(null!);
  const rightLegPivot = useRef<THREE.Group>(null!);
  const headGroup = useRef<THREE.Group>(null!);

  const isFriendly = type === 'player';

  // costume classifications
  const isJuggernaut = costume.toLowerCase().includes('juggernaut') || costume.toLowerCase().includes('eod');
  const isCivilian = costume.toLowerCase().includes('civilian') || costume.toLowerCase().includes('suit');
  const isGhillie = costume.toLowerCase().includes('ghillie');
  const isVR = costume.toLowerCase().includes('vr') || costume.toLowerCase().includes('runner');
  const isCatsuit = costume.toLowerCase().includes('catsuit');
  const isStealth = costume.toLowerCase().includes('stealth') || costume.toLowerCase().includes('adaptive camo');
  const isHeavy = costume.toLowerCase().includes('heavy') || costume.toLowerCase().includes('blast');
  const isRiot = costume.toLowerCase().includes('riot') || costume.toLowerCase().includes('urban riot');

  // Configure Colors based on costume/character type
  const themeColors = useMemo(() => {
    let baseColor = color;
    let emissiveColor = isFriendly ? '#00f3ff' : '#ff3300';
    let secondaryColor = '#0f172a'; // dark carbon

    if (type === 'boss') {
      baseColor = '#c5a059'; // Golden/Bronze armor for command bosses (matching video keyframe 1)
      emissiveColor = '#ffaa00';
      secondaryColor = '#3f1a24';
    } else if (type === 'enemy') {
      baseColor = '#374151'; // Dark tactical gray
      emissiveColor = '#ef4444';
      secondaryColor = '#111827';
    } else {
      // Player costumes
      if (isCivilian) {
        baseColor = '#1e293b'; // Charcoal suit
        emissiveColor = '#ffffff'; // standard white shirt reflection
      } else if (isGhillie) {
        baseColor = '#4d533c'; // Foliage green
        emissiveColor = '#f59e0b'; // Amber visor
      } else if (isCatsuit) {
        baseColor = '#050505'; // Slick black
        emissiveColor = '#a855f7'; // Purple neon glow
      } else if (isStealth) {
        baseColor = '#0b1329'; // Shifting dark blue
        emissiveColor = '#00f3ff'; // Tech blue cyan
      } else if (isJuggernaut) {
        baseColor = '#475569'; // Heavy iron gray
        emissiveColor = '#f59e0b'; // Heavy amber visor
      } else if (isVR) {
        baseColor = '#3b82f6'; // Bright cobalt blue jacket
        emissiveColor = '#10b981'; // Cyber emerald green glow
      } else if (isRiot) {
        baseColor = '#1e293b'; // Urban slate
        emissiveColor = '#00f3ff';
      }
    }

    return {
      base: baseColor,
      glow: emissiveColor,
      dark: secondaryColor,
      highlight: isFriendly ? '#60a5fa' : type === 'boss' ? '#fbbf24' : '#f87171'
    };
  }, [color, type, isCivilian, isGhillie, isCatsuit, isStealth, isJuggernaut, isVR, isRiot, isFriendly]);

  // Visual size scale adjustments
  let finalScale = scale * (type === 'boss' ? 1.35 : type === 'enemy' ? 1.05 : 1.0);
  if (isJuggernaut) finalScale *= 1.25;
  if (isCatsuit) finalScale *= 0.95; // Sleeker silhouette

  // Handle R3F animation updates
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Heartbeat pulse of the cyber reactor
    if (chestCoreRef.current) {
      const pulse = 1.0 + Math.sin(time * 4) * 0.08;
      chestCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (isMoving) {
      const speed = 10;
      const angle = 0.65;
      const swing = Math.sin(time * speed) * angle;

      // Leg swing (alternating)
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = swing;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -swing;

      // Arm swing (opposing legs)
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -swing * 0.75;
      if (rightArmPivot.current) {
        if (isFiring) {
          // Keep weapon raised and firing recoil
          rightArmPivot.current.rotation.x = -Math.PI / 2 + Math.sin(time * 35) * 0.04;
        } else {
          rightArmPivot.current.rotation.x = swing * 0.75;
        }
      }

      // Torso bobbing and head counter-rotation
      if (modelRef.current) {
        modelRef.current.position.y = Math.abs(Math.sin(time * speed * 2)) * 0.09;
      }
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(time * speed) * 0.08;
        headGroup.current.rotation.z = Math.sin(time * speed * 0.5) * 0.04;
      }
    } else {
      // Idle Breathing animation
      const breathe = Math.sin(time * 2.2);
      
      if (leftLegPivot.current) leftLegPivot.current.rotation.set(0, 0, 0);
      if (rightLegPivot.current) rightLegPivot.current.rotation.set(0, 0, 0);
      
      if (leftArmPivot.current) {
        leftArmPivot.current.rotation.set(breathe * 0.04, 0, breathe * 0.03 - 0.08);
      }
      
      if (rightArmPivot.current) {
        if (isFiring) {
          rightArmPivot.current.rotation.x = -Math.PI / 2 + Math.sin(time * 35) * 0.04;
        } else {
          rightArmPivot.current.rotation.set(-breathe * 0.04, 0, -breathe * 0.03 + 0.08);
        }
      }

      if (headGroup.current) {
        headGroup.current.rotation.set(breathe * 0.03, Math.sin(time * 0.4) * 0.07, 0);
      }
      
      if (modelRef.current) {
        modelRef.current.position.y = breathe * 0.025;
      }
    }

    // Firing recoil offset
    if (isFiring && rightArmPivot.current) {
      rightArmPivot.current.position.z = -0.06;
    } else if (rightArmPivot.current) {
      rightArmPivot.current.position.z = 0;
    }
  });

  // Reusable materials
  const armorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: themeColors.base,
    metalness: isCivilian ? 0.1 : 0.85,
    roughness: isCivilian ? 0.8 : 0.18,
  }), [themeColors.base, isCivilian]);

  const techGlowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#000000',
    emissive: themeColors.glow,
    emissiveIntensity: 3.5,
    roughness: 0.1,
  }), [themeColors.glow]);

  const underArmorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: themeColors.dark,
    metalness: 0.4,
    roughness: 0.6,
  }), [themeColors.dark]);

  const highlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: themeColors.highlight,
    metalness: 0.9,
    roughness: 0.1,
  }), [themeColors.highlight]);

  // Procedural foliage blocks for Ghillie Suit
  const ghillieLeaves = useMemo(() => {
    if (!isGhillie) return null;
    return [...Array(24)].map((_, i) => ({
      scale: [0.12 + Math.random() * 0.12, 0.12 + Math.random() * 0.12, 0.12 + Math.random() * 0.12] as [number, number, number],
      pos: [
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.7 + 0.4,
        (Math.random() - 0.5) * 0.5
      ] as [number, number, number],
      color: i % 2 === 0 ? '#3f4e2f' : i % 3 === 0 ? '#5d6e46' : '#2b361a'
    }));
  }, [isGhillie]);

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      <group ref={modelRef} position={[0, 0, 0]}>
        
        {/* === NECK === */}
        <Cylinder args={[0.09, 0.14, 0.22, 12]} position={[0, 0.82, 0]} castShadow>
          <primitive object={underArmorMat} attach="material" />
        </Cylinder>

        {/* === HEAD & TACTICAL HELMET === */}
        <group ref={headGroup} position={[0, 0.94, 0]}>
          {/* Base Head */}
          <Sphere args={[0.26, 16, 16]} position={[0, 0.14, 0]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Sphere>

          {/* Helmet Crest/Ridge on Top (Tactical Accent) */}
          {!isCivilian && (
            <Box args={[0.04, 0.28, 0.36]} position={[0, 0.26, -0.06]} castShadow>
              <primitive object={highlightMat} attach="material" />
            </Box>
          )}

          {/* Side Communications & Sensor Pods */}
          {!isCivilian && (
            <>
              <Box args={[0.07, 0.14, 0.14]} position={[0.25, 0.14, 0]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Box>
              <Box args={[0.07, 0.14, 0.14]} position={[-0.25, 0.14, 0]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Box>
              {/* Antenna */}
              <Cylinder args={[0.012, 0.012, 0.32, 6]} position={[0.24, 0.36, -0.08]} rotation={[0.15, 0, -0.08]} castShadow>
                <primitive object={highlightMat} attach="material" />
              </Cylinder>
            </>
          )}

          {/* Jaw Guard / Breath Filter Mask */}
          {!isCivilian && (
            <Box args={[0.3, 0.14, 0.2]} position={[0, 0.03, 0.16]} rotation={[0.15, 0, 0]} castShadow>
              <primitive object={underArmorMat} attach="material" />
            </Box>
          )}

          {/* VR Goggles (VR runner) vs Tactical Visor */}
          {isVR ? (
            <Box args={[0.46, 0.18, 0.16]} position={[0, 0.22, 0.18]} castShadow>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          ) : !isCivilian ? (
            /* Curved Visor Plates */
            <group position={[0, 0.18, 0.2]}>
              <Box args={[0.38, 0.11, 0.1]} castShadow>
                <primitive object={techGlowMat} attach="material" />
              </Box>
              {/* Segmented Visor Edges */}
              <Box args={[0.1, 0.08, 0.08]} position={[0.2, -0.02, -0.04]} rotation={[0, 0.3, 0]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Box>
              <Box args={[0.1, 0.08, 0.08]} position={[-0.2, -0.02, -0.04]} rotation={[0, -0.3, 0]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Box>
            </group>
          ) : (
            /* Civilian Agent sunglasses */
            <Box args={[0.38, 0.08, 0.06]} position={[0, 0.18, 0.2]} castShadow>
              <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
            </Box>
          )}

          {/* Ghillie Camo Foliage on Head */}
          {isGhillie && (
            <group position={[0, 0.2, 0]}>
              {[...Array(6)].map((_, i) => (
                <Sphere 
                  key={i} 
                  args={[0.13, 8, 8]} 
                  position={[
                    (Math.random() - 0.5) * 0.5,
                    Math.random() * 0.2,
                    (Math.random() - 0.5) * 0.5
                  ]}
                >
                  <meshStandardMaterial color={i % 2 === 0 ? '#3f4e2f' : '#4d533c'} roughness={1} />
                </Sphere>
              ))}
            </group>
          )}
        </group>

        {/* === TORSO (Segmented Armor & Cyber-reactor) === */}
        {/* Chest Plate Shell */}
        <group position={[0, 0.48, 0]}>
          {/* Main Chest Plate Segment */}
          <Box 
            args={[
              isJuggernaut ? 0.92 : (gender === 'male' ? 0.68 : 0.56), 
              isJuggernaut ? 0.62 : 0.44, 
              isCatsuit ? 0.28 : (gender === 'male' ? 0.44 : 0.38)
            ]} 
            castShadow
          >
            <primitive object={armorMat} attach="material" />
          </Box>

          {/* Collar Bone Reinforcements */}
          {!isCivilian && (
            <>
              <Box args={[0.26, 0.08, 0.12]} position={[0.16, 0.22, 0.12]} rotation={[0, -0.15, 0.05]} castShadow>
                <primitive object={highlightMat} attach="material" />
              </Box>
              <Box args={[0.26, 0.08, 0.12]} position={[-0.16, 0.22, 0.12]} rotation={[0, 0.15, -0.05]} castShadow>
                <primitive object={highlightMat} attach="material" />
              </Box>
            </>
          )}

          {/* Cyber Reactor Core */}
          {!isCivilian && (
            <group position={[0, 0.04, isJuggernaut ? 0.24 : 0.21]}>
              {/* Outer metallic ring */}
              <Cylinder args={[0.12, 0.12, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Cylinder>
              {/* Core light source */}
              <Sphere ref={chestCoreRef} args={[0.07, 16, 16]}>
                <primitive object={techGlowMat} attach="material" />
              </Sphere>
            </group>
          )}
          
          {/* Costume: Civilian Suit Tie & Collar */}
          {isCivilian && (
            <group position={[0, 0, 0.2]}>
              {/* White collar */}
              <Box args={[0.14, 0.12, 0.02]} position={[0, 0.2, 0.01]} castShadow>
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </Box>
              {/* Red tie */}
              <Box args={[0.06, 0.48, 0.02]} position={[0, -0.06, 0.02]} castShadow>
                <meshStandardMaterial color="#b91c1c" roughness={0.7} />
              </Box>
            </group>
          )}
        </group>

        {/* Lower Stomach (Ribbed Underarmor Joints) */}
        <group position={[0, 0.16, 0]}>
          {/* Flexible Rib Plates */}
          <Box 
            args={[
              isJuggernaut ? 0.78 : (gender === 'male' ? 0.54 : 0.46), 
              0.1, 
              isCatsuit ? 0.24 : 0.32
            ]} 
            position={[0, 0.06, 0]} 
            castShadow
          >
            <primitive object={underArmorMat} attach="material" />
          </Box>
          <Box 
            args={[
              isJuggernaut ? 0.74 : (gender === 'male' ? 0.52 : 0.44), 
              0.08, 
              isCatsuit ? 0.22 : 0.3
            ]} 
            position={[0, -0.06, 0]} 
            castShadow
          >
            <primitive object={underArmorMat} attach="material" />
          </Box>
        </group>

        {/* Spinal Frame / Thrust Backpack (Visible from back) */}
        {!isCivilian && (
          <group position={[0, 0.42, -0.22]}>
            {/* Backpack main rig */}
            <Box args={[0.36, 0.52, 0.12]} castShadow>
              <primitive object={underArmorMat} attach="material" />
            </Box>
            {/* Battery / Energy tubes */}
            <Cylinder args={[0.04, 0.04, 0.44, 8]} position={[0, 0, 0.08]} rotation={[0, 0, 0]} castShadow>
              <primitive object={highlightMat} attach="material" />
            </Cylinder>
            
            {/* Thruster exhaust nozzles (Futuristic tactical detail) */}
            <group position={[0, -0.24, -0.02]}>
              <Cylinder args={[0.06, 0.04, 0.12, 8]} position={[0.1, 0, 0]} rotation={[0.2, 0, -0.1]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Cylinder>
              <Cylinder args={[0.06, 0.04, 0.12, 8]} position={[-0.1, 0, 0]} rotation={[0.2, 0, 0.1]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Cylinder>
              {/* Flame nodes when moving */}
              {isMoving && (
                <>
                  <Sphere args={[0.04]} position={[0.1, -0.08, -0.02]}>
                    <meshBasicMaterial color="#f97316" />
                  </Sphere>
                  <Sphere args={[0.04]} position={[-0.1, -0.08, -0.02]}>
                    <meshBasicMaterial color="#f97316" />
                  </Sphere>
                </>
              )}
            </group>
          </group>
        )}

        {/* Ghillie Torso foliage details */}
        {ghillieLeaves && (
          <group>
            {ghillieLeaves.map((leaf, idx) => (
              <Box key={idx} args={leaf.scale} position={leaf.pos}>
                <meshStandardMaterial color={leaf.color} roughness={1} />
              </Box>
            ))}
          </group>
        )}

        {/* Shoulder Pauldrons (Joint armor) */}
        {!isCivilian && (
          <>
            {/* Left Pauldron */}
            <Box 
              args={[
                isJuggernaut ? 0.38 : 0.24, 
                isJuggernaut ? 0.38 : 0.22, 
                isJuggernaut ? 0.46 : 0.32
              ]} 
              position={[gender === 'male' ? 0.42 : 0.34, 0.68, 0]} 
              castShadow
            >
              <primitive object={armorMat} attach="material" />
            </Box>
            {/* Right Pauldron */}
            <Box 
              args={[
                isJuggernaut ? 0.38 : 0.24, 
                isJuggernaut ? 0.38 : 0.22, 
                isJuggernaut ? 0.46 : 0.32
              ]} 
              position={[gender === 'male' ? -0.42 : -0.34, 0.68, 0]} 
              castShadow
            >
              <primitive object={armorMat} attach="material" />
            </Box>
          </>
        )}

        {/* Tactical Belt & Utility Pouches */}
        {!isCivilian && (
          <group position={[0, -0.04, 0]}>
            {/* Core Belt Band */}
            <Box args={[isJuggernaut ? 0.74 : (gender === 'male' ? 0.58 : 0.48), 0.08, isCatsuit ? 0.26 : 0.34]} castShadow>
              <primitive object={underArmorMat} attach="material" />
            </Box>
            {/* Front Utility Pouches */}
            <Box args={[0.11, 0.13, 0.08]} position={[0.14, 0, 0.16]} castShadow>
              <primitive object={underArmorMat} attach="material" />
            </Box>
            <Box args={[0.11, 0.13, 0.08]} position={[-0.14, 0, 0.16]} castShadow>
              <primitive object={underArmorMat} attach="material" />
            </Box>
            {/* Glowing buckle */}
            <Box args={[0.08, 0.06, 0.04]} position={[0, 0, 0.17]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          </group>
        )}

        {/* === LEFT ARM (Gauntlet & Glove) === */}
        <group ref={leftArmPivot} position={[gender === 'male' ? -0.46 : -0.38, 0.64, 0]}>
          {/* Upper Arm Bicep */}
          <Box args={[isJuggernaut ? 0.26 : 0.16, 0.38, isJuggernaut ? 0.26 : 0.16]} position={[0, -0.16, 0]} castShadow>
            <primitive object={underArmorMat} attach="material" />
          </Box>
          {/* Elbow Joint Guard */}
          <Sphere args={[isJuggernaut ? 0.11 : 0.07, 8, 8]} position={[0, -0.36, 0]} castShadow>
            <primitive object={highlightMat} attach="material" />
          </Sphere>
          
          {/* Forearm Armored Gauntlet */}
          <Box args={[isJuggernaut ? 0.24 : 0.15, 0.38, isJuggernaut ? 0.24 : 0.15]} position={[0, -0.56, 0.02]} rotation={[-0.12, 0, 0]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          
          {/* Forearm holographic screen details */}
          {!isCivilian && (
            <Box args={[0.05, 0.14, 0.02]} position={[-0.08, -0.56, 0.05]} rotation={[0, -Math.PI/2, 0]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          )}

          {/* Glove hand */}
          <Sphere args={[isJuggernaut ? 0.11 : 0.065, 8, 8]} position={[0, -0.76, 0.06]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </Sphere>

          {/* Riot shield attachment in Left Hand (Urban Riot Gear Costume) */}
          {isRiot && (
            <group position={[-0.24, -0.5, 0.28]} rotation={[0, 0.3, 0]}>
              {/* Massive shield frame */}
              <Box args={[0.8, 1.4, 0.04]} castShadow receiveShadow>
                <meshStandardMaterial 
                  color="#1f2937" 
                  transparent 
                  opacity={0.55} 
                  roughness={0.15} 
                  metalness={0.9} 
                />
              </Box>
              {/* Steel cross bars */}
              <Box args={[0.8, 0.06, 0.06]} position={[0, 0.4, 0]}><primitive object={underArmorMat} attach="material" /></Box>
              <Box args={[0.8, 0.06, 0.06]} position={[0, -0.4, 0]}><primitive object={underArmorMat} attach="material" /></Box>
              <Box args={[0.06, 1.4, 0.06]} position={[0, 0, 0]}><primitive object={underArmorMat} attach="material" /></Box>
              {/* Emissive border decals */}
              <Box args={[0.8, 0.02, 0.05]} position={[0, 0.68, 0]}><primitive object={techGlowMat} attach="material" /></Box>
              <Box args={[0.8, 0.02, 0.05]} position={[0, -0.68, 0]}><primitive object={techGlowMat} attach="material" /></Box>
            </group>
          )}
        </group>

        {/* === RIGHT ARM (Gauntlet, Glove & Custom Weapon) === */}
        <group ref={rightArmPivot} position={[gender === 'male' ? 0.46 : 0.38, 0.64, 0]}>
          {/* Upper Arm Bicep */}
          <Box args={[isJuggernaut ? 0.26 : 0.16, 0.38, isJuggernaut ? 0.26 : 0.16]} position={[0, -0.16, 0]} castShadow>
            <primitive object={underArmorMat} attach="material" />
          </Box>
          {/* Elbow Joint Guard */}
          <Sphere args={[isJuggernaut ? 0.11 : 0.07, 8, 8]} position={[0, -0.36, 0]} castShadow>
            <primitive object={highlightMat} attach="material" />
          </Sphere>
          
          {/* Forearm Armored Gauntlet */}
          <Box args={[isJuggernaut ? 0.24 : 0.15, 0.38, isJuggernaut ? 0.24 : 0.15]} position={[0, -0.56, 0.02]} rotation={[-0.12, 0, 0]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          
          {/* Glove hand */}
          <Sphere args={[isJuggernaut ? 0.11 : 0.065, 8, 8]} position={[0, -0.76, 0.06]} castShadow>
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </Sphere>
          
          {/* === TACTICAL WEAPON ASSEMBLY === */}
          <group position={[0.06, -0.76, 0.24]} rotation={[0, -Math.PI / 2, 0.06]}>
            {isHeavy || isJuggernaut ? (
              // === HEAVY DETAILED LMG (Matches heavy/boss) ===
              <group>
                {/* Heavy Receiver box */}
                <Box args={[0.9, 0.18, 0.12]} castShadow>
                  <primitive object={underArmorMat} attach="material" />
                </Box>
                {/* Shroud barrel jacket */}
                <Box args={[0.4, 0.12, 0.1]} position={[-0.32, 0, 0]}>
                  <primitive object={armorMat} attach="material" />
                </Box>
                {/* Long heavy barrel */}
                <Cylinder args={[0.038, 0.038, 0.65, 8]} position={[-0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#374151" metalness={1} roughness={0.1} />
                </Cylinder>
                {/* Large cylindrical drum magazine */}
                <Cylinder args={[0.15, 0.15, 0.26, 16]} position={[-0.1, -0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <primitive object={underArmorMat} attach="material" />
                </Cylinder>
                {/* Tactical glowing sight */}
                <Box args={[0.16, 0.06, 0.04]} position={[0, 0.12, 0]}>
                  <primitive object={techGlowMat} attach="material" />
                </Box>
              </group>
            ) : isGhillie ? (
              // === HIGH CALIBER SNIPER RIFLE ===
              <group>
                {/* Sniper chassis & body */}
                <Box args={[1.25, 0.09, 0.06]} castShadow>
                  <primitive object={underArmorMat} attach="material" />
                </Box>
                {/* Long sniper barrel */}
                <Cylinder args={[0.016, 0.016, 0.95, 8]} position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#1a202c" metalness={1} roughness={0.1} />
                </Cylinder>
                {/* Large high-power scopes */}
                <Cylinder args={[0.04, 0.03, 0.32, 12]} position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <primitive object={underArmorMat} attach="material" />
                </Cylinder>
                {/* Scope lens glows */}
                <Sphere args={[0.03, 8, 8]} position={[-0.17, 0.14, 0]}>
                  <primitive object={techGlowMat} attach="material" />
                </Sphere>
                {/* Bipod assembly under gun */}
                <Box args={[0.02, 0.3, 0.02]} position={[-0.6, -0.15, 0.05]} rotation={[0, 0, -0.4]} />
                <Box args={[0.02, 0.3, 0.02]} position={[-0.6, -0.15, -0.05]} rotation={[0, 0, 0.4]} />
              </group>
            ) : isCivilian ? (
              // === MODERN SUPPRESSED PISTOL ===
              <group>
                {/* Slide & frame */}
                <Box args={[0.28, 0.07, 0.04]} position={[-0.08, 0, 0]} castShadow>
                  <meshStandardMaterial color="#0f172a" metalness={0.9} />
                </Box>
                <Box args={[0.06, 0.12, 0.04]} position={[0.02, -0.08, 0]} rotation={[0, 0, -0.2]} />
                {/* Extended Suppressor canister */}
                <Cylinder args={[0.028, 0.028, 0.32, 10]} position={[-0.34, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
                </Cylinder>
              </group>
            ) : (
              // === DEFAULT HIGH-FIDELITY ASSAULT RIFLE ===
              <group>
                {/* Upper receiver chassis */}
                <Box args={[0.7, 0.11, 0.06]} castShadow>
                  <primitive object={underArmorMat} attach="material" />
                </Box>
                {/* Handguard/Barrel Shroud */}
                <Box args={[0.3, 0.08, 0.05]} position={[-0.26, 0.01, 0]}>
                  <primitive object={armorMat} attach="material" />
                </Box>
                {/* Steel barrel */}
                <Cylinder args={[0.018, 0.018, 0.42, 8]} position={[-0.55, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#374151" metalness={1} roughness={0.1} />
                </Cylinder>
                {/* Curved rifle magazine */}
                <Box args={[0.08, 0.22, 0.05]} position={[-0.05, -0.14, 0]} rotation={[0, 0, -0.28]} castShadow>
                  <primitive object={underArmorMat} attach="material" />
                </Box>
                {/* Holographic sight rails */}
                <Box args={[0.18, 0.05, 0.04]} position={[0.06, 0.08, 0]}>
                  <primitive object={techGlowMat} attach="material" />
                </Box>
                {/* Glowing laser sight underbarrel dot */}
                <Box args={[0.04, 0.04, 0.04]} position={[-0.3, -0.05, 0]}>
                  <meshBasicMaterial color="#ef4444" />
                </Box>
              </group>
            )}

            {/* Glowing Muzzle Flash when firing */}
            {isFiring && (
              <group position={[isHeavy ? -1.1 : isGhillie ? -1.4 : isCivilian ? -0.52 : -0.78, 0.02, 0]}>
                <Sphere args={[0.12, 8, 8]}>
                  <meshBasicMaterial color="#fbbf24" />
                </Sphere>
                {/* Flash cone */}
                <Cylinder args={[0.02, 0.18, 0.35, 8]} position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <meshBasicMaterial color="#fb923c" transparent opacity={0.85} />
                </Cylinder>
              </group>
            )}
          </group>
        </group>

        {/* === LEFT LEG (Thigh Armor, Knee, Shin & Boot) === */}
        <group ref={leftLegPivot} position={[-0.2, -0.1, 0]}>
          {/* Thigh Guard Plate */}
          <Box args={[isJuggernaut ? 0.34 : 0.22, 0.58, isJuggernaut ? 0.34 : 0.22]} position={[0, -0.28, 0]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          {/* Side Thigh Glowing Accent Decals */}
          {!isCivilian && (
            <Box args={[0.02, 0.38, 0.12]} position={[-0.11, -0.28, 0.06]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          )}

          {/* Knee Pad */}
          <Box args={[isJuggernaut ? 0.22 : 0.14, isJuggernaut ? 0.22 : 0.14, 0.08]} position={[0, -0.58, 0.12]} rotation={[0.08, 0, 0]} castShadow>
            <primitive object={highlightMat} attach="material" />
          </Box>

          {/* Shin Armor Guard */}
          <Box args={[isJuggernaut ? 0.3 : 0.19, 0.52, isJuggernaut ? 0.3 : 0.19]} position={[0, -0.84, 0.04]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          
          {/* Front Shin Emissive Tech lines */}
          {!isCivilian && (
            <Box args={[0.05, 0.36, 0.02]} position={[0, -0.84, 0.14]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          )}

          {/* Sturdy Armored Boot */}
          <Box args={[0.22, 0.14, 0.36]} position={[0, -1.16, 0.08]} castShadow>
            <primitive object={underArmorMat} attach="material" />
          </Box>
          {/* Boot sole tread details */}
          <Box args={[0.24, 0.04, 0.38]} position={[0, -1.23, 0.08]}>
            <meshStandardMaterial color="#000000" metalness={0.1} />
          </Box>
        </group>

        {/* === RIGHT LEG (Thigh Armor, Knee, Shin, Holster & Boot) === */}
        <group ref={rightLegPivot} position={[0.2, -0.1, 0]}>
          {/* Thigh Guard Plate */}
          <Box args={[isJuggernaut ? 0.34 : 0.22, 0.58, isJuggernaut ? 0.34 : 0.22]} position={[0, -0.28, 0]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          {/* Side Thigh Holster Rig for secondary weapons */}
          {!isCivilian && (
            <group position={[0.13, -0.28, 0.02]} rotation={[0, 0, -0.05]}>
              <Box args={[0.08, 0.26, 0.14]} castShadow>
                <primitive object={underArmorMat} attach="material" />
              </Box>
              {/* Holstered weapon handle sticking out */}
              <Box args={[0.04, 0.12, 0.06]} position={[0, 0.16, 0.04]} rotation={[0.4, 0, 0]}>
                <meshStandardMaterial color="#000" />
              </Box>
            </group>
          )}
          {/* Side Thigh Glowing Accent Decals */}
          {!isCivilian && (
            <Box args={[0.02, 0.38, 0.12]} position={[0.11, -0.28, -0.06]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          )}

          {/* Knee Pad */}
          <Box args={[isJuggernaut ? 0.22 : 0.14, isJuggernaut ? 0.22 : 0.14, 0.08]} position={[0, -0.58, 0.12]} rotation={[0.08, 0, 0]} castShadow>
            <primitive object={highlightMat} attach="material" />
          </Box>

          {/* Shin Armor Guard */}
          <Box args={[isJuggernaut ? 0.3 : 0.19, 0.52, isJuggernaut ? 0.3 : 0.19]} position={[0, -0.84, 0.04]} castShadow>
            <primitive object={armorMat} attach="material" />
          </Box>
          
          {/* Front Shin Emissive Tech lines */}
          {!isCivilian && (
            <Box args={[0.05, 0.36, 0.02]} position={[0, -0.84, 0.14]}>
              <primitive object={techGlowMat} attach="material" />
            </Box>
          )}

          {/* Sturdy Armored Boot */}
          <Box args={[0.22, 0.14, 0.36]} position={[0, -1.16, 0.08]} castShadow>
            <primitive object={underArmorMat} attach="material" />
          </Box>
          {/* Boot sole tread details */}
          <Box args={[0.24, 0.04, 0.38]} position={[0, -1.23, 0.08]}>
            <meshStandardMaterial color="#000000" metalness={0.1} />
          </Box>
        </group>

      </group>
    </group>
  );
};

export default CharacterModel;
