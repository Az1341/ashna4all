// api/subscribe.js — GoalCurrent.live
// Adds a subscriber to the Brevo contact list.
// Required Vercel environment variables:
//   BREVO_API_KEY  — Brevo → Settings → SMTP & API → API Keys → Generate
//   BREVO_LIST_ID  — Brevo → Contacts → Lists → the number (#) of your list

const BREVO_KEY = process.env.BREVO_API_KEY;
const LIST_ID   = Number(process.env.BREVO_LIST_ID || 0);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'POST only' });
  if (!BREVO_KEY || !LIST_ID)  return res.status(500).json({ error: 'Subscription service not configured' });

  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address' });

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        listIds: [LIST_ID],
        updateEnabled: true   // re-subscribing an existing address is fine, not an error
      })
    });

    if (r.status === 201 || r.status === 204)
      return res.status(200).json({ ok: true });

    const data = await r.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter')
      return res.status(200).json({ ok: true, existing: true });

    console.error('[subscribe] Brevo error', r.status, data);
    return res.status(502).json({ error: 'Subscription failed, please try again later' });

  } catch (err) {
    console.error('[subscribe]', err.message);
    return res.status(502).json({ error: 'Subscription failed, please try again later' });
  }
}
