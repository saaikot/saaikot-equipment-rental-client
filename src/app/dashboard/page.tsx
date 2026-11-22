// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      // Cast to specific type to avoid 'any' error
      const role = (session.user as { role: string }).role;
      
      if (role === "admin") {
        router.push("/dashboard/admin/all-users");
      } else if (role === "owner") {
        router.push("/dashboard/owner/my-equipment");
      } else {
        router.push("/dashboard/my-rentals");
      }
    } else if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  return <div className="text-center py-20 font-semibold">Redirecting to your dashboard...</div>;
}