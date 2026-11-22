// src/app/dashboard/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Box, DollarSign, ShoppingCart, Users, Clock, CheckCircle2 } from "lucide-react";
import type { AdminAnalytics } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Load the aggregated platform statistics.
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/analytics/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div className="text-center py-20 text-slate-500">Analytics unavailable.</div>;

  const { totals, monthlyBookings } = analytics;

  // Stat cards shown at the top of the page.
  const cards = [
    { label: "Total Users", value: totals.totalUsers, icon: <Users className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Total Equipment", value: totals.totalEquipment, icon: <Box className="w-5 h-5" />, color: "text-indigo-600" },
    { label: "Total Bookings", value: totals.totalBookings, icon: <ShoppingCart className="w-5 h-5" />, color: "text-purple-600" },
    { label: "Pending Approvals", value: totals.pendingApprovals, icon: <Clock className="w-5 h-5" />, color: "text-yellow-600" },
    { label: "Completed Rentals", value: totals.completedRentals, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600" },
    { label: "Total Revenue", value: `$${Number(totals.totalRevenue).toFixed(2)}`, icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-600" },
  ];

  // Largest monthly revenue drives the chart scale (never divide by zero).
  const maxRevenue = Math.max(...monthlyBookings.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">A quick overview of platform activity and earnings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border rounded-xl p-5 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`${card.color} bg-slate-50 p-2 rounded-lg`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Monthly Revenue</h2>
            <p className="text-sm text-slate-500">Booking value per month (last 12 months).</p>
          </div>
        </div>

        {monthlyBookings.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No booking data yet.</p>
        ) : (
          <div className="flex items-end gap-3 overflow-x-auto pb-2">
            {monthlyBookings.map((month) => {
              const height = Math.max((month.revenue / maxRevenue) * 100, 2);
              const label = `${MONTHS[month._id.month - 1]} ${String(month._id.year).slice(2)}`;

              return (
                <div key={`${month._id.year}-${month._id.month}`} className="flex-1 min-w-[48px] flex flex-col items-center gap-2">
                  <span className="text-[10px] text-slate-500">${Math.round(month.revenue)}</span>
                  <div className="w-full h-48 flex items-end" title={`${month.count} booking(s)`}>
                    <div className="w-full bg-primary/80 rounded-t transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-xs text-slate-600 whitespace-nowrap">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Bookings per Month</h2>
        {monthlyBookings.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No booking data yet.</p>
        ) : (
          <div className="space-y-3">
            {monthlyBookings.map((month) => {
              const maxCount = Math.max(...monthlyBookings.map((m) => m.count), 1);
              const width = Math.max((month.count / maxCount) * 100, 2);
              const label = `${MONTHS[month._id.month - 1]} ${month._id.year}`;

              return (
                <div key={`${month._id.year}-${month._id.month}-count`} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-slate-600">{label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: `${width}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-slate-700">{month.count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
