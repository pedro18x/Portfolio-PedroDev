"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center w-full h-screen text-center"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-dark">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Particles />
        </Canvas>
      </div>
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-extrabold text-white md:text-8xl">
          Pedro Ernesto
        </h1>
        <p className="mt-4 text-2xl text-gray-200 md:text-3xl">
          Desenvolvedor Full Stack
        </p>
      </motion.div>
    </section>
  );
};

function Particles() {
  const ref = useRef<THREE.Points>(null!);

  const [positions] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    return [positions];
  }, []);

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
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default Hero; 