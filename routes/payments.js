const express = require('express');
const router = express.Router();

let stripe;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not set');
    stripe = require('stripe')(key);
  }
  return stripe;
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.madmadisonai.com';

// POST /api/payments/create-session
router.post('/create-session', async (req, res) => {
  try {
    const { items, email, name, success_url, cancel_url } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          metadata: { sku: item.id || '' }
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items,
      success_url: success_url || `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${FRONTEND_URL}/cart`,
      metadata: { customer_name: name || '', source: 'wowdamn_store' },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payments/verify/:sessionId
router.get('/verify/:sessionId', async (req, res) => {
  try {
    const session = await getStripe().checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (webhookSecret) {
      event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    return res.status(400).send('Webhook Error: ' + err.message);
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    console.log('Payment complete:', s.customer_email, '$' + (s.amount_total / 100).toFixed(2));
  }
  res.json({ received: true });
});

// GET /api/payments/revenue
router.get('/revenue', async (req, res) => {
  try {
    const charges = await getStripe().charges.list({ limit: 100 });
    const paid = charges.data.filter(c => c.paid && !c.refunded);
    const total = paid.reduce((s, c) => s + c.amount, 0);
    res.json({
      total_revenue_usd: (total / 100).toFixed(2),
      order_count: paid.length,
      recent: paid.slice(0, 5).map(c => ({
        id: c.id,
        amount: (c.amount / 100).toFixed(2),
        email: c.billing_details && c.billing_details.email,
        created: new Date(c.created * 1000).toISOString()
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
