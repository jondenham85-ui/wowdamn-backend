const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ["owner","ceo","admin","member"], default: "member" },
  tier: { type: String, enum: ["spark","blaze","inferno","titan","omega"], default: "spark" },
  verified: { type: Boolean, default: false },
  avatar: { type: String, default: null },
  lastLogin: { type: Date },
  revenue: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

UserSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.virtual("safe").get(function() {
  return { id: this._id, name: this.name, email: this.email, role: this.role, tier: this.tier, verified: this.verified, avatar: this.avatar, createdAt: this.createdAt };
});

module.exports = mongoose.model("User", UserSchema);
