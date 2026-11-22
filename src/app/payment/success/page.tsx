// src/app/payment/success/page.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { Rental } from "@/lib/types";

type VerifyState = "loading" | "success" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session, isPending } = authClient.useSession();

  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [booking, setBooking] = useState<Rental | null>(null);
  // Prevent React strict-mode double invocation from verifying twice.
  const started = useRef(false);

  // Ask the backend to confirm the Stripe session and mark the booking paid.
  useEffect(() => {
    if (isPending || started.current) return;
    if (!sessionId || !session) return;

    started.current = true;

    const verify = async () => {
      try {
        const tokenRes = await authClient.token();
        const token = tokenRes?.data?.token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await axios.post(
          `${backendUrl}/api/payments/verify/${sessionId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBooking(res.data.booking);
        setState("success");
        setMessage("Payment confirmed. Your booking is locked in!");
      } catch (error) {
        setState("error");
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.message || "Could not verify the payment.");
        } else {
          setMessage("An unexpected error occurred while verifying the payment.");
        }
      }
    };

    verify();
  }, [sessionId, session, isPending]);

  // Cases that need no network call are derived during render, so the effect
  // never has to write state synchronously.
  const missingSession = !sessionId;
  const loggedOut = !isPending && !session;
  const displayState: VerifyState = missingSession || loggedOut ? "error" : state;
  const displayMessage = missingSession
    ? "Missing Stripe session id. Please contact support if you were charged."
    : loggedOut
      ? "Please log in to view this payment."
      : message;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border shadow-sm max-w-lg w-full p-8 text-center space-y-5">
        {displayState === "loading" && (
          <>
            <Loader2 className="w-14 h-14 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-bold text-slate-900">Confirming payment</h1>
            <p className="text-slate-600">{displayMessage}</p>
          </>
        )}

        {displayState === "success" && (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">Payment Successful</h1>
            <p className="text-slate-600">{displayMessage}</p>

            {booking && (
              <div className="bg-slate-50 border rounded-xl p-4 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Rental dates</span>
                  <span className="font-medium text-slate-800">
                    {new Date(booking.rentalStartDate).toLocaleDateString()} -{" "}
                    {new Date(booking.rentalEndDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount paid</span>
                  <span className="font-bold text-slate-900">${booking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment status</span>
                  <span className="font-medium text-green-600 capitalize">{booking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking status</span>
                  <span className="font-medium text-slate-800 capitalize">{booking.bookingStatus}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <Link href="/dashboard/my-rentals">
                <Button>View My Rentals</Button>
              </Link>
              <Link href="/all-equipment">
                <Button variant="outline">Browse Equipment</Button>
              </Link>
            </div>
          </>
        )}

        {displayState === "error" && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">Payment Not Confirmed</h1>
            <p className="text-slate-600">{displayMessage}</p>
            <div className="flex gap-3 justify-center pt-2">
              <Link href="/dashboard/my-rentals">
                <Button>Go to My Rentals</Button>
              </Link>
              <Link href="/all-equipment">
                <Button variant="outline">Browse Equipment</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600">
          Loading payment details...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
