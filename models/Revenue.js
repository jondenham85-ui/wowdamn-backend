const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, default: () => `ORD-${Date.now()}` },
  customer: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending","completed","refunded","failed"], default: "pending" },
  category: { type: String, default: "Other" },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    qty: Number,
    price: Number,
  }],
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

RevenueSchema.index({ createdAt: -1 });
RevenueSchema.index({ status: 1 });

module.exports = mongoose.model("Revenue", RevenueSchema);
