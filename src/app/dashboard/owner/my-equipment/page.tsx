// src/app/dashboard/owner/my-equipment/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export default function MyEquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEquipment = async () => {
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      const res = await axios.get(`${backendUrl}/api/equipment/owner/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipment(res.data.items || []);
    } catch (error) {
      toast.error("Failed to load your equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.delete(`${backendUrl}/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Equipment deleted successfully");
      setEquipment(equipment.filter((eq) => eq._id !== id));
    } catch (error) {
      toast.error("Failed to delete equipment");
    }
  };

  if (loading) return <div>Loading your equipment...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Equipment</h1>
        <Link href="/dashboard/owner/add-equipment">
          <Button>Add New Equipment</Button>
        </Link>
      </div>
      
      {equipment.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500 mb-4">You haven't added any equipment yet.</p>
          <Link href="/dashboard/owner/add-equipment">
            <Button>Add Your First Equipment</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Equipment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Qty</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {equipment.map((eq) => (
                <tr key={eq._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={eq.imageURL} alt="eq" className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium">{eq.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{eq.category}</td>
                  <td className="px-6 py-4 font-bold">${eq.price}</td>
                  <td className="px-6 py-4">{eq.availableQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      eq.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      eq.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {eq.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/all-equipment/${eq._id}`}>
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-blue-600" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(eq._id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}