const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "wowdamn-dev-secret-change-in-prod";

const auth = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
          req.user = jwt.verify(token, JWT_SECRET);
          next();
    } catch {
          return res.status(401).json({ error: "Invalid or expired token" });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(req.user.role)) {
          return res.status(403).json({ error: `Requires role: ${roles.join(" or ")}` });
    }
    next();
};

const optionalAuth = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
          try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
    }
    next();
};

module.exports = { auth, requireRole, optionalAuth, JWT_SECRET };
