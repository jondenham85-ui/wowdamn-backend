// routes/madai.js
const express = require("express");
const router = express.Router();
const db = require("../models/db"); // your DB connector
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

const JWT_SECRET = process.env.JWT_SECRET || "madai_dev_secret";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_KEY,
});

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
// MADAI AI ENGINE
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt)
      return res.status(400).json({ error: "Missing prompt" });

    // Owner verification
    const owner = verifyOwner(req);
    if (!owner)
      return res.status(401).json({ error: "Unauthorized" });

    // Run MADAI AI engine
    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MADAI, the holographic AI COO for Jon Denham. Respond with clarity, precision, and operator-level intelligence.",
        },
        { role: "user", content: prompt },
      ],
    });

    const reply = ai.choices[0]?.message?.content || "";

    // Log AI interaction
    await db.query(
      "INSERT INTO madai_logs (owner_id, prompt, reply) VALUES ($1, $2, $3)",
      [owner.id, prompt, reply]
    );

    res.json({
      ok: true,
      reply,
      owner: owner.email,
      message: "MADAI response generated",
    });
  } catch (err) {
    console.error("MADAI error:", err);
    res.status(500).json({ error: "MADAI engine failure" });
  }
});

module.exports = router;
