/**
 * @file Hero3D.tsx
 * @description Provides 3D visual components (NeuralCore and Hero3D) used in the hero section of the application.
 * These components create an interactive, animated 3D visualization representing an AI/neural core.
 * @usage Used on the landing page or hero sections to provide a visually striking, futuristic 3D centerpiece.
 * File: Hero3D.tsx
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, MeshWobbleMaterial, TorusKnot } from '@react-three/drei';
import ThreeScene from './ThreeScene';
import * as THREE from 'three';

/**
 * NeuralCore Component
 * 
 * Working:
 * 1. Uses refs to maintain direct access to the Three.js mesh objects.
 * 2. `useFrame` hook from @react-three/fiber is used to apply continuous rotation animations to the meshes on every frame render.
 * 3. Renders a complex group of 3D objects:
 *    - An inner sphere with MeshDistortMaterial for a fluid, pulsing effect.
 *    - A wireframe shell sphere for a technical, grid-like appearance.
 *    - An outer TorusKnot with MeshWobbleMaterial for a complex, wobbling orbital ring.
 *    - A dynamic particle system created by mapping over an array to render small emissive spheres in a spiral pattern.
 * @usage Embedded within a Canvas (usually via ThreeScene) to render the animated 3D core.
 */
const NeuralCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    outerRef.current.rotation.z = -time * 0.1;
    wireRef.current.rotation.y = -time * 0.4;
    wireRef.current.rotation.x = time * 0.1;
  });

  return (
    <group>
      {/* Inner Distorted Sphere */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#1e40af"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>

      {/* Wireframe Shell */}
      <Sphere ref={wireRef} args={[1.8, 32, 32]}>
        <meshStandardMaterial 
          color="#60a5fa" 
          wireframe 
          transparent 
          opacity={0.3} 
          emissive="#60a5fa"
          emissiveIntensity={2}
        />
      </Sphere>

      {/* Outer Wobbling Ring */}
      <TorusKnot ref={outerRef} args={[2.5, 0.02, 256, 32]}>
        <MeshWobbleMaterial
          color="#10b981"
          factor={0.8}
          speed={2}
          emissive="#065f46"
          emissiveIntensity={3}
        />
      </TorusKnot>

      {/* Dynamic Particles */}
      {[...Array(40)].map((_, i) => (
        <Sphere key={i} args={[0.03]} position={[
          Math.sin(i * 0.5) * (4 + Math.sin(i)),
          Math.cos(i * 0.5) * (4 + Math.cos(i)),
          Math.sin(i * 0.2) * 3
        ]}>
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#60a5fa" : "#34d399"} 
            emissive={i % 2 === 0 ? "#60a5fa" : "#34d399"} 
            emissiveIntensity={4} 
          />
        </Sphere>
      ))}
    </group>
  );
};

/**
 * Hero3D Component
 * 
 * Working:
 * 1. Wraps the NeuralCore in the ThreeScene environment to render the 3D scene.
 * 2. Adds decorative HTML overlays for the "HUD" (Heads Up Display) elements to give a futuristic UI vibe.
 * 3. Incorporates CSS blur, transitions, and hover effects on the background to enhance visual depth.
 * @usage Renders the complete 3D Hero section including the 3D core and UI overlays.
 */
const Hero3D: React.FC = () => {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative group pointer-events-auto">
      <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
      <ThreeScene autoRotate enableZoom={false}>
        <NeuralCore />
      </ThreeScene>
      
      {/* HUD Elements Overlay */}
      <div className="absolute top-10 left-10 p-4 border-l-2 border-t-2 border-blue-500/30 rounded-tl-3xl pointer-events-none">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Core Status: Active</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-gray-500 uppercase">Neural Integrity: 98.4%</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 p-4 border-r-2 border-b-2 border-blue-500/30 rounded-br-3xl text-right pointer-events-none">
        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-2">Sync Matrix</span>
        <div className="flex flex-col items-end gap-1 opacity-40">
          <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500" />
          </div>
          <div className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-blue-500" />
          </div>
          <div className="h-1 w-8 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
