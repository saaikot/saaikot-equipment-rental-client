// src/app/dashboard/my-rentals/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/bookings/my-rentals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRentals(res.data.bookings || []);
      } catch (error) {
        toast.error("Failed to load rentals");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  if (loading) return <div>Loading rentals...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Rentals</h1>
      
      {rentals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500">You have no active or past rentals.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Equipment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Dates</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Payment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rentals.map((rental) => (
                <tr key={rental._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={rental.equipmentId?.imageURL} alt="eq" className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium">{rental.equipmentId?.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(rental.rentalStartDate).toLocaleDateString()} - {new Date(rental.rentalEndDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold">${rental.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rental.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rental.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rental.bookingStatus === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rental.bookingStatus}
                    </span>
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