// src/components/home/Banner.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1920&auto=format&fit=crop')" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:px-8 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          Find the Perfect Equipment for Your Next Project
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl"
        >
          Rent high-quality construction, photography, and event equipment from trusted owners. Transparent, secure, and fast.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Link href="/all-equipment">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
              Browse Equipment
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}