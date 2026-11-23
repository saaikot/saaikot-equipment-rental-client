// src/components/home/Reviews.tsx
"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Customer testimonials shown on the home page.
const reviews = [
  {
    name: "Ayesha Rahman",
    role: "Event Planner",
    rating: 5,
    comment:
      "RentEasy saved our event. The sound system was spotless, delivered on time, and the owner even helped us set it up.",
  },
  {
    name: "Daniel Carter",
    role: "Photographer",
    rating: 5,
    comment:
      "I rented a Canon R5 for a weekend shoot. Transparent pricing, easy checkout, and the gear was in perfect condition.",
  },
  {
    name: "Maya Patel",
    role: "Construction Manager",
    rating: 4,
    comment:
      "The backhoe we booked arrived early and worked flawlessly. Support answered my questions within minutes.",
  },
  {
    name: "Jonas Weber",
    role: "Farmer",
    rating: 5,
    comment:
      "Affordable weekly rates and verified owners. I no longer need to buy seasonal equipment I only use twice a year.",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">What Our Customers Say</h2>
          <p className="mt-4 text-slate-600">Real feedback from renters and equipment owners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-slate-50 border rounded-xl p-6 flex flex-col h-full"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-4 h-4 ${
                      starIndex < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
