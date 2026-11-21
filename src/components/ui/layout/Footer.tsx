// src/components/layout/Footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">RentEasy</h2>
          <p className="text-sm">
            The easiest way to rent and list equipment. Transparent, secure, and fast.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/all-equipment" className="hover:text-primary">All Equipment</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Links (Using new X logo instead of Twitter bird as requested) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary"><Facebook className="w-5 h-5" /></a>
            {/* SVG for X (Twitter) logo */}
            <a href="#" className="hover:text-primary">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
               </svg>
            </a>
            <a href="#" className="hover:text-primary"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-700 text-center text-sm">
        &copy; {new Date().getFullYear()} RentEasy. All rights reserved.
      </div>
    </footer>
  );
}