// src/app/dashboard/admin/all-users/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { AdminUser } from "@/lib/types";

// Small helper so the role badge colours stay consistent across the table.
const roleBadge = (role: string) => {
  if (role === "admin") return "bg-purple-100 text-purple-700";
  if (role === "owner") return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";
};

export default function AllUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Load every registered account from the admin-only endpoint.
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.get(`${backendUrl}/api/users/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  // Quick counters shown above the table. Accounts created before roles were
  // added fall back to the default "customer" role.
  const counts = {
    total: users.length,
    customers: users.filter((u) => (u.role || "customer") === "customer").length,
    owners: users.filter((u) => u.role === "owner").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Users</h1>
        <p className="text-sm text-slate-500 mt-1">Every account registered on the platform.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.total },
          { label: "Customers", value: counts.customers },
          { label: "Owners", value: counts.owners },
          { label: "Admins", value: counts.admins },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-slate-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">User</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Phone</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Verified</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={36}
                          height={36}
                          unoptimized
                          className="rounded-full object-cover w-9 h-9"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleBadge(user.role || "customer")}`}>
                      {user.role || "customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={user.emailVerified ? "text-green-600" : "text-slate-400"}>
                      {user.emailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
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
