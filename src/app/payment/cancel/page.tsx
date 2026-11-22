// src/app/payment/cancel/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

// Shown when a customer abandons the Stripe checkout page.
export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border shadow-sm max-w-lg w-full p-8 text-center space-y-5">
        <XCircle className="w-14 h-14 text-yellow-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="text-slate-600">
          No money was taken. Your booking is saved as unpaid, so you can come back and finish the payment any time.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/all-equipment">
            <Button>Browse Equipment</Button>
          </Link>
          <Link href="/dashboard/my-rentals">
            <Button variant="outline">My Rentals</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
