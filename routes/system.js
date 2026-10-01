const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getSystemMetrics } = require("../services/metricsService");

router.get("/metrics", auth, (req, res) => {
  res.json(getSystemMetrics());
});

module.exports = router;
