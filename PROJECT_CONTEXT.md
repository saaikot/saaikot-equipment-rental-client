# 🚀 Project: RentEasy — Client (Assignment 9)

Master context, rules, and progress for the Next.js client.

## 👤 User & Git Information
- **GitHub Username:** saaikot
- **Git Email:** labibferdous14@gmail.com
- **Repos:** `saaikot-equipment-rental-server`, `saaikot-equipment-rental-client`
- **Local Paths:** `D:\personal\saaikot-equipment-rental-server` & `D:\personal\saaikot-equipment-rental-client`
- **Editor:** VS Code

## 🛠️ Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn-style Base UI components
- **Backend:** Express 5 (JavaScript), MongoDB (Mongoose)
- **Auth:** Better Auth (JWT plugin, JWKS verified in Express, Google OAuth)
- **Payment:** Stripe Checkout (Test Mode)
- **Images:** Direct image URLs rendered with `next/image` (`unoptimized`)

## ⚠️ Strict Rules for AI
1. Follow all assignment requirements (20+ client commits, 12+ server commits).
2. All NEW files must have a `rental-` prefix.
3. Add English comments explaining EVERY function and block.
4. Incremental Work: Small chunks, then `git commit` commands.
5. Context Updates: Always provide an updated version of this file at the end.

> Note: App Router route files must keep their reserved names (`page.tsx`, `layout.tsx`), so the prefix rule applies to helper modules only.

## ✅ Progress Tracker

### Frontend (100% COMPLETE)
- [x] Next.js + Tailwind + shadcn-style UI setup
- [x] Better Auth config (server, client, MongoDB adapter, JWT plugin)
- [x] Sonner Toaster setup
- [x] Login/Register pages (email/password + Google)
- [x] Navbar & Footer layout
- [x] Home page (banner, featured equipment, categories, why choose us)
- [x] All Equipment page (server-side search, category filter, sort, pagination)
- [x] Equipment Details page (specs, terms, favorite, booking dialog, price preview)
- [x] Customer Dashboard (My Rentals, Favorites, Profile)
- [x] Owner Dashboard (Add Equipment, My Equipment, Equipment Rentals, Profile)
- [x] Admin Dashboard (Analytics, All Users, All Equipment, All Rentals)
- [x] Stripe Checkout integration + payment success/cancel pages
- [x] Role-based dashboard protection and redirects
- [x] `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass
- [ ] Deployment (Vercel + Render/Railway)
- [ ] Final README live links

### Backend (100% COMPLETE)
- [x] Models: `user`, `equipment`, `booking`, `favorite`, `payment`
- [x] Controllers: equipment, rental-booking, rental-favorite, rental-payment, rental-analytics
- [x] Middleware: `verifyToken` (JWKS), `verifyRenter`, `verifyOwner`, `verifyAdmin`
- [x] All API endpoints wired in `index.js`
- [x] Admin users endpoint: `GET /api/users/admin/all`
- [x] Stripe webhook raw-body handling + per-route JSON parsing for checkout/verify

## 🗄️ External Services
- **MongoDB Atlas:** Cluster `bazardor`, user `renteasy`, DNS fix applied in client `auth.ts` and server `index.js`.
- **Stripe:** Test-mode keys configured in server `.env`.
- **Google OAuth:** Configured in client `.env.local`.

## 📝 Notes
- The Express payment router is mounted **before** `express.json()` so the webhook keeps its raw body; `create-checkout-session` and `verify/:sessionId` parse JSON individually.
- Admin role must be granted in MongoDB (`db.user.updateOne({ email }, { $set: { role: "admin" } })`).
- Booking flow: create booking → Stripe Checkout → `/payment/success?session_id=...` verifies payment → booking becomes `paid`/`confirmed` and stock is reduced.
