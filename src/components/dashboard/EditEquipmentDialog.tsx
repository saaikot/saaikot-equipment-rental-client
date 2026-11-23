// src/components/dashboard/EditEquipmentDialog.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import type { Equipment } from "@/lib/types";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

interface Props {
  equipment: Equipment;
  // Parent updates its local list with the saved document.
  onUpdated: (equipment: Equipment) => void;
}

// Shared edit form used by the owner and admin equipment tables.
export default function EditEquipmentDialog({ equipment, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: equipment.name || "",
    description: equipment.description || "",
    category: equipment.category || CATEGORIES[0],
    location: equipment.location || "",
    price: String(equipment.price ?? ""),
    rentalType: equipment.rentalType || "Daily",
    availableQuantity: String(equipment.availableQuantity ?? 1),
    condition: equipment.condition || "Good",
    brand: equipment.brand || "",
    model: equipment.model || "",
    imageURL: equipment.imageURL || "",
    rentalTerms: equipment.rentalTerms || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      const res = await axios.put(
        `${backendUrl}/api/equipment/${equipment._id}`,
        {
          ...form,
          price: Number(form.price),
          availableQuantity: Number(form.availableQuantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated(res.data.equipment);
      toast.success("Equipment updated");
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update equipment");
      } else {
        toast.error("Failed to update equipment");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Update">
          <Pencil className="w-4 h-4 text-amber-600" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Equipment</DialogTitle>
          <DialogDescription>
            Edit the listing details. Owner edits are re-submitted for admin approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input required value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" min="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Rental Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.rentalType}
                onChange={(e) => setForm({ ...form, rentalType: e.target.value })}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Available Quantity</Label>
              <Input type="number" min="0" required value={form.availableQuantity} onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Brand (Optional)</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Model (Optional)</Label>
              <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Rental Terms &amp; Conditions</Label>
            <Textarea rows={2} value={form.rentalTerms} onChange={(e) => setForm({ ...form, rentalTerms: e.target.value })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
