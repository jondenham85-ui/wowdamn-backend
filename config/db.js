const mongoose = require("mongoose");
let connected = false;

const connectDB = async () => {
  if (connected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.warn("MONGODB_URI not set — mock-data mode"); return; }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 10 });
    connected = true;
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB failed:", err.message);
    console.warn("Falling back to mock-data mode");
  }
};

module.exports = connectDB;
module.exports.isConnected = () => connected;
