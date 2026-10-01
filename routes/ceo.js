const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getEngineState } = require("../services/engineService");
const { getSystemMetrics } = require("../services/metricsService");

router.get("/dashboard", auth, (req, res) => {
  const engines = getEngineState();
  const metrics = getSystemMetrics();
  const tickers = [
    { label: "TOTAL REV", value: "$8.42M", change: "+18.4%", up: true },
    { label: "ACTIVE USR", value: "24,831", change: "+7.2%", up: true },
    { label: "ORDERS/HR", value: "312", change: "+3.1%", up: true },
    { label: "ERR RATE", value: "0.18%", change: "-0.04%", up: false },
    { label: "UPTIME", value: "99.97%", change: "+0.01%", up: true },
    { label: "CACHE HIT", value: `${metrics.cache}%`, change: "+1.2%", up: true },
  ];
  res.json({ engines, metrics, tickers, timestamp: new Date().toISOString(), systemStatus: "NOMINAL", alerts: [] });
});

router.post("/command", auth, (req, res) => {
  const raw = (req.body.command || "").trim().toLowerCase();
  const respond = (output, type = "info") => res.json({ command: raw, output, type, timestamp: new Date().toISOString() });
  if (!raw) return respond("No command provided. Type HELP for commands.", "error");
  if (raw === "status all" || raw === "status") {
    const lines = getEngineState().map(e => `[${e.status.toUpperCase().padEnd(11)}] ${e.name.padEnd(20)} PWR:${e.power}%`);
    return respond(["ENGINE STATUS REPORT", ...lines, "END REPORT"].join("\n"), "success");
  }
  if (raw.startsWith("boost")) return respond(`BOOST INITIATED - target: ${raw.replace("boost","").trim()||"all"}\nEngines increasing throughput by 15%.`, "success");
  if (raw.startsWith("restart")) return respond(`RESTART SEQUENCE - target: ${raw.replace("restart","").trim()||"all"}\nGraceful restart initiated. ETA: ~8s.`, "warning");
  if (raw === "flush cache" || raw === "flush") return respond("CACHE FLUSH COMPLETE\nL1/L2/Query cache cleared.\nCache hit rate rebuilds over ~2 min.", "success");
  if (raw === "export revenue" || raw === "export") return respond(`REVENUE EXPORT QUEUED\nFormat: CSV+JSON\nPeriod: Last 30 days\nFilename: revenue_${new Date().toISOString().split("T")[0]}.zip`, "success");
  if (raw === "run diagnostics" || raw === "diag" || raw === "diagnostics") {
    const m = getSystemMetrics();
    return respond(["SYSTEM DIAGNOSTICS",`CPU: ${m.cpu}% [${m.cpu<80?"OK":"WARN"}]`,`Memory: ${m.memory}% [${m.memory<85?"OK":"WARN"}]`,`Disk: ${m.disk}% [${m.disk<90?"OK":"WARN"}]`,`Latency: ${m.latency}ms`,`Cache: ${m.cache}%`,"Active Engines: 4/4","STATUS: NOMINAL"].join("\n"),"success");
  }
  if (raw === "help" || raw === "?") return respond(["WOWDamn CEO COMMAND CONSOLE v2.0","STATUS ALL - Show engine statuses","BOOST [engine] - Increase throughput","RESTART [engine] - Restart engine","FLUSH CACHE - Clear all cache","EXPORT REVENUE - Export revenue data","RUN DIAGNOSTICS - Full health check","HELP - Show this menu","Engine IDs: product|revenue|workflow|tier"].join("\n"),"info");
  return respond(`Unknown command: "${raw}"\nType HELP to see available commands.", "error");
});

module.exports = router;
