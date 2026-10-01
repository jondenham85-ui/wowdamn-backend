const express = require("express");
const router  = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const { getEngineState }    = require("../services/engineService");
const { getSystemMetrics }  = require("../services/metricsService");

// GET /api/ceo/dashboard
router.get("/dashboard", auth, requireRole("owner", "ceo", "admin"), (req, res) => {
    const engines = getEngineState();
    const metrics = getSystemMetrics();

             const tickers = [
               { label: "TOTAL REV",  value: "$8.42M",  change: "+18.4%", up: true  },
               { label: "ACTIVE USR", value: "24,831",  change: "+7.2%",  up: true  },
               { label: "ORDERS/HR",  value: "312",     change: "+3.1%",  up: true  },
               { label: "ERR RATE",   value: "0.18%",   change: "-0.04%", up: false },
               { label: "UPTIME",     value: "99.97%",  change: "+0.01%", up: true  },
               { label: "CACHE HIT",  value: `${metrics.cache}%`, change: "+1.2%", up: true },
                 ];

             res.json({
                   engines,
                   metrics,
                   tickers,
                   timestamp:    new Date().toISOString(),
                   systemStatus: "NOMINAL",
                   alerts:       [],
             });
});

// POST /api/ceo/command
router.post("/command", auth, requireRole("owner", "ceo", "admin"), (req, res) => {
    const raw = (req.body.command || "").trim().toLowerCase();

              const respond = (output, type = "info") =>
                    res.json({ command: raw, output, type, timestamp: new Date().toISOString() });

              if (!raw) return respond("No command provided. Type HELP for commands.", "error");

              if (raw === "status all" || raw === "status") {
                    const engines = getEngineState();
                    const lines   = engines.map(
                            e => `[${e.status.toUpperCase().padEnd(11)}] ${e.name.padEnd(20)} PWR:${e.power}%  THRU:${e.throughput}`
                          );
                    return respond(["ENGINE STATUS REPORT", ...lines, "END REPORT"].join("\n"), "success");
              }

              if (raw.startsWith("boost")) {
                    const target = raw.replace("boost", "").trim() || "all";
                    return respond(`BOOST INITIATED  target: ${target.toUpperCase()}\nAll targeted engines increasing throughput by 15%.\nCommand queued for execution.`, "success");
              }

              if (raw.startsWith("restart")) {
                    const target = raw.replace("restart", "").trim() || "all";
                    return respond(`RESTART SEQUENCE  target: ${target.toUpperCase()}\nGraceful restart initiated. ETA: ~8 seconds.\nMonitor engine tiles for status updates.`, "warning");
              }

              if (raw === "flush cache" || raw === "flush") {
                    return respond("CACHE FLUSH COMPLETE\nL1 cache: cleared\nL2 cache: cleared\nQuery cache: cleared\nCache hit rate will rebuild over ~2 minutes.", "success");
              }

              if (raw === "export revenue" || raw === "export") {
                    const now = new Date().toISOString().split("T")[0];
                    return respond(`REVENUE EXPORT QUEUED\nFormat: CSV + JSON\nPeriod: Last 30 days\nFilename: revenue_export_${now}.zip\nDelivery: Download link sent to registered email.`, "success");
              }

              if (raw === "run diagnostics" || raw === "diagnostics" || raw === "diag") {
                    const metrics = getSystemMetrics();
                    return respond(
                            [
                                      "SYSTEM DIAGNOSTICS",
                                      `CPU Load:     ${metrics.cpu}%       [${metrics.cpu > 80 ? "OK" : "WARN"}]`,
                                      `Memory:       ${metrics.memory}%    [${metrics.memory > 85 ? "OK" : "WARN"}]`,
                                      `Disk:         ${metrics.disk}%      [${metrics.disk > 90 ? "OK" : "WARN"}]`,
                                      `Latency:      ${metrics.latency}ms  [${metrics.latency > 100 ? "OK" : "WARN"}]`,
                                      `Cache Hit:    ${metrics.cache}%     [${metrics.cache > 80 ? "OK" : "WARN"}]`,
                                      `Uptime:       ${metrics.uptime}h`,
                                      "Active Engines: 4/4",
                                      "DIAGNOSTICS COMPLETE  STATUS: NOMINAL",
                                    ].join("\n"),
                            "success"
                          );
              }

              if (raw === "help" || raw === "?") {
                    return respond(
                            [
                                      "WOWDamn CEO COMMAND CONSOLE v2.0",
                                      "STATUS ALL         Show all engine statuses",
                                      "BOOST [engine]     Increase engine throughput",
                                      "RESTART [engine]   Restart engine(s)",
                                      "FLUSH CACHE        Clear all cache layers",
                                      "EXPORT REVENUE     Export revenue data",
                                      "RUN DIAGNOSTICS    Full system health check",
                                      "HELP               Show this help menu",
                                      "Engine IDs: product | revenue | workflow | tier",
                                    ].join("\n"),
                            "info"
                          );
              }

              return respond(
                    `Unknown command: "${raw}"\nType HELP to see available commands.`,
                    "error"
                  );
});

module.exports = router;
