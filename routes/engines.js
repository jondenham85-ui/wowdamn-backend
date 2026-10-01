const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getEngineState, setEnginePower, controlEngine } = require("../services/engineService");

router.get("/status", auth, (req, res) => { res.json(getEngineState()); });

router.patch("/power", auth, (req, res) => {
  const { id, power } = req.body;
  if (!id || power === undefined) return res.status(400).json({ error: "id and power required" });
  const engine = setEnginePower(id, Number(power));
  if (!engine) return res.status(404).json({ error: "Engine not found" });
  res.json(engine);
});

router.post("/control", auth, (req, res) => {
  const { id, action } = req.body;
  if (!id || !action) return res.status(400).json({ error: "id and action required" });
  if (!["start", "stop", "restart"].includes(action)) return res.status(400).json({ error: "action must be start|stop|restart" });
  const engine = controlEngine(id, action);
  if (!engine) return res.status(404).json({ error: "Engine not found" });
  res.json(engine);
});

router.get("/product/stats", auth, (req, res) => {
  res.json({ totalProducts: 1247, activeProducts: 1180, outOfStock: 23, totalValue: 2840000, avgPrice: 156.80, totalCategories: 12, pendingReview: 8, recentAdded: 34 });
});

router.get("/revenue/stats", auth, (req, res) => {
  res.json({ totalRevenue: 8420000, monthRevenue: 342000, totalTransactions: 15842, avgOrderValue: 531.60, growthRate: 18.4, refundRate: 1.1, topCategory: "Electronics", projectedMonth: 395000 });
});

router.get("/workflow/stats", auth, (req, res) => {
  res.json({ totalWorkflows: 284, activeWorkflows: 47, completedToday: 312, failedToday: 4, avgCompletionTime: 3.8, queueDepth: 23 });
});

module.exports = router;
