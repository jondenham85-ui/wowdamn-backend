const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const morgan  = require("morgan");
const { globalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const ALLOWED = [
  "https://www.madmadisonai.com",
  "https://madmadisonai.com",
  "https://wowdamn.vercel.app",
  "https://wowdamn-frontend.vercel.app",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(helmet());
app.use(cors({ origin: ALLOWED, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(globalLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "2.0.0", ts: new Date().toISOString() });
});

app.use("/api/auth",          require("./routes/auth"));
app.use("/api/engines",       require("./routes/engines"));
app.use("/api/system",        require("./routes/system"));
app.use("/api/ceo",           require("./routes/ceo"));
app.use("/api/verifications", require("./routes/verifications"));
app.use("/api/users",         require("./routes/users"));
app.use("/api/products",      require("./routes/products"));
app.use("/api/revenue",       require("./routes/revenue"));
app.use("/api/payments",      require("./routes/payments"));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

module.exports = app;
