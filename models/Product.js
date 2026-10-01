const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
  category: { type: String, enum: ["Electronics","Software","Bundles","Peripherals","Accessories","Storage","Other"], default: "Other" },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["active","inactive","archived"], default: "active" },
  description: { type: String, default: "" },
  image: { type: String, default: null },
  tags: [String],
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

ProductSchema.index({ name: "text", sku: "text" });

module.exports = mongoose.model("Product", ProductSchema);
