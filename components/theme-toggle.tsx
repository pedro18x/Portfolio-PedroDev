"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-full transition-colors focus:outline-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="absolute inset-0 bg-background/5 border border-border rounded-full backdrop-blur-sm" />

      <div className="relative text-base sm:text-lg">
        {theme === "dark" ? (
          <FiSun />
        ) : (
          <FiMoon />
        )}
      </div>
    </motion.button>
  );
}; 