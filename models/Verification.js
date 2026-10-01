const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  type: { type: String, enum: ["identity","business","tier_upgrade","payment","other"], default: "identity" },
  status: { type: String, enum: ["pending","reviewing","approved","rejected"], default: "pending" },
  documents: [String],
  notes: { type: String, default: null },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  reviewedAt: { type: Date, default: null },
  submittedAt: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

VerificationSchema.index({ status: 1, submittedAt: -1 });
VerificationSchema.index({ userId: 1 });

module.exports = mongoose.model("Verification", VerificationSchema);
