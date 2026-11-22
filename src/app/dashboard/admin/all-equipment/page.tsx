// src/app/dashboard/admin/all-equipment/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Eye, Trash2, X } from "lucide-react";
import type { Equipment } from "@/lib/types";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

// Badge colours for the three equipment approval states.
const statusBadge = (status: string) => {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default function AdminAllEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Fetch every listing, including items still waiting for approval.
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/equipment/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEquipment(res.data.items || []);
      } catch {
        toast.error("Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  // Approve or reject a listing, then reflect the change locally.
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setBusyId(id);
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.patch(
        `${backendUrl}/api/equipment/${id}/${status === "approved" ? "approve" : "reject"}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEquipment((prev) => prev.map((eq) => (eq._id === id ? { ...eq, status } : eq)));
      toast.success(`Equipment ${status}`);
    } catch {
      toast.error("Failed to update equipment status");
    } finally {
      setBusyId(null);
    }
  };

  // Permanently remove a listing (admin is allowed to delete any equipment).
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this equipment permanently?")) return;

    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.delete(`${backendUrl}/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipment((prev) => prev.filter((eq) => eq._id !== id));
      toast.success("Equipment deleted");
    } catch {
      toast.error("Failed to delete equipment");
    }
  };

  // Filtering is memoised so typing/tab switches stay instant.
  const visibleEquipment = useMemo(
    () => (filter === "all" ? equipment : equipment.filter((eq) => (eq.status || "pending") === filter)),
    [equipment, filter]
  );

  const pendingCount = equipment.filter((eq) => (eq.status || "pending") === "pending").length;

  if (loading) return <div>Loading equipment...</div>;

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: equipment.length },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "approved", label: "Approved", count: equipment.filter((eq) => eq.status === "approved").length },
    { key: "rejected", label: "Rejected", count: equipment.filter((eq) => eq.status === "rejected").length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Equipment</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review owner submissions and approve or reject listings.
          {pendingCount > 0 && <span className="text-yellow-600 font-medium"> {pendingCount} awaiting review.</span>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filter === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {visibleEquipment.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500">No equipment in this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Equipment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Owner</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Qty</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visibleEquipment.map((eq) => {
                const status = eq.status || "pending";
                return (
                  <tr key={eq._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={eq.imageURL}
                          alt={eq.name}
                          width={44}
                          height={44}
                          unoptimized
                          className="w-11 h-11 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{eq.name}</p>
                          <p className="text-xs text-slate-500">{eq.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{eq.ownerName || "—"}</p>
                      <p className="text-xs text-slate-500">{eq.ownerEmail || ""}</p>
                    </td>
                    <td className="px-6 py-4 font-bold">${eq.price}</td>
                    <td className="px-6 py-4">{eq.availableQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${statusBadge(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve"
                            disabled={busyId === eq._id}
                            onClick={() => updateStatus(eq._id, "approved")}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        {status !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject"
                            disabled={busyId === eq._id}
                            onClick={() => updateStatus(eq._id, "rejected")}
                          >
                            <X className="w-4 h-4 text-yellow-600" />
                          </Button>
                        )}
                        <Link href={`/all-equipment/${eq._id}`}>
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(eq._id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
