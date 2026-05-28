/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, MeshDistortMaterial } from '@react-three/drei';
import ThreeScene from './ThreeScene';
import * as THREE from 'three';

import CharacterModel from './CharacterModel';

interface ArmoryViewProps {
  type: 'operator' | 'weapon';
  color?: string;
  accessory?: string;
}

const OperatorModel: React.FC<{ color: string }> = ({ color }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.4;
    groupRef.current.position.y = Math.sin(time) * 0.08 - 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Hologram Base */}
      <Cylinder args={[1.2, 1.3, 0.15, 32]} position={[0, -1.3, 0]}>
        <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.05, 32]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
      </Cylinder>
      
      {/* Detailed Character Model */}
      <group position={[0, -0.05, 0]}>
        <CharacterModel color={color} type="player" isMoving={false} scale={1.1} />
      </group>
    </group>
  );
};

const WeaponModel: React.FC<{ color: string, accessory?: string }> = ({ color, accessory }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.5;
    groupRef.current.position.y = Math.cos(time) * 0.1;
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      {/* Main Body */}
      <Box args={[3, 0.4, 0.2]} position={[0.5, 0, 0]}>
        <meshStandardMaterial color={color} metalness={1} roughness={0.05} emissive={color} emissiveIntensity={0.2} />
      </Box>
      
      {/* Handle */}
      <Box args={[0.3, 0.8, 0.2]} position={[-0.2, -0.4, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#050505" metalness={0.5} />
      </Box>
      
      {/* Scope */}
      {accessory === 'scope' ? (
        <group position={[0.4, 0.5, 0]}>
          <Box args={[0.8, 0.4, 0.3]}>
            <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
          </Box>
          <Cylinder args={[0.1, 0.1, 0.9, 16]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#000" metalness={1} />
          </Cylinder>
        </group>
      ) : (
        <Box args={[0.8, 0.3, 0.2]} position={[0.4, 0.35, 0]}>
          <meshStandardMaterial color="#111" metalness={0.8} />
        </Box>
      )}
      
      {/* Barrel & Suppressor */}
      {accessory === 'suppressor' ? (
        <Cylinder args={[0.15, 0.15, 1, 16]} position={[2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
        </Cylinder>
      ) : (
        <Cylinder args={[0.05, 0.05, 1.5, 16]} position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#050505" metalness={1} />
        </Cylinder>
      )}

      {/* Muzzle Glow */}
      <Sphere args={[0.03]} position={[3.2, 0, 0]}>
        <MeshDistortMaterial color="#3b82f6" speed={10} distort={1} emissive="#3b82f6" emissiveIntensity={50} />
      </Sphere>
    </group>
  );
};

const ArmoryView: React.FC<ArmoryViewProps> = ({ type, color = '#3b82f6', accessory }) => {
  return (
    <div className="w-full h-full relative">
      <ThreeScene autoRotate enableZoom={true} environment="studio">
        {type === 'operator' ? <OperatorModel color={color} /> : <WeaponModel color={color} accessory={accessory} />}
      </ThreeScene>
    </div>
  );
};

export default ArmoryView;
