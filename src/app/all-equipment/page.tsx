// src/app/all-equipment/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Equipment } from "@/lib/types";

export default function AllEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Search, Filter & Sort (Challenge 1)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [sort, setSort] = useState("recent");

  const categories = [
    "Construction Equipment", "Photography Equipment",
    "Vehicles & Transportation", "Agriculture Equipment",
    "Electronics", "Event Equipment",
  ];

  // Fetch data whenever search, category, rentalType, or sort changes
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        
        // Build query string for server-side filtering
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (rentalType) query.append("rentalType", rentalType);
        if (sort) query.append("sort", sort);

        const res = await axios.get(`${backendUrl}/api/equipment?${query.toString()}`);
        setEquipment(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch equipment", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to prevent too many API calls
    const delayDebounceFn = setTimeout(() => {
      fetchEquipment();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, rentalType, sort]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">All Equipment</h1>
          <p className="text-slate-600">Browse our collection of high-quality rental equipment.</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or location..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Rental Type Filter */}
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={rentalType}
            onChange={(e) => setRentalType(e.target.value)}
          >
            <option value="">All Rental Types</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          {/* Sort Filter */}
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Recently Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading equipment...</div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-900">No equipment found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48">
                  <Image src={item.imageURL} alt={item.name} fill unoptimized className="object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-900">
                    {item.rentalType}
                  </div>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col">
                  <div className="text-xs text-primary font-semibold mb-1">{item.category}</div>
                  <h3 className="text-lg font-bold mb-2 truncate">{item.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-slate-900">
                        ${item.price} <span className="text-xs font-normal text-slate-500">/{item.rentalType}</span>
                      </span>
                      <span className="text-xs text-slate-500 truncate max-w-[100px]">{item.location}</span>
                    </div>
                    <Link href={`/all-equipment/${item._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}