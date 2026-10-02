// routes/products.js
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
// GET ALL PRODUCTS
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, price, description, image FROM products ORDER BY id DESC"
    );

    res.json({
      ok: true,
      products: result.rows,
    });
  } catch (err) {
    console.error("Products GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// ADD PRODUCT (OWNER ONLY)
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { name, price, description, image } = req.body;

    if (!name || !price)
      return res.status(400).json({ error: "Missing fields" });

    await db.query(
      "INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4)",
      [name, price, description || "", image || ""]
    );

    res.json({
      ok: true,
      message: "Product added to ShopMAD",
    });
  } catch (err) {
    console.error("Products POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// UPDATE PRODUCT (OWNER ONLY)
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { name, price, description, image } = req.body;

    await db.query(
      "UPDATE products SET name=$1, price=$2, description=$3, image=$4 WHERE id=$5",
      [name, price, description || "", image || "", id]
    );

    res.json({
      ok: true,
      message: "Product updated",
    });
  } catch (err) {
    console.error("Products UPDATE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// DELETE PRODUCT (OWNER ONLY)
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    await db.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({
      ok: true,
      message: "Product removed",
    });
  } catch (err) {
    console.error("Products DELETE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
