"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";

export default function Hero() {
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
} 