/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: OrangeRobot.tsx
 * Date: 2026-05-28
 * #by Kiri Team
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const OrangeRobot: React.FC<{ position?: [number, number, number], rotation?: [number, number, number], scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const robotRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (robotRef.current) {
      robotRef.current.position.y = position[1] + Math.sin(t * 2) * 0.1; // hovering effect
    }
  });

  const orangeMat = <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.3} />;
  const greyMat = <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />;
  const greenMat = <meshStandardMaterial color="#22c55e" metalness={0.1} roughness={0.8} />;
  
  return (
    <group ref={robotRef} position={position} rotation={rotation} scale={scale}>
      {/* Torso */}
      <Sphere args={[0.5, 16, 16]} position={[0, 0.8, 0]} castShadow>
        {orangeMat}
      </Sphere>

      {/* Head */}
      <group position={[0, 1.5, 0]}>
        <Sphere args={[0.45, 16, 16]} castShadow>
          {orangeMat}
        </Sphere>
        
        {/* Eye socket and Eye */}
        <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[0, 0.05, 0.38]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#111827" />
        </Cylinder>
        <Sphere args={[0.15, 16, 16]} position={[0, 0.05, 0.4]}>
          <meshBasicMaterial color="#0ea5e9" />
        </Sphere>
        <Sphere args={[0.04, 8, 8]} position={[0.05, 0.08, 0.51]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
        
        {/* Antenna Ears */}
        <Cylinder args={[0.05, 0.05, 0.2]} position={[0.45, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          {greyMat}
        </Cylinder>
        <Cylinder args={[0.05, 0.05, 0.2]} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          {greyMat}
        </Cylinder>
        <Sphere args={[0.08]} position={[0.55, 0, 0]}>{orangeMat}</Sphere>
        <Sphere args={[0.08]} position={[-0.55, 0, 0]}>{orangeMat}</Sphere>

        {/* Green plant hair tuft */}
        <group position={[0, 0.45, 0]}>
          <Cylinder args={[0, 0.1, 0.3]} position={[0, 0.15, 0]} rotation={[0, 0, 0]}>{greenMat}</Cylinder>
          <Cylinder args={[0, 0.08, 0.25]} position={[0.1, 0.1, 0]} rotation={[0, 0, -0.4]}>{greenMat}</Cylinder>
          <Cylinder args={[0, 0.08, 0.25]} position={[-0.1, 0.1, 0]} rotation={[0, 0, 0.4]}>{greenMat}</Cylinder>
          <Cylinder args={[0, 0.08, 0.25]} position={[0, 0.1, 0.1]} rotation={[0.4, 0, 0]}>{greenMat}</Cylinder>
        </group>
      </group>

      {/* Arms */}
      <group position={[0.6, 1.0, 0]} rotation={[0, 0, 0.4]}>
        <Sphere args={[0.15]}>{greyMat}</Sphere>
        <Cylinder args={[0.08, 0.08, 0.4]} position={[0, -0.2, 0]}>{greyMat}</Cylinder>
        <Cylinder args={[0.12, 0.1, 0.3]} position={[0, -0.5, 0]}>{orangeMat}</Cylinder>
        <Sphere args={[0.12]} position={[0, -0.7, 0]}>{greyMat}</Sphere>
      </group>
      <group position={[-0.6, 1.0, 0]} rotation={[0, 0, -0.4]}>
        <Sphere args={[0.15]}>{greyMat}</Sphere>
        <Cylinder args={[0.08, 0.08, 0.4]} position={[0, -0.2, 0]}>{greyMat}</Cylinder>
        <Cylinder args={[0.12, 0.1, 0.3]} position={[0, -0.5, 0]}>{orangeMat}</Cylinder>
        <Sphere args={[0.12]} position={[0, -0.7, 0]}>{greyMat}</Sphere>
      </group>

      {/* Legs */}
      <group position={[0.25, 0.4, 0]}>
        <Sphere args={[0.12]}>{greyMat}</Sphere>
        <Cylinder args={[0.08, 0.08, 0.3]} position={[0, -0.15, 0]}>{greyMat}</Cylinder>
        <Box args={[0.2, 0.3, 0.2]} position={[0, -0.4, 0]}>{orangeMat}</Box>
        <Box args={[0.25, 0.1, 0.3]} position={[0, -0.55, 0.05]}>{orangeMat}</Box>
      </group>
      <group position={[-0.25, 0.4, 0]}>
        <Sphere args={[0.12]}>{greyMat}</Sphere>
        <Cylinder args={[0.08, 0.08, 0.3]} position={[0, -0.15, 0]}>{greyMat}</Cylinder>
        <Box args={[0.2, 0.3, 0.2]} position={[0, -0.4, 0]}>{orangeMat}</Box>
        <Box args={[0.25, 0.1, 0.3]} position={[0, -0.55, 0.05]}>{orangeMat}</Box>
      </group>
    </group>
  );
};

export default OrangeRobot;
