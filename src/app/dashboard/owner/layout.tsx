// src/app/dashboard/owner/layout.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PlusCircle, Box, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  // Protect route & check role
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (!isPending && session) {
      // Safe type assertion to avoid 'any' error
      const role = (session.user as { role: string }).role;
      if (role !== "owner") {
        toast.error("Access denied. You are not an owner.");
        router.push("/dashboard/my-rentals");
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <div className="text-center py-20">Loading...</div>;

  const menuItems = [
    { name: "Add Equipment", href: "/dashboard/owner/add-equipment", icon: <PlusCircle className="w-5 h-5" /> },
    { name: "My Equipment", href: "/dashboard/owner/my-equipment", icon: <Box className="w-5 h-5" /> },
    { name: "Equipment Rentals", href: "/dashboard/owner/my-equipment-rental", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "My Profile", href: "/dashboard/owner/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Owner Panel</h2>
        </div>
        <nav className="mt-4 space-y-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}