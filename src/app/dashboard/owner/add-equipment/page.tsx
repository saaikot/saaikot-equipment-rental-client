// src/app/dashboard/owner/add-equipment/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function AddEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Construction Equipment",
    location: "",
    price: "",
    rentalType: "Daily",
    availableQuantity: "1",
    condition: "Good",
    brand: "",
    model: "",
    imageURL: "",
    rentalTerms: "",
  });

  const categories = [
    "Construction Equipment", "Photography Equipment",
    "Vehicles & Transportation", "Agriculture Equipment",
    "Electronics", "Event Equipment",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await axios.post(`${backendUrl}/api/equipment`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Equipment submitted for approval!");
      router.push("/dashboard/owner/my-equipment");
    } catch (error) {
      // Proper error handling to avoid TypeScript 'any' error
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add equipment");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add New Equipment</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Canon EOS R5" />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. New York, USA" />
            </div>

            <div className="space-y-2">
              <Label>Image URL (Direct Link)</Label>
              <Input required value={formData.imageURL} onChange={(e) => setFormData({...formData, imageURL: e.target.value})} placeholder="https://example.com/image.jpg" />
            </div>

            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" min="1" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. 50" />
            </div>

            <div className="space-y-2">
              <Label>Rental Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.rentalType} onChange={(e) => setFormData({...formData, rentalType: e.target.value})}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Available Quantity</Label>
              <Input type="number" min="1" required value={formData.availableQuantity} onChange={(e) => setFormData({...formData, availableQuantity: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Brand (Optional)</Label>
              <Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Canon" />
            </div>

            <div className="space-y-2">
              <Label>Model (Optional)</Label>
              <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} placeholder="e.g. EOS R5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the equipment..." />
          </div>

          <div className="space-y-2">
            <Label>Rental Terms & Conditions</Label>
            <Textarea rows={2} value={formData.rentalTerms} onChange={(e) => setFormData({...formData, rentalTerms: e.target.value})} placeholder="e.g. Must return in original condition." />
          </div>

          <Button type="submit" className="w-full md:w-auto px-8" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Approval"}
          </Button>
        </form>
      </div>
    </div>
  );
}