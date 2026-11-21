// src/components/home/Categories.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { name: "Construction Equipment", icon: "🏗️" },
  { name: "Photography Equipment", icon: "📷" },
  { name: "Vehicles & Transportation", icon: "🚚" },
  { name: "Agriculture Equipment", icon: "🚜" },
  { name: "Electronics", icon: "💻" },
  { name: "Event Equipment", icon: "🎪" },
];

export default function Categories() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Popular Categories</h2>
          <p className="mt-4 text-slate-600">Explore equipment by category</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link 
                href={`/all-equipment?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:shadow-md hover:bg-slate-100 transition-all border border-slate-100 h-full"
              >
                <span className="text-4xl mb-4">{cat.icon}</span>
                <span className="text-sm font-semibold text-center text-slate-700">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}