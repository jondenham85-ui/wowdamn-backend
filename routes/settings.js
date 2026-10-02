// routes/settings.js
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
// GET OWNER SETTINGS
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const result = await db.query(
      "SELECT id, name, email, created_at FROM owners WHERE id = $1",
      [owner.id]
    );

    res.json({
      ok: true,
      settings: result.rows[0],
      message: "Owner settings retrieved",
    });
  } catch (err) {
    console.error("Settings GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// UPDATE OWNER SETTINGS
// -----------------------------
router.put("/", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { name, email } = req.body;

    await db.query(
      "UPDATE owners SET name=$1, email=$2 WHERE id=$3",
      [name, email, owner.id]
    );

    res.json({
      ok: true,
      message: "Owner settings updated",
    });
  } catch (err) {
    console.error("Settings UPDATE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// GET SYSTEM SETTINGS
// -----------------------------
router.get("/system", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const result = await db.query(
      "SELECT key, value FROM system_settings ORDER BY key ASC"
    );

    res.json({
      ok: true,
      settings: result.rows,
      message: "System settings retrieved",
    });
  } catch (err) {
    console.error("System GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// UPDATE SYSTEM SETTINGS
// -----------------------------
router.put("/system", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { key, value } = req.body;

    if (!key)
      return res.status(400).json({ error: "Missing key" });

    await db.query(
      "INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value=$2",
      [key, value]
    );

    res.json({
      ok: true,
      message: "System setting updated",
    });
  } catch (err) {
    console.error("System UPDATE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
