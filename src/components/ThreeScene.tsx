import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface ThreeSceneProps {
  children: React.ReactNode;
  autoRotate?: boolean;
  enableZoom?: boolean;
  intensity?: number;
  environment?: 'city' | 'apartment' | 'lobby' | 'night' | 'studio' | 'sunset' | 'warehouse';
}

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
