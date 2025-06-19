const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  codeforcesHandle: String,
  currentRating: Number,
  maxRating: Number,
  lastSyncedAt: Date,

  reminderCount: { type: Number, default: 0 },
  disableReminderEmails: { type: Boolean, default: false },

  contests: { type: Array, default: [] },
  stats: {
  totalSolved: Number,
  toughest: String,
  avgRating: Number,
  avgDaily: Number,
  ratingBuckets: [{ range: String, count: Number }],
},
  submissionHeatmap: { type: Array, default: [] },
});

module.exports = mongoose.model("Student", studentSchema);
