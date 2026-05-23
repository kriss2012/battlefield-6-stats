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
}

const CharacterModel: React.FC<CharacterModelProps> = ({
  color = '#3b82f6',
  type = 'player',
  isMoving = false,
  isFiring = false,
  scale = 1.0,
  gender = 'male',
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
  const armorColor = isFriendly ? color : type === 'boss' ? '#3f1a24' : '#1e293b';
  const highlightColor = isFriendly ? '#60a5fa' : type === 'boss' ? '#ef4444' : '#f97316';
  
  // Apply visual size scale factor
  const finalScale = scale * (type === 'boss' ? 1.4 : type === 'enemy' ? 1.05 : 1.0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Core breathing effect
    if (chestRef.current) {
      const pulse = 1.0 + Math.sin(time * 3) * 0.05;
      chestRef.current.scale.set(pulse, pulse, pulse);
    }

    if (isMoving) {
      // Running animation
      const speed = 10;
      const angle = 0.6;
      const swing = Math.sin(time * speed) * angle;

      // Legs swing in opposition
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = swing;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -swing;

      // Arms swing in opposition to legs
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -swing * 0.7;
      if (rightArmPivot.current) {
        if (isFiring) {
          // Keep shooting arm pointing forward with recoil noise
          rightArmPivot.current.rotation.x = -Math.PI / 2 + Math.sin(time * 30) * 0.05;
        } else {
          rightArmPivot.current.rotation.x = swing * 0.7;
        }
      }

      // Torso bobs up and down while running
      if (modelRef.current) {
        modelRef.current.position.y = Math.abs(Math.sin(time * speed * 2)) * 0.08;
      }
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(time * speed) * 0.05;
      }
    } else {
      // Idle breathing animations
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

    // Gun recoil kickback
    if (isFiring && rightArmPivot.current) {
      rightArmPivot.current.position.z = -0.05;
    } else if (rightArmPivot.current) {
      rightArmPivot.current.position.z = 0;
    }
  });

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      {/* Dynamic Animated Root */}
      <group ref={modelRef} position={[0, 0, 0]}>
        
        {/* === NECK === */}
        <Cylinder args={[0.1, 0.15, 0.2, 8]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
        </Cylinder>

        {/* === HEAD & HELMET === */}
        <group ref={headGroup} position={[0, 0.9, 0]}>
          {/* Main Helmet Dome */}
          <Sphere args={[0.3, 16, 16]} position={[0, 0.15, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.9} roughness={0.1} />
          </Sphere>
          {/* Futuristic Ear Plates */}
          <Box args={[0.08, 0.15, 0.15]} position={[0.3, 0.15, 0]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          <Box args={[0.08, 0.15, 0.15]} position={[-0.3, 0.15, 0]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          {/* Tactical Visor (Glows!) */}
          <Box args={[0.42, 0.1, 0.15]} position={[0, 0.2, 0.22]} castShadow>
            <meshStandardMaterial 
              color={visorColor} 
              emissive={visorColor} 
              emissiveIntensity={3} 
              metalness={0.1} 
              roughness={0.1} 
            />
          </Box>
          {/* Antenna / Communication Pin */}
          <Cylinder args={[0.015, 0.015, 0.25, 4]} position={[0.22, 0.4, -0.1]} rotation={[0.2, 0, -0.1]} castShadow>
            <meshStandardMaterial color={highlightColor} metalness={0.9} />
          </Cylinder>
        </group>

        {/* === TORSO === */}
        {/* Upper Chest Armor */}
        <Box args={[gender === 'male' ? 0.7 : 0.55, 0.7, gender === 'male' ? 0.45 : 0.4]} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color={armorColor} metalness={0.85} roughness={0.15} />
        </Box>
        {/* Lower Stomach Section */}
        <Box args={[gender === 'male' ? 0.55 : 0.45, 0.4, 0.35]} position={[0, 0.05, 0]} castShadow>
          <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.4} />
        </Box>
        {/* Spine/Exo-frame Element */}
        <Cylinder args={[0.05, 0.08, 0.9, 8]} position={[0, 0.3, -0.18]} rotation={[0.1, 0, 0]} castShadow>
          <meshStandardMaterial color={highlightColor} metalness={0.9} />
        </Cylinder>
        
        {/* Glow Reactor Core (Chest Center) */}
        <Sphere ref={chestRef} args={[0.08, 16, 16]} position={[0, 0.45, 0.23]}>
          <meshStandardMaterial 
            color={visorColor} 
            emissive={visorColor} 
            emissiveIntensity={4} 
          />
        </Sphere>
        
        {/* Shoulder Guards (Pauldrons) */}
        <Box args={[0.25, 0.22, 0.35]} position={[gender === 'male' ? 0.42 : 0.35, 0.7, 0]} castShadow>
          <meshStandardMaterial color={armorColor} metalness={0.9} />
        </Box>
        <Box args={[0.25, 0.22, 0.35]} position={[gender === 'male' ? -0.42 : -0.35, 0.7, 0]} castShadow>
          <meshStandardMaterial color={armorColor} metalness={0.9} />
        </Box>

        {/* Tactical Ammo Pouches on Belt */}
        <Box args={[0.12, 0.15, 0.12]} position={[0.15, -0.12, 0.18]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Box>
        <Box args={[0.12, 0.15, 0.12]} position={[-0.15, -0.12, 0.18]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Box>

        {/* === LEFT ARM === */}
        <group ref={leftArmPivot} position={[gender === 'male' ? -0.45 : -0.38, 0.65, 0]}>
          {/* Left Upper Arm Mesh */}
          <Box args={[0.18, 0.45, 0.18]} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          {/* Left Forearm & Elbow Guard */}
          <Box args={[0.16, 0.45, 0.16]} position={[0, -0.55, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.8} />
          </Box>
          {/* Left Hand */}
          <Sphere args={[0.07, 8, 8]} position={[0, -0.78, 0.1]} castShadow>
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </Sphere>
        </group>

        {/* === RIGHT ARM (HOLDING GUN) === */}
        <group ref={rightArmPivot} position={[gender === 'male' ? 0.45 : 0.38, 0.65, 0]}>
          {/* Right Upper Arm Mesh */}
          <Box args={[0.18, 0.45, 0.18]} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          {/* Right Forearm & Elbow Guard */}
          <Box args={[0.16, 0.45, 0.16]} position={[0, -0.55, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.8} />
          </Box>
          {/* Right Hand */}
          <Sphere args={[0.07, 8, 8]} position={[0, -0.78, 0.1]} castShadow>
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </Sphere>
          
          {/* Futuristic Tactical Rifle */}
          <group position={[0.05, -0.78, 0.25]} rotation={[0, -Math.PI / 2, 0.1]}>
            {/* Rifle Body */}
            <Box args={[0.7, 0.12, 0.07]} castShadow>
              <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
            </Box>
            {/* Hologram Scope */}
            <Box args={[0.18, 0.06, 0.05]} position={[0.1, 0.08, 0]} castShadow>
              <meshStandardMaterial color="#1f2937" emissive={visorColor} emissiveIntensity={1} />
            </Box>
            {/* Long Steel Barrel */}
            <Cylinder args={[0.02, 0.02, 0.4, 8]} position={[-0.45, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshStandardMaterial color="#374151" metalness={1} roughness={0.2} />
            </Cylinder>
            {/* Underbarrel Laser Pointer */}
            <Cylinder args={[0.015, 0.015, 0.15, 8]} position={[-0.3, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color={highlightColor} />
            </Cylinder>
            {/* Ammo Clip */}
            <Box args={[0.08, 0.2, 0.05]} position={[-0.05, -0.12, 0]} rotation={[0, 0, -0.3]} castShadow>
              <meshStandardMaterial color="#1f2937" />
            </Box>
            {/* Glowing tracer muzzle effect */}
            {isFiring && (
              <Sphere args={[0.04]} position={[-0.68, 0.02, 0]}>
                <meshBasicMaterial color="#f59e0b" />
              </Sphere>
            )}
          </group>
        </group>

        {/* === LEFT LEG === */}
        <group ref={leftLegPivot} position={[-0.2, -0.1, 0]}>
          {/* Thigh Plate */}
          <Box args={[0.22, 0.6, 0.22]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.8} />
          </Box>
          {/* Calf / Shin Guard */}
          <Box args={[0.18, 0.6, 0.18]} position={[0, -0.85, 0.02]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          {/* Boot */}
          <Box args={[0.22, 0.12, 0.35]} position={[0, -1.18, 0.08]} castShadow>
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </Box>
        </group>

        {/* === RIGHT LEG === */}
        <group ref={rightLegPivot} position={[0.2, -0.1, 0]}>
          {/* Thigh Plate */}
          <Box args={[0.22, 0.6, 0.22]} position={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial color={armorColor} metalness={0.8} />
          </Box>
          {/* Calf / Shin Guard */}
          <Box args={[0.18, 0.6, 0.18]} position={[0, -0.85, 0.02]} castShadow>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </Box>
          {/* Boot */}
          <Box args={[0.22, 0.12, 0.35]} position={[0, -1.18, 0.08]} castShadow>
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </Box>
        </group>

      </group>
    </group>
  );
};

export default CharacterModel;
