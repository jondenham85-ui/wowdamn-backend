const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "wowdamn-dev-secret");
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET || "wowdamn-dev-secret"); } catch {}
  }
  next();
};

module.exports = { auth, optionalAuth };
