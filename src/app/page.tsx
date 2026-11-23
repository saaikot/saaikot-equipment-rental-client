// src/app/page.tsx
import Banner from "@/components/home/Banner";
import Categories from "@/components/home/Categories";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";
import TrustedOwners from "@/components/home/TrustedOwners";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <FeaturedEquipment />
      <Categories />
      
      {/* Why Choose Us Section (Simple static version) */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            We connect you with trusted equipment owners, ensuring secure payments, flexible rental periods, and top-quality gear.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl bg-slate-50">
              <h3 className="font-bold text-lg mb-2">Affordable Prices</h3>
              <p className="text-sm text-slate-600">Get the best market rates for daily, weekly, or monthly rentals.</p>
            </div>
            <div className="p-6 border rounded-xl bg-slate-50">
              <h3 className="font-bold text-lg mb-2">Verified Owners</h3>
              <p className="text-sm text-slate-600">All equipment is verified and approved by our admin team.</p>
            </div>
            <div className="p-6 border rounded-xl bg-slate-50">
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-sm text-slate-600">Pay securely through Stripe integration with instant confirmation.</p>
            </div>
          </div>
        </div>
      </div>

      <HowItWorks />
      <TrustedOwners />
      <Reviews />
    </div>
  );
}