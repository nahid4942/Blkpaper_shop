// =====================================================================
// BLKPAPER • bKash SMS webhook  (Supabase Edge Function, name it: bkash-webhook)
//
// What it does: your phone forwards every "You have received Tk ..." bKash SMS to this URL,
// and the money is saved in the bkash_payments table. When a customer later types their
// Transaction ID at checkout, the shop matches it (ID + exact amount) against this table.
//
// Setup is in SETUP.md (step 6).  Required secret:  BKASH_WEBHOOK_SECRET  (any long random text)
// =====================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// ---------- SMS parser (pure function) ----------
// BEGIN_PARSER
export function parseBkashSms(text: string): { trx: string; amount: number; sender: string | null } | null {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  // only incoming money ("received"), never "sent" / "cash out" messages
  if (!/received/i.test(t)) return null;
  const trxMatch = t.match(/Trx\s*ID\s*[:\-]?\s*([A-Z0-9]{6,20})/i);
  if (!trxMatch) return null;
  // first Tk amount AFTER the word "received" (the later ones are Fee and Balance)
  const afterReceived = t.slice(t.search(/received/i));
  const amtMatch = afterReceived.match(/(?:Tk|BDT|৳)\.?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (!amtMatch) return null;
  const amount = Number(amtMatch[1].replace(/,/g, ""));
  if (!isFinite(amount) || amount <= 0) return null;
  const senderMatch = t.match(/from\s*(\+?\d{10,14})/i);
  return { trx: trxMatch[1].toUpperCase(), amount, sender: senderMatch ? senderMatch[1] : null };
}
// END_PARSER

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  // shared secret, so only your phone can add payments:  ...?key=YOUR_SECRET   (or header x-webhook-key)
  const secret = Deno.env.get("BKASH_WEBHOOK_SECRET");
  const key = new URL(req.url).searchParams.get("key") ?? req.headers.get("x-webhook-key");
  if (!secret || key !== secret) return json({ error: "Unauthorized" }, 401);

  // SMS-forwarder apps send JSON, form data or plain text — accept all of them
  const raw = await req.text();
  let text = raw;
  try {
    const j = JSON.parse(raw);
    text = j.message ?? j.text ?? j.body ?? j.sms ?? j.content ?? j.msg ?? raw;
  } catch {
    try {
      const p = new URLSearchParams(raw);
      text = p.get("message") ?? p.get("text") ?? p.get("body") ?? p.get("sms") ?? p.get("content") ?? p.get("msg") ?? raw;
    } catch { /* plain text */ }
  }

  const parsed = parseBkashSms(String(text));
  if (!parsed) return json({ ok: true, ignored: true });   // not a "money received" message

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await supabase.from("bkash_payments").upsert(
    { trx_id: parsed.trx, amount: parsed.amount, sender: parsed.sender, raw_sms: String(text).slice(0, 1000), source: "sms" },
    { onConflict: "trx_id", ignoreDuplicates: true },
  );
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, trx: parsed.trx, amount: parsed.amount });
});
