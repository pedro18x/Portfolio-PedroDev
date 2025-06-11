"use client";

import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export function Particles() {
  const ref = useRef<THREE.Points>(null!);

  // Create a memoized array of random positions for the particles.
  // This ensures the calculation only runs once.
  const [positions] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      // Distribute particles in a cube
      positions[i] = (Math.random() - 0.5) * 10;
    }
    return [positions];
  }, []);

  // On every frame, update the rotation of the points object.
  useFrame((state, delta) => {
    ref.current.rotation.x += delta / 15;
    ref.current.rotation.y += delta / 20;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true} // Makes particles smaller further away
        depthWrite={false} // Prevents particles from blocking each other
      />
    </Points>
  );
} 