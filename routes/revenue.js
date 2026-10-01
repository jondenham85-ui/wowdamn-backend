const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");

const now = new Date();
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MOCK_TRANSACTIONS = Array.from({ length: 30 }, (_, i) => ({
  id: `txn_${String(i+1).padStart(4,"0")}`,
  orderId: `ORD-${10000+i}`,
  customer: ["Alex Rivera","Jordan Kim","Sam Torres","Riley Chen","Dana Park"][i%5],
  amount: parseFloat((Math.random()*2000+50).toFixed(2)),
  status: ["completed","completed","completed","pending","refunded"][i%5],
  category: ["Electronics","Software","Bundles","Peripherals","Accessories"][i%5],
  createdAt: new Date(Date.now()-i*86400000).toISOString(),
}));

const MOCK_CHART = Array.from({ length: 12 }, (_, i) => ({
  month: monthNames[(now.getMonth()-11+i+12)%12],
  revenue: Math.floor(Math.random()*200000+150000),
  orders: Math.floor(Math.random()*800+400),
}));

router.get("/", auth, (req, res) => {
  const { status, search, limit=50, skip=0 } = req.query;
  let t = MOCK_TRANSACTIONS.filter(t => {
    if (status && t.status !== status) return false;
    if (search) { const s=search.toLowerCase(); if (!t.orderId.toLowerCase().includes(s) && !t.customer.toLowerCase().includes(s)) return false; }
    return true;
  }).slice(Number(skip), Number(skip)+Number(limit));
  res.json(t);
});

router.get("/chart", auth, (req, res) => res.json(MOCK_CHART));

router.get("/summary", auth, requireRole("owner","ceo","admin"), (req, res) => {
  const total = MOCK_TRANSACTIONS.reduce((s,t) => s+(t.status!=="refunded"?t.amount:0), 0);
  const refunded = MOCK_TRANSACTIONS.reduce((s,t) => s+(t.status==="refunded"?t.amount:0), 0);
  const pending = MOCK_TRANSACTIONS.reduce((s,t) => s+(t.status==="pending"?t.amount:0), 0);
  const completed = MOCK_TRANSACTIONS.filter(t => t.status==="completed").length;
  res.json({
    totalRevenue: parseFloat(total.toFixed(2)),
    totalRefunded: parseFloat(refunded.toFixed(2)),
    pendingAmount: parseFloat(pending.toFixed(2)),
    completedOrders: completed,
    refundRate: parseFloat(((refunded/(total+refunded))*100).toFixed(2)),
    avgOrderValue: parseFloat((total/completed||0).toFixed(2)),
  });
});

module.exports = router;
