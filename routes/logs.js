// routes/logs.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "madai_dev_secret";

// -----------------------------
// VERIFY OWNER TOKEN
// -----------------------------
function verifyOwner(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;

  const token = auth.replace("Bearer ", "");
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// -----------------------------
// GET ALL LOGS (SYSTEM + AI)
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const systemLogs = await db.query(
      "SELECT id, type, message, created_at FROM system_logs ORDER BY created_at DESC LIMIT 100"
    );

    const aiLogs = await db.query(
      "SELECT id, prompt, reply, created_at FROM madai_logs ORDER BY created_at DESC LIMIT 100"
    );

    res.json({
      ok: true,
      system: systemLogs.rows,
      ai: aiLogs.rows,
      message: "MADAI logs retrieved",
    });
  } catch (err) {
    console.error("Logs GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// ADD SYSTEM LOG (OWNER ONLY)
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { type, message } = req.body;

    if (!type || !message)
      return res.status(400).json({ error: "Missing fields" });

    await db.query(
      "INSERT INTO system_logs (type, message) VALUES ($1, $2)",
      [type, message]
    );

    res.json({
      ok: true,
      message: "System log added",
    });
  } catch (err) {
    console.error("Logs POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
