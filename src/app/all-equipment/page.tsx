// src/app/all-equipment/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Equipment } from "@/lib/types";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

function AllEquipmentContent() {
  const searchParams = useSearchParams();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Search / filter / sort state (Challenge 1: server-side query params).
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [rentalType, setRentalType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("recent");

  // Fetch data whenever a filter or the page changes.
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        // Build the query string for server-side filtering and sorting.
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (rentalType) query.append("rentalType", rentalType);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (availability) query.append("availability", availability);
        if (sort) query.append("sort", sort);
        query.append("page", String(page));
        query.append("limit", "9");

        const res = await axios.get(`${backendUrl}/api/equipment?${query.toString()}`);
        setEquipment(res.data.items || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch equipment", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce so typing in the search box does not fire a request per keystroke.
    const delayDebounceFn = setTimeout(fetchEquipment, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category, rentalType, minPrice, maxPrice, availability, sort, page]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">All Equipment</h1>
          <p className="text-slate-600">Browse our collection of high-quality rental equipment.</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Sort */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Rental Type */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={rentalType}
              onChange={(e) => {
                setRentalType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Rental Types</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            {/* Price Range */}
            <Input
              type="number"
              min="0"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
            />

            {/* Availability */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any Availability</option>
              <option value="available">In Stock</option>
              <option value="unavailable">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-slate-500 mb-4">
            Showing {equipment.length} of {total} equipment item{total === 1 ? "" : "s"}
          </p>
        )}

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
            {equipment.map((item) => {
              const inStock = item.availableQuantity > 0;
              return (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                  <div className="relative h-48">
                    <Image src={item.imageURL} alt={item.name} fill unoptimized className="object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-900">
                      {item.rentalType}
                    </div>
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                        inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inStock ? `${item.availableQuantity} in stock` : "Out of stock"}
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <div className="text-xs text-primary font-semibold mb-1">{item.category}</div>
                    <h3 className="text-lg font-bold mb-2 truncate">{item.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-slate-900">
                          ${item.price}{" "}
                          <span className="text-xs font-normal text-slate-500">/{item.rentalType}</span>
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[100px]">{item.location}</span>
                      </div>
                      <Link href={`/all-equipment/${item._id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllEquipmentPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading equipment...</div>}>
      <AllEquipmentContent />
    </Suspense>
  );
}
