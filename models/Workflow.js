const mongoose = require("mongoose");

const WorkflowSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["order_processing","verification","notification","sync","report","custom"], default: "custom" },
  status: { type: String, enum: ["active","idle","completed","failed","queued"], default: "queued" },
  priority: { type: String, enum: ["low","normal","high","critical"], default: "normal" },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  steps: [{
    name: String,
    status: { type: String, enum: ["pending","running","done","failed"], default: "pending" },
    startedAt: Date,
    doneAt: Date,
  }],
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedAt: Date,
  failedAt: Date,
  errorMsg: String,
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

WorkflowSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Workflow", WorkflowSchema);
