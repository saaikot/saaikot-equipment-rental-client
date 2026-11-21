// src/app/dashboard/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Favorite } from "@/lib/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data.favorites || []);
      } catch {
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (equipmentId: string) => {
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.delete(`${backendUrl}/api/favorites/${equipmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removed from favorites");
      setFavorites(favorites.filter(fav => fav.equipmentId?._id !== equipmentId));
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) return <div>Loading favorites...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500">You haven&apos;t added any equipment to favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const eq = fav.equipmentId;
            if (!eq) return null; // In case equipment was deleted
            
            return (
              <div key={fav._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="relative h-40">
                  <Image src={eq.imageURL} alt={eq.name} fill unoptimized className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold">{eq.name}</h3>
                  <p className="text-sm text-primary font-semibold">${eq.price} / {eq.rentalType}</p>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/all-equipment/${eq._id}`} className="flex-1">
                      <Button className="w-full" size="sm">View</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleRemove(eq._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}