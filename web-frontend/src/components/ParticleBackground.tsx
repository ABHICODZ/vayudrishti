import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 2000, aqi = 100 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  const colors = useMemo(() => {
    const temp = [];
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Color based on AQI
      if (aqi > 300) {
        color.setHSL(0, 0.8, 0.5); // Red
      } else if (aqi > 200) {
        color.setHSL(0.1, 0.8, 0.5); // Orange
      } else if (aqi > 100) {
        color.setHSL(0.15, 0.8, 0.5); // Yellow
      } else {
        color.setHSL(0.5, 0.8, 0.5); // Cyan
      }
      
      temp.push(color.r, color.g, color.b);
    }
    return new Float32Array(temp);
  }, [count, aqi]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.075;
      
      // Pulsing effect based on AQI
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * (aqi / 500);
      mesh.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleBackground({ aqi = 100 }: { aqi?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles count={2000} aqi={aqi} />
      </Canvas>
    </div>
  );
}
