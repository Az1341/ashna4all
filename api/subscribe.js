// api/subscribe.js — GoalCurrent.live
// POST /api/subscribe — add contact to Brevo list
// Env: BREVO_API_KEY, BREVO_LIST_ID

const BREVO_KEY = process.env.BREVO_API_KEY;
const LIST_ID   = Number(process.env.BREVO_LIST_ID || 0);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  if (!BREVO_KEY || !LIST_ID) {
    return res.status(503).json({ error: 'Subscription service not configured' });
  }

  const body = req.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const name  = String(body.name || '').trim();

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  const payload = {
    email,
    listIds: [LIST_ID],
    updateEnabled: true,
  };

  if (name) {
    payload.attributes = { FIRSTNAME: name };
  }

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (r.status === 201 || r.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await r.json().catch(() => ({}));

    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true, note: 'already_subscribed' });
    }

    console.error('[subscribe] Brevo error', r.status, data);
    return res.status(500).json({
      error: 'Subscription failed',
      detail: data.message || data.code || `HTTP ${r.status}`,
    });
  } catch (err) {
    console.error('[subscribe]', err.message);
    return res.status(500).json({ error: 'Subscription failed', detail: err.message });
  }
}
