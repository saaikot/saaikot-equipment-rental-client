// src/app/dashboard/admin/layout.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BarChart3, Users, Box, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  // Protect the whole admin area: only accounts with the "admin" role may enter.
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (!isPending && session) {
      const role = (session.user as { role: string }).role;
      if (role !== "admin") {
        toast.error("Access denied. Admins only.");
        router.push("/dashboard/my-rentals");
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <div className="text-center py-20">Loading...</div>;

  const role = (session.user as { role: string }).role;
  if (role !== "admin") return <div className="text-center py-20">Checking permissions...</div>;

  const menuItems = [
    { name: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "All Users", href: "/dashboard/admin/all-users", icon: <Users className="w-5 h-5" /> },
    { name: "All Equipment", href: "/dashboard/admin/all-equipment", icon: <Box className="w-5 h-5" /> },
    { name: "All Rentals", href: "/dashboard/admin/all-rentals", icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
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

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
