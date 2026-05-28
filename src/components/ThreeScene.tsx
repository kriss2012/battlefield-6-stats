/**
 * @file ThreeScene.tsx
 * @description Provides a reusable 3D canvas environment using @react-three/fiber and @react-three/drei.
 * It handles the base rendering setup, camera, lighting, shadows, post-processing effects, and environment mapping.
 * @usage Use this component as a wrapper for any 3D models or scenes to ensure consistent rendering quality and effects.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/**
 * Props for the ThreeScene component.
 */
interface ThreeSceneProps {
  /** The 3D elements (meshes, models, groups) to render inside the scene */
  children: React.ReactNode;
  /** Whether the camera should automatically rotate around the scene */
  autoRotate?: boolean;
  /** Whether the user can zoom in and out using the mouse wheel */
  enableZoom?: boolean;
  /** The intensity of the ambient light in the scene */
  intensity?: number;
  /** The HDRI environment preset for realistic reflections and lighting */
  environment?: 'city' | 'apartment' | 'lobby' | 'night' | 'studio' | 'sunset' | 'warehouse';
}

/**
 * ThreeScene Component
 * 
 * Working:
 * 1. Initializes a Three.js Canvas with shadows and high device pixel ratio.
 * 2. Sets up a default PerspectiveCamera.
 * 3. Uses Suspense to handle asynchronous loading of 3D assets and environments.
 * 4. Configures lighting (ambient, spot, point) and realistic contact shadows.
 * 5. Wraps the children in a Float component for a subtle floating animation.
 * 6. Applies post-processing effects (Bloom, Noise, Vignette, Chromatic Aberration) for a cinematic look.
 * 7. Adds OrbitControls for user interaction.
 */
const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  children, 
  autoRotate = false, 
  enableZoom = false, 
  intensity = 0.5,
  environment = 'city'
}) => {
  return (
    <div className="w-full h-full min-h-[400px] relative preserve-3d">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={intensity} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {children}
          </Float>
          
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4.5} 
          />
          
          <Environment preset={environment} />
          
          <EffectComposer multisampling={4}>
            <Bloom 
              intensity={1.5} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300} 
            />
            <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration 
              blendFunction={BlendFunction.NORMAL} 
              offset={new THREE.Vector2(0.001, 0.001)} 
            />
          </EffectComposer>

          <OrbitControls 
            enablePan={false} 
            enableZoom={enableZoom} 
            autoRotate={autoRotate} 
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Tactical UI Scanlines Overlay local to the canvas */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_2px]" />
      </div>
    </div>
  );
};

export default ThreeScene;
