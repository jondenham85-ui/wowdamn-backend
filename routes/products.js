const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");

const MOCK_PRODUCTS = [
  { id:"prod_001", name:"Holographic Display Pro", sku:"HDP-001", category:"Electronics", price:2499.99, stock:84, status:"active", createdAt:"2024-01-15T00:00:00Z" },
  { id:"prod_002", name:"Neural Interface Headset", sku:"NIH-002", category:"Electronics", price:1299.99, stock:142, status:"active", createdAt:"2024-01-20T00:00:00Z" },
  { id:"prod_003", name:"Quantum Storage Array 4TB", sku:"QSA-003", category:"Storage", price:849.00, stock:0, status:"inactive", createdAt:"2024-02-01T00:00:00Z" },
  { id:"prod_004", name:"Teal Fusion Keyboard", sku:"TFK-004", category:"Peripherals", price:349.99, stock:320, status:"active", createdAt:"2024-02-10T00:00:00Z" },
  { id:"prod_005", name:"CEO Command Module", sku:"CCM-005", category:"Software", price:9999.99, stock:12, status:"active", createdAt:"2024-02-20T00:00:00Z" },
  { id:"prod_006", name:"WOWDamn Starter Pack", sku:"WSP-006", category:"Bundles", price:199.99, stock:500, status:"active", createdAt:"2024-03-01T00:00:00Z" },
  { id:"prod_007", name:"Holo Projector Mini", sku:"HPM-007", category:"Electronics", price:599.99, stock:57, status:"active", createdAt:"2024-03-15T00:00:00Z" },
  { id:"prod_008", name:"Revenue Analytics Suite", sku:"RAS-008", category:"Software", price:4999.99, stock:999, status:"active", createdAt:"2024-04-01T00:00:00Z" },
  { id:"prod_009", name:"Workflow Automation Engine", sku:"WAE-009", category:"Software", price:2999.99, stock:999, status:"active", createdAt:"2024-04-10T00:00:00Z" },
  { id:"prod_010", name:"Teal Spine Cable Set", sku:"TSC-010", category:"Accessories", price:89.99, stock:1200, status:"active", createdAt:"2024-05-01T00:00:00Z" },
];

router.get("/", auth, (req, res) => {
  const { search, category, status } = req.query;
  let p = MOCK_PRODUCTS.filter(p => {
    if (category && p.category !== category) return false;
    if (status && p.status !== status) return false;
    if (search) { const s = search.toLowerCase(); if (!p.name.toLowerCase().includes(s) && !p.sku.toLowerCase().includes(s)) return false; }
    return true;
  });
  res.json(p);
});

router.get("/:id", auth, (req, res) => {
  const p = MOCK_PRODUCTS.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

router.post("/", auth, requireRole("owner", "admin"), (req, res) => {
  const p = { id: `prod_${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  MOCK_PRODUCTS.push(p);
  res.status(201).json(p);
});

router.patch("/:id", auth, requireRole("owner", "admin"), (req, res) => {
  const idx = MOCK_PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...req.body };
  res.json(MOCK_PRODUCTS[idx]);
});

router.delete("/:id", auth, requireRole("owner"), (req, res) => {
  const idx = MOCK_PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  MOCK_PRODUCTS.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
