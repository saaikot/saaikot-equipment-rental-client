// src/components/home/FeaturedEquipment.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Equipment } from "@/lib/types";

export default function FeaturedEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Calling our Express Backend endpoint
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await axios.get(`${backendUrl}/api/equipment/featured`);
        setEquipment(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch featured equipment", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <div className="text-center py-10">Loading equipment...</div>;
  if (equipment.length === 0) return <div className="text-center py-10">No equipment available yet.</div>;

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Equipment</h2>
            <p className="mt-4 text-slate-600">Top-rated equipment ready for rent</p>
          </div>
          <Link href="/all-equipment">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipment.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-48">
                  <Image src={item.imageURL} alt={item.name} fill unoptimized className="object-cover" />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="text-sm text-primary font-semibold mb-2">{item.category}</div>
                  <h3 className="text-xl font-bold mb-2 truncate">{item.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-slate-900">${item.price} <span className="text-sm font-normal text-slate-500">/ {item.rentalType}</span></span>
                      <span className="text-sm text-slate-500">{item.location}</span>
                    </div>
                    <Link href={`/all-equipment/${item._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}