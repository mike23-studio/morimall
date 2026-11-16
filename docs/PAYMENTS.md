# Real payments plan (M-Pesa Daraja)
Never put Daraja keys in the browser. Use a Firebase Cloud Function (Blaze plan):
1. Browser calls `stkPush({amount, phone, orderId})` (callable function, auth required).
2. Function gets an OAuth token (consumer key/secret in `firebase functions:secrets`), then POSTs to `/mpesa/stkpush/v1/processrequest` with BusinessShortCode, Password (base64 shortcode+passkey+timestamp), Amount, PartyA/PhoneNumber, CallBackURL.
3. Safaricom calls your `mpesaCallback` HTTPS function; verify `ResultCode == 0`, then mark the order `paid` and put funds in escrow in Firestore.
4. Stock decrements, escrow release, refunds and seller payouts (Daraja B2C) must also run in Cloud Functions, not in the browser, so users cannot tamper with them. Tighten `firestore.rules` accordingly.
Alternatives: Pesapal / Flutterwave / Paystack hosted checkout (also needs a server-side callback).
