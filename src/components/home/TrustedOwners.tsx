// src/components/home/TrustedOwners.tsx
"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headphones, ShieldCheck, Wallet } from "lucide-react";

// Trust signals that reassure first-time renters.
const benefits = [
  {
    title: "Verified Owners",
    description: "Every listing is reviewed and approved by our admin team before it goes live.",
    icon: BadgeCheck,
  },
  {
    title: "Protected Payments",
    description: "Stripe handles your card details. We never store sensitive payment information.",
    icon: ShieldCheck,
  },
  {
    title: "Fair, Clear Pricing",
    description: "Daily, weekly, and monthly rates shown up front — no hidden fees at checkout.",
    icon: Wallet,
  },
  {
    title: "Human Support",
    description: "Questions about a booking? Our team and owners are a message away.",
    icon: Headphones,
  },
];

export default function TrustedOwners() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Rent From Owners You Can Trust
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              RentEasy connects you with vetted equipment owners and protects every transaction.
              From a single camera lens to a full construction fleet, you get the gear you need
              without the risk.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "500+", label: "Equipment listings" },
                { value: "4.9/5", label: "Average rating" },
                { value: "24h", label: "Owner response time" },
                { value: "100%", label: "Secure checkout" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border rounded-xl p-6 bg-slate-50"
                >
                  <Icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
