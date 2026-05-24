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
  const chestRef = useRef<THREE.Mesh>(null!);
  
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

  // Adjust colors based on costume
  let armorColor = isFriendly ? color : type === 'boss' ? '#3f1a24' : '#1e293b';
  if (isCivilian) armorColor = '#111827'; // Black suit
  if (isGhillie) armorColor = '#4d533c'; // Dark green/brown
  if (isCatsuit) armorColor = '#000000'; // Pure black
  if (isJuggernaut) armorColor = '#475569'; // Heavy metal gray

  const highlightColor = isFriendly ? '#60a5fa' : type === 'boss' ? '#ef4444' : '#f97316';
  
  // Apply visual size scale factor
  let finalScale = scale * (type === 'boss' ? 1.4 : type === 'enemy' ? 1.05 : 1.0);
  if (isJuggernaut) finalScale *= 1.25; // Massive size

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (chestRef.current) {
      const pulse = 1.0 + Math.sin(time * 3) * 0.05;
      chestRef.current.scale.set(pulse, pulse, pulse);
    }

    if (isMoving) {
      const speed = 10;
      const angle = 0.6;
      const swing = Math.sin(time * speed) * angle;

      if (leftLegPivot.current) leftLegPivot.current.rotation.x = swing;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -swing;

      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -swing * 0.7;
      if (rightArmPivot.current) {
        if (isFiring) {
          rightArmPivot.current.rotation.x = -Math.PI / 2 + Math.sin(time * 30) * 0.05;
        } else {
          rightArmPivot.current.rotation.x = swing * 0.7;
        }
      }

      if (modelRef.current) {
        modelRef.current.position.y = Math.abs(Math.sin(time * speed * 2)) * 0.08;
      }
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(time * speed) * 0.05;
      }
    } else {
      const breathe = Math.sin(time * 2.0);
      
      if (leftLegPivot.current) leftLegPivot.current.rotation.set(0, 0, 0);
      if (rightLegPivot.current) rightLegPivot.current.rotation.set(0, 0, 0);
      
      if (leftArmPivot.current) {
        leftArmPivot.current.rotation.set(breathe * 0.03, 0, breathe * 0.02 - 0.05);
      }
      
      if (rightArmPivot.current) {
        if (isFiring) {
          rightArmPivot.current.rotation.x = -Math.PI / 2 + Math.sin(time * 30) * 0.05;
        } else {
          rightArmPivot.current.rotation.set(-breathe * 0.03, 0, -breathe * 0.02 + 0.05);
        }
      }

      if (headGroup.current) {
        headGroup.current.rotation.set(breathe * 0.02, Math.sin(time * 0.5) * 0.08, 0);
      }
      
      if (modelRef.current) {
        modelRef.current.position.y = breathe * 0.02;
      }
    }

    if (isFiring && rightArmPivot.current) {
      rightArmPivot.current.position.z = -0.05;
    } else if (rightArmPivot.current) {
      rightArmPivot.current.position.z = 0;
    }
  });

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      <group ref={modelRef} position={[0, 0, 0]}>
        
        {/* === NECK === */}
        <Cylinder args={[0.1, 0.15, 0.2, 8]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
        </Cylinder>

        {/* === HEAD & HELMET === */}
        <group ref={headGroup} position={[0, 0.9, 0]}>
          <Sphere args={[0.3, 16, 16]} position={[0, 0.15, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.9} roughness={0.1} />
          </Sphere>
          
          {/* Costume: Ghillie Suit Head Camo */}
          {isGhillie && (
            <group position={[0, 0.2, 0]}>
              {[...Array(8)].map((_, i) => (
                <Sphere key={i} args={[0.12, 8, 8]} position={[(Math.random() - 0.5) * 0.6, Math.random() * 0.3, (Math.random() - 0.5) * 0.6]}>
                  <meshStandardMaterial color="#3f4a2e" roughness={1} />
                </Sphere>
              ))}
            </group>
          )}

          {!isCivilian && !isCatsuit && (
            <>
              <Box args={[0.08, 0.15, 0.15]} position={[0.3, 0.15, 0]} castShadow>
                <meshStandardMaterial color="#111827" metalness={0.8} />
              </Box>
              <Box args={[0.08, 0.15, 0.15]} position={[-0.3, 0.15, 0]} castShadow>
                <meshStandardMaterial color="#111827" metalness={0.8} />
              </Box>
            </>
          )}

          {/* Costume: VR Visor vs Tactical Visor */}
          {isVR ? (
            <Box args={[0.5, 0.2, 0.2]} position={[0, 0.25, 0.2]} castShadow>
              <meshStandardMaterial color="#000" emissive={visorColor} emissiveIntensity={2} roughness={0.1} />
            </Box>
          ) : !isCivilian ? (
            <Box args={[0.42, 0.1, 0.15]} position={[0, 0.2, 0.22]} castShadow>
              <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={3} metalness={0.1} roughness={0.1} />
            </Box>
          ) : null}
          
          {/* Antenna */}
          {!isCivilian && !isCatsuit && (
            <Cylinder args={[0.015, 0.015, 0.25, 4]} position={[0.22, 0.4, -0.1]} rotation={[0.2, 0, -0.1]} castShadow>
              <meshStandardMaterial color={highlightColor} metalness={0.9} />
            </Cylinder>
          )}
        </group>

        {/* === TORSO === */}
        {/* Chest Plate - Adapts to Gender and Costume */}
        <Box 
          args={[
            isJuggernaut ? 1.0 : (gender === 'male' ? 0.7 : 0.55), 
            isJuggernaut ? 0.9 : 0.7, 
            isCatsuit ? 0.3 : (gender === 'male' ? 0.45 : 0.4)
          ]} 
          position={[0, 0.45, 0]} 
          castShadow
        >
          <meshStandardMaterial color={armorColor} metalness={isCivilian ? 0.1 : 0.85} roughness={isCivilian ? 0.9 : 0.15} />
        </Box>
        
        {/* Costume: Civilian Suit Tie */}
        {isCivilian && (
          <Box args={[0.08, 0.6, 0.02]} position={[0, 0.45, (gender === 'male' ? 0.23 : 0.21)]} castShadow>
            <meshStandardMaterial color="#ef4444" />
          </Box>
        )}

        {/* Costume: Ghillie Torso Camo */}
        {isGhillie && (
          <group position={[0, 0.4, 0]}>
            {[...Array(12)].map((_, i) => (
              <Box key={i} args={[0.2, 0.2, 0.2]} position={[(Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.6]}>
                <meshStandardMaterial color="#2c3321" roughness={1} />
              </Box>
            ))}
          </group>
        )}

        {/* Lower Stomach */}
        <Box 
          args={[
            isJuggernaut ? 0.8 : (gender === 'male' ? 0.55 : 0.45), 
            isJuggernaut ? 0.5 : 0.4, 
            isCatsuit ? 0.25 : 0.35
          ]} 
          position={[0, 0.05, 0]} 
          castShadow
        >
          <meshStandardMaterial color={isCatsuit ? armorColor : "#111827"} metalness={0.7} roughness={0.4} />
        </Box>

        {/* Spine */}
        {!isCivilian && !isCatsuit && (
          <Cylinder args={[0.05, 0.08, 0.9, 8]} position={[0, 0.3, -0.18]} rotation={[0.1, 0, 0]} castShadow>
            <meshStandardMaterial color={highlightColor} metalness={0.9} />
          </Cylinder>
        )}
        
        {/* Glow Reactor Core */}
        {!isCivilian && (
          <Sphere ref={chestRef} args={[0.08, 16, 16]} position={[0, 0.45, isJuggernaut ? 0.46 : 0.23]}>
            <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={4} />
          </Sphere>
        )}
        
        {/* Shoulder Guards (Pauldrons) */}
        {(!isCivilian && !isCatsuit) && (
          <>
            <Box 
              args={[
                isJuggernaut ? 0.4 : 0.25, 
                isJuggernaut ? 0.4 : 0.22, 
                isJuggernaut ? 0.5 : 0.35
              ]} 
              position={[gender === 'male' ? 0.42 : 0.35, 0.7, 0]} 
              castShadow
            >
              <meshStandardMaterial color={armorColor} metalness={0.9} />
            </Box>
            <Box 
              args={[
                isJuggernaut ? 0.4 : 0.25, 
                isJuggernaut ? 0.4 : 0.22, 
                isJuggernaut ? 0.5 : 0.35
              ]} 
              position={[gender === 'male' ? -0.42 : -0.35, 0.7, 0]} 
              castShadow
            >
              <meshStandardMaterial color={armorColor} metalness={0.9} />
            </Box>
          </>
        )}

        {/* Tactical Belt */}
        {!isCivilian && !isCatsuit && (
          <>
            <Box args={[0.12, 0.15, 0.12]} position={[0.15, -0.12, 0.18]} castShadow>
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </Box>
            <Box args={[0.12, 0.15, 0.12]} position={[-0.15, -0.12, 0.18]} castShadow>
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </Box>
          </>
        )}

        {/* === LEFT ARM === */}
        <group ref={leftArmPivot} position={[gender === 'male' ? -0.45 : -0.38, 0.65, 0]}>
          <Box args={[isJuggernaut ? 0.28 : 0.18, 0.45, isJuggernaut ? 0.28 : 0.18]} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color={isCivilian ? armorColor : "#111827"} metalness={0.8} />
          </Box>
          {!isCatsuit && (
            <Box args={[isJuggernaut ? 0.25 : 0.16, 0.45, isJuggernaut ? 0.25 : 0.16]} position={[0, -0.55, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={isCivilian ? 0.1 : 0.8} />
            </Box>
          )}
          <Sphere args={[isJuggernaut ? 0.12 : 0.07, 8, 8]} position={[0, -0.78, 0.1]} castShadow>
            <meshStandardMaterial color={isCivilian ? "#fca5a5" : "#1f2937"} roughness={0.6} />
          </Sphere>
        </group>

        {/* === RIGHT ARM === */}
        <group ref={rightArmPivot} position={[gender === 'male' ? 0.45 : 0.38, 0.65, 0]}>
          <Box args={[isJuggernaut ? 0.28 : 0.18, 0.45, isJuggernaut ? 0.28 : 0.18]} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color={isCivilian ? armorColor : "#111827"} metalness={0.8} />
          </Box>
          {!isCatsuit && (
            <Box args={[isJuggernaut ? 0.25 : 0.16, 0.45, isJuggernaut ? 0.25 : 0.16]} position={[0, -0.55, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
              <meshStandardMaterial color={armorColor} metalness={isCivilian ? 0.1 : 0.8} />
            </Box>
          )}
          <Sphere args={[isJuggernaut ? 0.12 : 0.07, 8, 8]} position={[0, -0.78, 0.1]} castShadow>
            <meshStandardMaterial color={isCivilian ? "#fca5a5" : "#1f2937"} roughness={0.6} />
          </Sphere>
          
          {/* Weapon based on costume */}
          <group position={[0.05, -0.78, 0.25]} rotation={[0, -Math.PI / 2, 0.1]}>
            {isHeavy || isJuggernaut ? (
              // Heavy LMG
              <>
                <Box args={[0.9, 0.18, 0.1]} castShadow><meshStandardMaterial color="#111827" metalness={0.9} /></Box>
                <Cylinder args={[0.04, 0.04, 0.6, 8]} position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#374151" metalness={1} /></Cylinder>
                <Cylinder args={[0.1, 0.1, 0.3, 16]} position={[-0.1, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#1f2937" /></Cylinder>
              </>
            ) : isGhillie ? (
              // Sniper Rifle
              <>
                <Box args={[1.2, 0.08, 0.05]} castShadow><meshStandardMaterial color="#2d3748" metalness={0.9} /></Box>
                <Cylinder args={[0.015, 0.015, 0.8, 8]} position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#1a202c" metalness={1} /></Cylinder>
                <Cylinder args={[0.04, 0.04, 0.3, 8]} position={[0.1, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#111827" /></Cylinder>
              </>
            ) : isCivilian ? (
              // Suppressed Pistol
              <>
                <Box args={[0.25, 0.08, 0.04]} position={[-0.1, 0, 0]} castShadow><meshStandardMaterial color="#111827" /></Box>
                <Cylinder args={[0.02, 0.02, 0.3, 8]} position={[-0.3, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#000" metalness={0.5} /></Cylinder>
              </>
            ) : (
              // Default Assault Rifle
              <>
                <Box args={[0.7, 0.12, 0.07]} castShadow><meshStandardMaterial color="#111827" metalness={0.9} /></Box>
                <Box args={[0.18, 0.06, 0.05]} position={[0.1, 0.08, 0]}><meshStandardMaterial color="#1f2937" emissive={visorColor} emissiveIntensity={1} /></Box>
                <Cylinder args={[0.02, 0.02, 0.4, 8]} position={[-0.45, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color="#374151" metalness={1} /></Cylinder>
                <Cylinder args={[0.015, 0.015, 0.15, 8]} position={[-0.3, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial color={highlightColor} /></Cylinder>
                <Box args={[0.08, 0.2, 0.05]} position={[-0.05, -0.12, 0]} rotation={[0, 0, -0.3]}><meshStandardMaterial color="#1f2937" /></Box>
              </>
            )}

            {isFiring && (
              <Sphere args={[0.06]} position={[-0.8, 0.02, 0]}>
                <meshBasicMaterial color="#f59e0b" />
              </Sphere>
            )}
          </group>
        </group>

        {/* === LEFT LEG === */}
        <group ref={leftLegPivot} position={[-0.2, -0.1, 0]}>
          <Box args={[isJuggernaut ? 0.3 : 0.22, 0.6, isJuggernaut ? 0.3 : 0.22]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color={isCatsuit ? armorColor : (isCivilian ? armorColor : armorColor)} metalness={isCivilian ? 0.1 : 0.8} />
          </Box>
          {!isCatsuit && (
            <Box args={[isJuggernaut ? 0.25 : 0.18, 0.6, isJuggernaut ? 0.25 : 0.18]} position={[0, -0.85, 0.02]} castShadow>
              <meshStandardMaterial color={isCivilian ? armorColor : "#111827"} metalness={isCivilian ? 0.1 : 0.8} />
            </Box>
          )}
          <Box args={[0.22, 0.12, 0.35]} position={[0, -1.18, 0.08]} castShadow>
            <meshStandardMaterial color={isCivilian ? "#111827" : "#1f2937"} roughness={0.7} />
          </Box>
        </group>

        {/* === RIGHT LEG === */}
        <group ref={rightLegPivot} position={[0.2, -0.1, 0]}>
          <Box args={[isJuggernaut ? 0.3 : 0.22, 0.6, isJuggernaut ? 0.3 : 0.22]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color={isCatsuit ? armorColor : (isCivilian ? armorColor : armorColor)} metalness={isCivilian ? 0.1 : 0.8} />
          </Box>
          {!isCatsuit && (
            <Box args={[isJuggernaut ? 0.25 : 0.18, 0.6, isJuggernaut ? 0.25 : 0.18]} position={[0, -0.85, 0.02]} castShadow>
              <meshStandardMaterial color={isCivilian ? armorColor : "#111827"} metalness={isCivilian ? 0.1 : 0.8} />
            </Box>
          )}
          <Box args={[0.22, 0.12, 0.35]} position={[0, -1.18, 0.08]} castShadow>
            <meshStandardMaterial color={isCivilian ? "#111827" : "#1f2937"} roughness={0.7} />
          </Box>
        </group>

      </group>
    </group>
  );
};

export default CharacterModel;
