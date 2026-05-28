/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

const VintageComputer: React.FC<{ position?: [number, number, number], rotation?: [number, number, number], scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const beigeMat = <meshStandardMaterial color="#e5e5cb" metalness={0.1} roughness={0.8} />;
  const darkGreyMat = <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.7} />;
  const blackMat = <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.9} />;
  const matrixGreen = <meshBasicMaterial color="#22c55e" toneMapped={false} />;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* PC Tower */}
      <group position={[1.2, 0.8, 0]}>
        {/* Main Casing */}
        <Box args={[0.8, 1.6, 1.4]} castShadow receiveShadow>
          {beigeMat}
        </Box>
        {/* Floppy Drives */}
        <Box args={[0.6, 0.15, 0.05]} position={[0, 0.5, 0.7]} castShadow>
          {darkGreyMat}
        </Box>
        <Box args={[0.6, 0.15, 0.05]} position={[0, 0.25, 0.7]} castShadow>
          {darkGreyMat}
        </Box>
        {/* Vents */}
        {[0, 1, 2, 3, 4].map(i => (
          <Box key={`vent-${i}`} args={[0.5, 0.05, 0.05]} position={[0, -0.2 - i*0.1, 0.7]}>
            {darkGreyMat}
          </Box>
        ))}
        {/* Power Button */}
        <Box args={[0.1, 0.1, 0.05]} position={[-0.2, 0, 0.7]}>
          {darkGreyMat}
        </Box>
      </group>

      {/* CRT Monitor */}
      <group position={[-0.5, 1.0, 0]}>
        {/* Monitor Base Stand */}
        <Box args={[0.6, 0.1, 0.6]} position={[0, -0.95, 0]} castShadow>
          {beigeMat}
        </Box>
        <Cylinder args={[0.15, 0.15, 0.2]} position={[0, -0.8, 0]} castShadow>
          {beigeMat}
        </Cylinder>
        
        {/* Monitor Casing */}
        <Box args={[1.4, 1.2, 1.2]} position={[0, -0.1, 0]} castShadow receiveShadow>
          {beigeMat}
        </Box>
        <Box args={[1.2, 1.0, 0.8]} position={[0, -0.1, -0.3]} castShadow>
          {beigeMat}
        </Box>
        
        {/* Screen Bezel */}
        <Box args={[1.2, 1.0, 0.1]} position={[0, -0.1, 0.6]} castShadow>
          {darkGreyMat}
        </Box>

        {/* The Matrix Screen */}
        <Box args={[1.0, 0.8, 0.05]} position={[0, -0.1, 0.65]}>
          {blackMat}
        </Box>
        {/* Glowing Matrix text effect (simulated with green planes) */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`code-${i}`} position={[-0.4 + i*0.16, -0.1 + (Math.random()*0.2 - 0.1), 0.68]}>
            <planeGeometry args={[0.02, 0.4 + Math.random()*0.3]} />
            {matrixGreen}
          </mesh>
        ))}

        {/* LED Light */}
        <mesh position={[0.5, -0.5, 0.66]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          {matrixGreen}
        </mesh>
      </group>

      {/* Keyboard */}
      <group position={[-0.5, 0.05, 1.5]} rotation={[0.1, 0, 0]}>
        {/* Keyboard Base */}
        <Box args={[1.8, 0.1, 0.6]} castShadow receiveShadow>
          {beigeMat}
        </Box>
        
        {/* Key Layout (Simplified blocks) */}
        {/* Main keys */}
        <Box args={[1.1, 0.05, 0.4]} position={[-0.25, 0.05, 0]} castShadow>
          {darkGreyMat}
        </Box>
        {/* Numpad */}
        <Box args={[0.3, 0.05, 0.4]} position={[0.6, 0.05, 0]} castShadow>
          {darkGreyMat}
        </Box>
        {/* Function keys */}
        <Box args={[1.1, 0.05, 0.08]} position={[-0.25, 0.05, -0.22]} castShadow>
          {darkGreyMat}
        </Box>
      </group>
      
      {/* Mouse */}
      <group position={[0.7, 0.05, 1.5]}>
        <Box args={[0.2, 0.1, 0.3]} castShadow>
          {beigeMat}
        </Box>
        <Box args={[0.05, 0.02, 0.1]} position={[0, 0.05, -0.05]}>
          {darkGreyMat}
        </Box>
      </group>

    </group>
  );
};

export default VintageComputer;
