require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
          console.log(`\n WOWDamn Backend v2.0 running on port ${PORT}`);
          console.log(` Environment : ${process.env.NODE_ENV || "development"}`);
          console.log(` API Base    : http://localhost:${PORT}/api\n`);
    });
})();
