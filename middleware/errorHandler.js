const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ error: `${field} already exists` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (err.message && err.message.startsWith("CORS")) {
    return res.status(403).json({ error: err.message });
  }

  const status  = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : "Internal server error";
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
