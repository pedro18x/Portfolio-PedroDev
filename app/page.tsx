import { Metadata } from "next";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Stacks from "@/components/sections/stacks";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Briefcase, Home as HomeIcon, Layers, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingPaths } from "@/components/ui/background-paths";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/layout/footer";
import { HomeClient } from "@/components/layout/home-client";

export const metadata: Metadata = {
  title: 'Início',
};

export default function Home() {
  return <HomeClient />;
} 