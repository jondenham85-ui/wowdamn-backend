// MADAI Backend Core
const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const morgan  = require("morgan");

const { globalLimiter } = require("./middleware/rateLimiter");
const errorHandler      = require("./middleware/errorHandler");

const app = express();

// MADAI Frontend Allowed Origins
const ALLOWED = [
  "https://www.madmadisonai.com",
  "https://madmadisonai.com",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

// Security + Core Middleware
app.use(helmet());
app.use(cors({ origin: ALLOWED, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(globalLimiter);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "MADAI Backend",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
  });
});

// MADAI Core Routes
app.use("/api/auth",          require("./routes/auth"));          // login, signup, reset
app.use("/api/madai",         require("./routes/madai"));         // AI engine
app.use("/api/products",      require("./routes/products"));      // ShopMAD
app.use("/api/logs",          require("./routes/logs"));          // system + AI logs
app.use("/api/settings",      require("./routes/settings"));      // owner settings

// Legacy WOWDamn routes (still available, but deprecated)
app.use("/api/engines",       require("./routes/engines"));
app.use("/api/system",        require("./routes/system"));
app.use("/api/ceo",           require("./routes/ceo"));
app.use("/api/verifications", require("./routes/verifications"));
app.use("/api/users",         require("./routes/users"));
app.use("/api/revenue",       require("./routes/revenue"));
app.use("/api/payments",      require("./routes/payments"));

// 404 Handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
