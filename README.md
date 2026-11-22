# RentEasy — Equipment Rental Platform

RentEasy is a full-stack equipment rental marketplace built for Assignment 9. Owners list their equipment, customers browse and book it, and admins moderate the platform. Payments are handled end-to-end with Stripe Checkout (test mode).

## 🚀 Live Links

- **Live Site:** _not deployed yet_
- **Client Repo:** https://github.com/saaikot/saaikot-equipment-rental-client
- **Server Repo:** https://github.com/saaikot/saaikot-equipment-rental-server

## ✨ Key Features

- **Authentication:** Email/password and Google login via Better Auth, with JWT-protected Express APIs.
- **Role-based access:** Three roles — `customer`, `owner`, and `admin` — each with a dedicated dashboard.
- **Public browsing:** Home page with featured equipment and categories, plus an All Equipment page with server-side search, category filter, and sorting.
- **Equipment details:** Full specs, rental terms, stock count, favorite button, and a booking dialog with live price calculation.
- **Booking + Stripe Checkout:** Creating a booking redirects to Stripe; the success page verifies the session and marks the booking paid and confirmed.
- **Customer dashboard:** My Rentals, Favorites, and Profile.
- **Owner dashboard:** Add Equipment (submitted for admin approval), My Equipment (view/delete), Equipment Rentals (confirm/complete/cancel bookings), and Profile.
- **Admin dashboard:** Platform analytics with monthly revenue/booking charts, all users, all equipment (approve/reject/delete), and all rentals (update booking status).
- **Stock management:** Available quantity is reduced automatically when a payment is confirmed.

## 🛠️ Tech Stack

**Client**
- Next.js 16 (App Router, Turbopack, Cache Components)
- TypeScript, Tailwind CSS v4
- shadcn-style components built on Base UI
- Better Auth client + JWT plugin
- Axios, Sonner, Lucide icons, Framer Motion

**Server**
- Express 5, Node.js
- MongoDB + Mongoose
- Better Auth JWT verification through JWKS (`jose`)
- Stripe Checkout + webhook

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login, register
│   ├── all-equipment/            # listing + [id] details & booking
│   ├── dashboard/
│   │   ├── my-rentals, favorites, profile
│   │   ├── owner/                # add-equipment, my-equipment, my-equipment-rental, profile
│   │   └── admin/                # analytics, all-users, all-equipment, all-rentals
│   ├── payment/success, cancel
│   └── api/auth/[...all]
├── components/
│   ├── dashboard/ProfileForm.tsx
│   ├── home/, layout/, ui/
└── lib/                          # auth, auth-client, types, utils
```

## ⚙️ Environment Variables

### Client (`.env.local`)

```env
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Server (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
CLIENT_URL=http://localhost:3001
BETTER_AUTH_URL=http://localhost:3001
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> The payment router is mounted **before** `express.json()` so the Stripe webhook can read the raw body. JSON parsing is applied per-route inside `routes/rental-payment.routes.js`.

## 🏃 Running Locally

```bash
# 1. Start the API
cd saaikot-equipment-rental-server
npm install
npm run dev            # http://localhost:5000

# 2. Start the client
cd saaikot-equipment-rental-client
npm install
npm run dev            # http://localhost:3001

# 3. (Optional) Seed sample equipment
cd saaikot-equipment-rental-server
node seed.js
```

### Stripe webhook (local)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

## 🔑 Roles

New accounts default to `customer`. To create an owner or admin, update the `role` field in the MongoDB `user` collection:

```js
db.user.updateOne({ email: "owner@example.com" }, { $set: { role: "owner" } })
db.user.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## 📜 Scripts

| Client | Server |
| --- | --- |
| `npm run dev` | `npm run dev` |
| `npm run build` | `npm start` |
| `npm run lint` | `node seed.js` |
