# BLKPAPER × Supabase — 10-minute setup

## 1. Create the project
1. Go to https://supabase.com → **New project** (any name, choose a region near Bangladesh, e.g. Singapore). Save the database password.
2. Wait ~2 minutes until it's ready.

## 2. Create the database
1. Left menu → **SQL Editor** → **New query**.
2. Open `supabase_schema.sql`, copy ALL of it, paste, click **Run**. (Safe to run again.)
   This creates the tables, security rules, the automatic stock-deduction order function, the image bucket and live updates, plus your 14 sample products.

## 3. Create your admin login
1. **Authentication → Users → Add user → Create new user**.
2. Email: your own email. Password: `Nahid@4942` (or any password you prefer). Tick **Auto Confirm User**.
3. **SQL Editor** → new query → run (replace the email with yours):
```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'YOUR_EMAIL_HERE'
on conflict do nothing;
```

## 4. Connect the website
1. **Project Settings → API**. Copy **Project URL** and the **anon public** key.
2. Paste them into `supabase-config.js`. (Never paste the `service_role` key.)
3. Upload all files to your hosting: `index_copy.html`, `script.js`, `styles.css`, `supabase-config.js`.

## 5. Update an existing project (if you already ran the schema before)
Open `supabase_schema.sql` again, copy ALL of it and **Run** it once more. It is safe to repeat and adds the new bKash payment tables/functions without touching your products or orders.

## 6. Turn on bKash payment (QR + Transaction ID)
1. In the admin panel → **Site Settings → bKash online payment**: enter your bKash number, upload your bKash **QR code image** (screenshot it from the bKash app), click **Save settings**. (Leave the number empty to switch bKash payment off.)
2. Customers who choose bKash now see a payment window with your QR, send the exact amount, and type their Transaction ID. The shop checks **TrxID + exact amount** against the **bKash Payments** list; on a match the order is confirmed automatically.
3. **Getting payments into that list automatically** (so nobody has to type them):
   - Supabase Dashboard → **Edge Functions → Deploy a new function** → name it `bkash-webhook` → paste the contents of `bkash-webhook.ts`.
   - Turn **off** "Verify JWT" for this function (your phone can't send one).
   - **Project Settings → Edge Functions → Secrets** → add `BKASH_WEBHOOK_SECRET` with a long random text.
   - On the Android phone that receives your bKash SMS, install any "SMS forwarder" app that can POST SMS to a URL, and point it to:
     `https://YOUR-PROJECT-REF.supabase.co/functions/v1/bkash-webhook?key=YOUR_SECRET`
     (only forward SMS from "bKash"). Send yourself a test payment to check it appears in **bKash Payments**.
   - Without the webhook you can still use the panel: add each received payment by hand in **bKash Payments**.

## 7. Use it
- Open your site with `#admin` at the end (or Alt+Shift+A, or tap the footer copyright 5×) and sign in with the email + password from step 3.
- Every change goes live instantly for all visitors. Customers' orders appear in **Orders**, and stock is deducted automatically.
