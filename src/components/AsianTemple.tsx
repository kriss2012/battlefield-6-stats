import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

const AsianTemple: React.FC<{ position?: [number, number, number], rotation?: [number, number, number], scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const redMat = <meshStandardMaterial color="#b91c1c" metalness={0.1} roughness={0.9} />;
  const roofMat = <meshStandardMaterial color="#1f2937" metalness={0.2} roughness={0.8} />;
  const stoneMat = <meshStandardMaterial color="#9ca3af" metalness={0.1} roughness={1} />;
  const goldMat = <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />;
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Foundation Base */}
      <Box args={[6, 0.5, 4]} position={[0, 0.25, 0]} castShadow receiveShadow>
        {stoneMat}
      </Box>
      <Box args={[7, 0.2, 5]} position={[0, 0.1, 0]} castShadow receiveShadow>
        {stoneMat}
      </Box>

      {/* Front Steps */}
      <Box args={[1.5, 0.15, 1]} position={[0, 0.075, 2.5]} receiveShadow>{stoneMat}</Box>
      <Box args={[1.5, 0.15, 0.7]} position={[0, 0.225, 2.35]} receiveShadow>{stoneMat}</Box>
      <Box args={[1.5, 0.15, 0.4]} position={[0, 0.375, 2.2]} receiveShadow>{stoneMat}</Box>

      {/* Golden Guardian Lions (Simplified as abstract statues) */}
      <group position={[1.5, 0.7, 1.8]}>
        <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>{stoneMat}</Box>
        <Box args={[0.3, 0.5, 0.3]} position={[0, 0.45, 0]} castShadow>{goldMat}</Box>
      </group>
      <group position={[-1.5, 0.7, 1.8]}>
        <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>{stoneMat}</Box>
        <Box args={[0.3, 0.5, 0.3]} position={[0, 0.45, 0]} castShadow>{goldMat}</Box>
      </group>

      {/* Tier 1 Main Building */}
      <Box args={[4.5, 1.5, 2.8]} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>
      
      {/* Red Pillars for Tier 1 */}
      {[[-2.1, 2.1], [-2.1, -1.3], [2.1, 2.1], [2.1, -1.3], [-0.8, 2.1], [0.8, 2.1]].map((pos, i) => (
        <Cylinder key={`p1-${i}`} args={[0.1, 0.1, 1.5]} position={[pos[0]*1.05, 1.25, pos[1]*0.65]} castShadow>
          {redMat}
        </Cylinder>
      ))}

      {/* Dark Doorway */}
      <Box args={[1.2, 1.2, 0.1]} position={[0, 1.1, 1.4]} castShadow>
        <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* Tier 1 Roof */}
      <group position={[0, 2.2, 0]}>
        <Box args={[5.2, 0.4, 3.4]} castShadow>
          {roofMat}
        </Box>
        {/* Upturned Eaves */}
        <Box args={[5.4, 0.1, 0.2]} position={[0, 0.15, 1.7]} rotation={[-0.2, 0, 0]}>{roofMat}</Box>
        <Box args={[5.4, 0.1, 0.2]} position={[0, 0.15, -1.7]} rotation={[0.2, 0, 0]}>{roofMat}</Box>
      </group>

      {/* Tier 2 Building */}
      <Box args={[3.2, 1.2, 2.0]} position={[0, 3.0, 0]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>

      {/* Red Pillars for Tier 2 */}
      {[[-1.4, 1.4], [-1.4, -0.8], [1.4, 1.4], [1.4, -0.8]].map((pos, i) => (
        <Cylinder key={`p2-${i}`} args={[0.08, 0.08, 1.2]} position={[pos[0]*1.1, 3.0, pos[1]*0.7]} castShadow>
          {redMat}
        </Cylinder>
      ))}

      {/* Tier 2 Roof */}
      <group position={[0, 3.8, 0]}>
        <Box args={[4.0, 0.4, 2.6]} castShadow>
          {roofMat}
        </Box>
        {/* Upturned Eaves */}
        <Box args={[4.2, 0.1, 0.2]} position={[0, 0.15, 1.3]} rotation={[-0.2, 0, 0]}>{roofMat}</Box>
        <Box args={[4.2, 0.1, 0.2]} position={[0, 0.15, -1.3]} rotation={[0.2, 0, 0]}>{roofMat}</Box>
      </group>

      {/* Tier 3 Building (Top) */}
      <Box args={[2.0, 1.0, 1.4]} position={[0, 4.5, 0]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>

      {/* Tier 3 Roof */}
      <group position={[0, 5.2, 0]}>
        <Box args={[2.6, 0.5, 1.8]} castShadow>
          {roofMat}
        </Box>
        <Box args={[2.8, 0.1, 0.2]} position={[0, 0.2, 0.9]} rotation={[-0.2, 0, 0]}>{roofMat}</Box>
        <Box args={[2.8, 0.1, 0.2]} position={[0, 0.2, -0.9]} rotation={[0.2, 0, 0]}>{roofMat}</Box>
        
        {/* Top Ornament */}
        <Cylinder args={[0.05, 0.1, 0.6]} position={[0, 0.5, 0]}>
          {goldMat}
        </Cylinder>
        <Box args={[0.8, 0.2, 0.2]} position={[0, 0.3, 0]}>
          {roofMat}
        </Box>
      </group>
    </group>
  );
};

export default AsianTemple;
