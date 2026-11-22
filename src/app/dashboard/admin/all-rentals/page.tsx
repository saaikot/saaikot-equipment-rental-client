// src/app/dashboard/admin/all-rentals/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { Rental } from "@/lib/types";

const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

// Payment badge colours.
const paymentBadge = (status: string) =>
  status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";

export default function AdminAllRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load every booking in the platform (admin endpoint).
  useEffect(() => {
    const loadRentals = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRentals(res.data.bookings || []);
      } catch {
        toast.error("Failed to load rentals");
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  // Admins can move a booking through its lifecycle from this table.
  const updateStatus = async (id: string, bookingStatus: string) => {
    setUpdatingId(id);
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.patch(
        `${backendUrl}/api/bookings/${id}/status`,
        { bookingStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRentals((prev) => prev.map((r) => (r._id === id ? { ...r, bookingStatus } : r)));
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div>Loading rentals...</div>;

  const paidRevenue = rentals
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Rentals</h1>
        <p className="text-sm text-slate-500 mt-1">Every booking made by customers across all owners.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: rentals.length },
          { label: "Paid", value: rentals.filter((r) => r.paymentStatus === "paid").length },
          { label: "Pending Payment", value: rentals.filter((r) => r.paymentStatus !== "paid").length },
          { label: "Paid Revenue", value: `$${paidRevenue.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500">No rentals have been made yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Equipment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Dates</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Payment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Booking Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rentals.map((rental) => (
                <tr key={rental._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{rental.customerName || "—"}</p>
                    <p className="text-xs text-slate-500">{rental.customerEmail || ""}</p>
                    {rental.contactNumber && <p className="text-xs text-slate-500">{rental.contactNumber}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {rental.equipmentId?.imageURL && (
                        <Image
                          src={rental.equipmentId.imageURL}
                          alt={rental.equipmentId.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{rental.equipmentId?.name || "Deleted equipment"}</p>
                        <p className="text-xs text-slate-500">Qty: {rental.requiredQuantity ?? 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(rental.rentalStartDate).toLocaleDateString()} -{" "}
                    {new Date(rental.rentalEndDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold">${rental.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadge(rental.paymentStatus)}`}>
                      {rental.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={rental.bookingStatus}
                      disabled={updatingId === rental._id}
                      onChange={(e) => updateStatus(rental._id, e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
