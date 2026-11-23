// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Route-level error boundary. Next.js passes the thrown error and a reset
// callback that re-renders the failed segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center bg-white border rounded-2xl shadow-sm p-10">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-slate-600 mt-3">
          We hit an unexpected error while loading this page. Please try again — if it keeps
          happening, head back to the home page.
        </p>

        {error.digest && (
          <p className="text-xs text-slate-400 mt-3">Reference: {error.digest}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
