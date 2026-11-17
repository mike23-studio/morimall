# Morimall 🛍️
Multi-vendor marketplace: **B2C**, **C2C** (offers) and **B2B** (MOQ, KRA invoices), escrow, wallet, refunds/returns, accounts + support tickets, inventory, social sharing, light/dark mode.

## Run locally
Open the folder in VS Code → install **Live Server** → right-click `public/index.html` → *Open with Live Server*. Works offline in **local demo mode** (accounts and data in browser storage).

## GitHub
`git init && git add . && git commit -m "Morimall v2" && git branch -M main && git remote add origin https://github.com/YOU/morimall.git && git push -u origin main`

## Firebase (real accounts + database + hosting)
1. console.firebase.google.com → create project; enable **Authentication → Email/Password (+ Google)** and **Firestore Database**.
2. Project settings → add a Web app → copy the config into `public/js/firebase-config.js` (replace `null`).
3. Put your project ID in `.firebaserc`.
4. `npm i -g firebase-tools && firebase login && firebase deploy --only hosting,firestore:rules`

## Requirements checklist
| # | Requirement | Where |
|---|---|---|
| 1 | Cart | cart view, MOQ, offers |
| 2 | Payment platforms | wallet / M-Pesa / card (simulated) → `docs/PAYMENTS.md` |
| 3 | CRM | accounts, profile, loyalty tier, support tickets |
| 4 | Social media | share buttons, footer links, Google sign-in, OG tags |
| 5 | Varied products | 7 categories × B2C/C2C/B2B |
| 6 | Refunds | cancel-and-refund, return requests, seller approval |
| 7 | Checkout | delivery, VAT, escrow, KRA invoice |
| 8 | Security | hashed passwords, lockout, validation, escaping, Firestore rules, security headers |
| 9 | Ethics | Terms, Privacy (DPA 2019), consent notice, no fake discounts/ratings, listing declaration, account deletion |
| 10 | DB / inventory | stock tracking, low-stock, restock, Firestore |

## Honest limits
- Payments are simulated. Local-mode passwords are only SHA-256 hashed in browser storage (demo only). In cloud mode, stock changes on other sellers’ items and escrow/payouts need Cloud Functions (see docs) before real money is used.
- Replace the placeholder social URLs in `public/index.html` footer and `privacy@morimall.example` in `app.js`.

## Admin console 🛡
- Files: `public/js/admin.js` (console), `public/js/admin-config.js` (demo admin emails), plus small hooks in `app.js`, `firebase-sync.js` and `firestore.rules`.
- **Demo mode:** sign up with `admin@morimall.example` (or edit `admin-config.js`) → a **🛡 Admin** button appears in the header.
- **Firebase mode:** in the Firebase console create Firestore collection `admins`, with a document whose **ID is the admin’s UID** (Authentication → Users). Then `firebase deploy --only firestore:rules`. The rules, not the browser, decide who is an admin.
- Tabs: Overview (sales, escrow, commission, audit log) · Users (suspend/reactivate) · Listings (hide/remove) · Orders (release escrow / refund) · Support (return requests, ticket replies) · Settings (commission rates).
- Not yet server-enforced: money actions (refund/release) run in the browser; move them to Cloud Functions before real money.
