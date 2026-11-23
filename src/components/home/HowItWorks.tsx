// src/components/home/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Truck } from "lucide-react";

// Three-step explanation of the rental process.
const steps = [
  {
    title: "Browse & Compare",
    description: "Search by name or location, filter by category, rental type, price, and availability.",
    icon: Search,
  },
  {
    title: "Book in Minutes",
    description: "Pick your dates and quantity, add delivery details, and pay securely with Stripe.",
    icon: CalendarCheck,
  },
  {
    title: "Get It Delivered",
    description: "The owner confirms your booking and hands over the equipment, ready to use.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-4 text-slate-600">Rent the equipment you need in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="bg-white border rounded-xl p-8 text-center relative"
              >
                <span className="absolute top-4 right-5 text-4xl font-black text-slate-100">
                  {index + 1}
                </span>
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
