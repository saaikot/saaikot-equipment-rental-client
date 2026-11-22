# RentEasy — Equipment Rental Platform

RentEasy is a full-stack equipment rental marketplace built for Assignment 9. Owners list their equipment, customers browse and book it, and admins moderate the platform. Payments are handled end-to-end with Stripe Checkout (test mode).

## 🚀 Live Links

- **Live Site:** _add your Vercel URL after deploying_
- **API:** _add your Vercel API URL after deploying_
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

## ▲ Deploy on Vercel

Both projects deploy to Vercel. The server is detected automatically as an Express app: `index.js` exports the app and `local-server.js` is only used for the local listener.

### 1. Deploy the API first

1. Go to [vercel.com/new](https://vercel.com/new) and import `saaikot-equipment-rental-server`.
2. Keep the detected framework preset (Express / Other), root directory `./`, and default build settings.
3. Add these environment variables:

| Name | Value |
| --- | --- |
| `MONGODB_URI` | your Atlas connection string |
| `BETTER_AUTH_URL` | `https://<your-client>.vercel.app` (fill after step 2) |
| `CLIENT_URL` | `https://<your-client>.vercel.app` (fill after step 2) |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | fill after creating the webhook (step 3) |

4. Deploy and copy the API URL, e.g. `https://saaikot-equipment-rental-server.vercel.app`.
5. Visit that URL — it should return `{"status":"ok","message":"RentEasy API is running"}`.

### 2. Deploy the client

1. Import `saaikot-equipment-rental-client` at [vercel.com/new](https://vercel.com/new). Next.js is detected automatically.
2. Add these environment variables:

| Name | Value |
| --- | --- |
| `BETTER_AUTH_SECRET` | same secret as local |
| `BETTER_AUTH_URL` | `https://<your-client>.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://<your-client>.vercel.app` |
| `MONGODB_URI` | your Atlas connection string |
| `NEXT_PUBLIC_BACKEND_URL` | `https://<your-api>.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

3. Deploy, then go back to the **API** project and set `CLIENT_URL` and `BETTER_AUTH_URL` to the final client URL. Redeploy the API so CORS and JWKS verification use the right origin.
4. Changing any `NEXT_PUBLIC_*` variable requires a **new client deployment** (they are baked in at build time).

### 3. Post-deploy checklist

- **MongoDB Atlas → Network Access:** allow `0.0.0.0/0` (Vercel has no fixed IPs on Hobby).
- **Google Cloud Console → OAuth client:** add `https://<your-client>.vercel.app/api/auth/callback/google` as an authorized redirect URI.
- **Stripe → Developers → Webhooks:** add `https://<your-api>.vercel.app/api/payments/webhook`, select `checkout.session.completed`, copy the signing secret into `STRIPE_WEBHOOK_SECRET`, and redeploy the API.
- **Test the flow:** register → book equipment → pay with `4242 4242 4242 4242` → land on `/payment/success` → booking shows `paid` / `confirmed`.

## 🔑 Roles

New accounts default to `customer`. To create an owner or admin, update the `role` field in the MongoDB `user` collection:

```js
db.user.updateOne({ email: "owner@example.com" }, { $set: { role: "owner" } })
db.user.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## 📜 Scripts

| Client | Server |
| --- | --- |
| `npm run dev` | `npm run dev` (nodemon + `local-server.js`) |
| `npm run build` | `npm start` (`local-server.js`) |
| `npm run lint` | `node seed.js` |

> On Vercel the server ignores `local-server.js` and runs the app exported from `index.js`.
