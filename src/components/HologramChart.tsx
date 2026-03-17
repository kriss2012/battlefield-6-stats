import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HologramChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const HologramBar: React.FC<{ position: [number, number, number], height: number, color: string, label: string }> = ({ position, height, color, label }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + height / 2 + Math.sin(time + position[0]) * 0.05;
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <Box ref={meshRef} args={[0.5, height, 0.5]} position={[0, height / 2, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.6} 
          emissive={color} 
          emissiveIntensity={2} 
        />
      </Box>
      <Text
        position={[0, -0.5, 0.5]}
        fontSize={0.2}
        color="white"
        font="/fonts/JetBrainsMono-Bold.woff" // Fallback to default if not found
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const HologramChart: React.FC<HologramChartProps> = ({ data, title }) => {
  return (
    <group>
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color="#60a5fa"
        font="/fonts/JetBrainsMono-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
      
      {data.map((item, i) => (
        <HologramBar 
          key={item.label}
          position={[(i - (data.length - 1) / 2) * 1.5, 0, 0]} 
          height={item.value / 10} 
          color={item.color}
          label={item.label}
        />
      ))}

      {/* Grid Floor */}
      <gridHelper args={[10, 10, 0x3b82f6, 0x1e293b]} position={[0, -0.1, 0]} />
    </group>
  );
};

export default HologramChart;
