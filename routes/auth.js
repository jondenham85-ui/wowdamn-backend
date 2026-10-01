const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "wowdamn-dev-secret";

const MOCK_USERS = [
  { _id: "usr_owner_001", name: "Jon Denham", email: "jon@wowdamn.com", passwordHash: bcrypt.hashSync("wowdamn2024!", 10), role: "owner", tier: "omega", verified: true, avatar: null, createdAt: "2024-01-01T00:00:00Z" },
  { _id: "usr_ceo_001", name: "MadMadison CEO", email: "ceo@wowdamn.com", passwordHash: bcrypt.hashSync("ceomode2024!", 10), role: "ceo", tier: "titan", verified: true, avatar: null, createdAt: "2024-01-15T00:00:00Z" },
  { _id: "usr_admin_001", name: "Admin User", email: "admin@wowdamn.com", passwordHash: bcrypt.hashSync("admin2024!", 10), role: "admin", tier: "inferno", verified: true, avatar: null, createdAt: "2024-02-01T00:00:00Z" },
];

const makeToken = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role, tier: user.tier }, JWT_SECRET, { expiresIn: "7d" });
const safeUser = (u) => ({ id: u._id?.toString(), name: u.name, email: u.email, role: u.role, tier: u.tier, verified: u.verified, avatar: u.avatar || null, createdAt: u.createdAt });

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    let user = MOCK_USERS.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    return res.json({ user: safeUser(user), token: makeToken(user) });
  } catch (err) { next(err); }
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = MOCK_USERS.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(safeUser(user));
  } catch (err) { next(err); }
});

module.exports = router;
