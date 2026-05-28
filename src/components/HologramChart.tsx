/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HologramChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const HologramBar: React.FC<{ position: [number, number, number], height: number, color: string, label: string }> = ({ position, height, color, label }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Smooth floating animation
    meshRef.current.position.y = height / 2 + Math.sin(time + pulseOffset) * 0.05;
    
    // Digital pulse effect on emissive intensity
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = 1.5 + Math.sin(time * 2 + pulseOffset) * 0.5;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <Box ref={meshRef} args={[0.7, height, 0.7]} position={[0, height / 2, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.5} 
          emissive={color} 
          emissiveIntensity={2} 
        />
      </Box>
      <Text
        position={[0, -0.6, 0.5]}
        fontSize={0.25}
        color="white"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6q507PS6oH_-jt-97vsc1O_L3Y.woff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {label}
      </Text>
    </group>
  );
};

const ScanningLine: React.FC = () => {
  const lineRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    lineRef.current.position.z = ((time * 2) % 10) - 5;
  });

  return (
    <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[10, 0.05]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

const HologramChart: React.FC<HologramChartProps> = ({ data, title }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.5}
        color="#60a5fa"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6q507PS6oH_-jt-97vsc1O_L3Y.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {title.toUpperCase()}
      </Text>
      
      {data.map((item, i) => (
        <HologramBar 
          key={item.label}
          position={[(i - (data.length - 1) / 2) * 1.8, 0, 0]} 
          height={item.value / 10} 
          color={item.color}
          label={item.label}
        />
      ))}

      {/* Grid Floor */}
      <group position={[0, -0.1, 0]}>
        <gridHelper args={[10, 10, 0x3b82f6, 0x1e293b]} />
        <ScanningLine />
      </group>
    </group>
  );
};

export default HologramChart;

