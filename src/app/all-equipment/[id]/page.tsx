// src/app/all-equipment/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
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
import { toast } from "sonner";
import { Heart, MapPin, Tag, ShieldCheck, Box } from "lucide-react";

export default function EquipmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    rentalStartDate: "",
    rentalEndDate: "",
    requiredQuantity: 1,
    contactNumber: "",
    deliveryAddress: "",
    additionalNotes: "",
  });

  // Protect route
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view equipment details");
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!session) return;
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        
        const res = await axios.get(`${backendUrl}/api/equipment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEquipment(res.data.equipment);
      } catch (error) {
        toast.error("Equipment not found");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id, session]);

  const handleAddToFavorite = async () => {
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      
      await axios.post(`${backendUrl}/api/favorites`, 
        { equipmentId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to favorites!");
    } catch (error) {
      toast.error("Failed to add to favorites");
    }
  };

  // Calculate total price preview
  const calculateTotal = () => {
    if (!equipment || !bookingData.rentalStartDate || !bookingData.rentalEndDate) return 0;
    
    const start = new Date(bookingData.rentalStartDate);
    const end = new Date(bookingData.rentalEndDate);
    const ms = end.getTime() - start.getTime();
    if (ms <= 0) return 0;

    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    let units = days;
    
    if (equipment.rentalType === "Weekly") units = Math.ceil(days / 7);
    if (equipment.rentalType === "Monthly") units = Math.ceil(days / 30);

    return equipment.price * bookingData.requiredQuantity * units;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calculateTotal() <= 0) {
      toast.error("Please select valid dates");
      return;
    }
    
    setIsBooking(true);
    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      const res = await axios.post(`${backendUrl}/api/bookings`, 
        { equipmentId: id, ...bookingData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking created! Proceeding to payment...");
      setIsModalOpen(false);
      
      // We will integrate Stripe here in the next step. For now, redirect to dashboard or a mock page.
      // router.push(`/payment/${res.data.booking._id}`);
      console.log("Booking Data:", res.data.booking); // For testing

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (isPending || loading) return <div className="text-center py-20">Loading...</div>;
  if (!equipment) return <div className="text-center py-20">Equipment not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="h-64 md:h-full min-h-[400px] relative">
            <img src={equipment.imageURL} alt={equipment.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Details Section */}
          <div className="p-8 flex flex-col">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Tag className="w-4 h-4" /> {equipment.category}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{equipment.name}</h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {equipment.location}</span>
              <span className="flex items-center gap-1"><Box className="w-4 h-4" /> {equipment.availableQuantity} in stock</span>
            </div>

            <div className="text-2xl font-bold text-slate-900 mb-6">
              ${equipment.price} <span className="text-sm font-normal text-slate-500">/ {equipment.rentalType}</span>
            </div>

            <p className="text-slate-600 mb-6 flex-grow">{equipment.description}</p>

            <div className="bg-slate-50 p-4 rounded-lg mb-6 border">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Rental Terms & Conditions
              </h3>
              <p className="text-sm text-slate-600">{equipment.rentalTerms || "Standard terms apply."}</p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="w-1/3" onClick={handleAddToFavorite}>
                <Heart className="w-4 h-4 mr-2" /> Favorite
              </Button>
              
              {/* Booking Modal Trigger */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-2/3">Book Now</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Book Equipment</DialogTitle>
                    <DialogDescription>
                      Fill out the details to rent {equipment.name}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleConfirmBooking} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" required 
                          onChange={(e) => setBookingData({...bookingData, rentalStartDate: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" required 
                          onChange={(e) => setBookingData({...bookingData, rentalEndDate: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity (Max: {equipment.availableQuantity})</Label>
                      <Input type="number" min="1" max={equipment.availableQuantity} required 
                        value={bookingData.requiredQuantity}
                        onChange={(e) => setBookingData({...bookingData, requiredQuantity: Number(e.target.value)})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input placeholder="Enter your phone number" required 
                        onChange={(e) => setBookingData({...bookingData, contactNumber: e.target.value})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Address</Label>
                      <Input placeholder="Enter delivery address" required 
                        onChange={(e) => setBookingData({...bookingData, deliveryAddress: e.target.value})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Notes (Optional)</Label>
                      <Textarea placeholder="Any special requests?" 
                        onChange={(e) => setBookingData({...bookingData, additionalNotes: e.target.value})} 
                      />
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">${calculateTotal()}</span>
                    </div>

                    <Button type="submit" className="w-full" disabled={isBooking}>
                      {isBooking ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}