// src/components/dashboard/ProfileForm.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Custom BetterAuth fields we store on the user document.
interface CustomUser {
  name: string;
  email: string;
  image: string;
  phone?: string;
  address?: string;
}

// Shared profile editor used by both the customer and owner dashboards.
export default function ProfileForm() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

  // Prefill the form whenever the session user becomes available.
  useEffect(() => {
    if (session?.user) {
      const user = session.user as CustomUser;
      // Deferred so the update does not run synchronously inside the effect.
      setTimeout(() => {
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          image: user.image || "",
        });
      }, 0);
    }
  }, [session]);

  // Send only the editable fields to the backend.
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.put(`${backendUrl}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>Email (Cannot be changed)</Label>
            <Input value={session?.user?.email || ""} disabled className="bg-slate-100" />
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
