// src/app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, Heart, User, Box } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  // Protect the entire dashboard route
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <div className="text-center py-20">Loading dashboard...</div>;

  const menuItems = [
    { name: "My Rentals", href: "/dashboard/my-rentals", icon: <Box className="w-5 h-5" /> },
    { name: "Favorites", href: "/dashboard/favorites", icon: <Heart className="w-5 h-5" /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Customer Panel
          </h2>
        </div>
        <nav className="mt-4 space-y-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}