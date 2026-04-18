import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedGlobe({ aqi = 100 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  // Color based on AQI
  const getColor = () => {
    if (aqi > 300) return '#ef4444'; // Red
    if (aqi > 200) return '#f97316'; // Orange
    if (aqi > 100) return '#eab308'; // Yellow
    return '#22d3ee'; // Cyan
  };

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <MeshDistortMaterial
        color={getColor()}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive={getColor()}
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
}

export default function AQIGlobe({ aqi = 100 }: { aqi?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
        <AnimatedGlobe aqi={aqi} />
      </Canvas>
    </div>
  );
}
