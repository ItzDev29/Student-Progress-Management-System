const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutes");
const syncRoutes = require("./routes/syncRoutes");
const cron = require("node-cron");
const runDailySync = require("./cron/dailySync");
const connectDB = require("./config/db");
const scheduleDailyCFUpdate = require("./cron/syncCodeforces");

scheduleDailyCFUpdate(); 
require("dotenv").config();
connectDB();
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/students", studentRoutes);
app.use("/api/sync", syncRoutes);

// Cron job - Runs daily at 2AM
cron.schedule("0 2 * * *", runDailySync);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));