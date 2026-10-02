// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db"); // your DB connector

// ENV
const JWT_SECRET = process.env.JWT_SECRET || "madai_dev_secret";

// Helper: create JWT
function createToken(owner) {
  return jwt.sign(
    {
      id: owner.id,
      email: owner.email,
      role: "owner",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// -----------------------------
// SIGN UP
// -----------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await db.query(
      "SELECT id FROM owners WHERE email = $1",
      [email]
    );

    if (existing.rowCount > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO owners (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email",
      [name || "", email, hashed]
    );

    const owner = result.rows[0];
    const token = createToken(owner);

    res.json({
      ok: true,
      owner,
      token,
      message: "MADAI owner account created",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// LOGIN
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT id, email, password_hash FROM owners WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const owner = result.rows[0];
    const valid = await bcrypt.compare(password, owner.password_hash);

    if (!valid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken(owner);

    res.json({
      ok: true,
      owner: { id: owner.id, email: owner.email },
      token,
      message: "MADAI owner authenticated",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// RESET PASSWORD
// -----------------------------
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const result = await db.query(
      "SELECT id FROM owners WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Email not found" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE owners SET password_hash = $1 WHERE email = $2",
      [hashed, email]
    );

    res.json({
      ok: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// OWNER‑ONLY MIDDLEWARE
// -----------------------------
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ error: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      ok: true,
      owner: decoded,
      message: "Owner verified",
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
