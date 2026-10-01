let engineState = [
  { id: "product", name: "Product Engine", status: "active", power: 87, throughput: 2340, errorRate: 0.2, uptime: 99.8, color: "#00ffe0", icon: "Package" },
  { id: "revenue", name: "Revenue Engine", status: "active", power: 92, throughput: 1820, errorRate: 0.1, uptime: 99.9, color: "#00ff88", icon: "DollarSign" },
  { id: "workflow", name: "Workflow Engine", status: "active", power: 78, throughput: 890, errorRate: 0.4, uptime: 98.7, color: "#00d4ff", icon: "GitBranch" },
  { id: "tier", name: "Tier Engine", status: "active", power: 95, throughput: 450, errorRate: 0.05, uptime: 99.95, color: "#a855f7", icon: "Crown" },
];

const jitter = (val, pct = 0.05) =>
  parseFloat((val * (1 + (Math.random() - 0.5) * pct)).toFixed(2));

const getEngineState = () =>
  engineState.map(e => ({
    ...e,
    throughput: e.status === "active" ? jitter(e.throughput, 0.08) : 0,
    errorRate:  e.status === "active" ? jitter(e.errorRate,  0.2)  : 0,
  }));

const setEnginePower = (id, power) => {
  const engine = engineState.find(e => e.id === id);
  if (!engine) return null;
  engine.power = Math.max(0, Math.min(100, power));
  if (engine.power === 0) engine.status = "idle";
  else if (engine.power < 20) engine.status = "warning";
  else engine.status = "active";
  return { ...engine };
};

const controlEngine = (id, action) => {
  const engine = engineState.find(e => e.id === id);
  if (!engine) return null;
  switch (action) {
    case "start": engine.status = "active"; engine.power = engine.power < 10 ? 75 : engine.power; break;
    case "stop": engine.status = "idle"; engine.power = 0; break;
    case "restart":
      engine.status = "restarting";
      setTimeout(() => { engine.status = "active"; engine.power = 75; }, 2000);
      break;
    default: return null;
  }
  return { ...engine };
};

module.exports = { getEngineState, setEnginePower, controlEngine };
