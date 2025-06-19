const Student = require("../models/Student");
const { fetchCodeforcesData } = require("../services/codeforcesService");
const { sendReminderEmail } = require("../utils/emailService");

const runDailySync = async () => {
  try {
    const students = await Student.find();
    for (const student of students) {
      const data = await fetchCodeforcesData(student.codeforcesHandle);
      await Student.findByIdAndUpdate(student._id, {
        currentRating: data.currentRating,
        maxRating: data.maxRating,
        lastSyncedAt: new Date()
      });

      // Inactivity check
      const lastSubmission = new Date(data.lastSubmissionDate);
      const inactiveDays = (Date.now() - lastSubmission) / (1000 * 60 * 60 * 24);
      if (inactiveDays > 7 && student.reminderEnabled) {
        await sendReminderEmail(student);
        await Student.findByIdAndUpdate(student._id, {
          $inc: { reminderCount: 1 }
        });
      }
    }
    console.log("Daily sync completed");
  } catch (err) {
    console.error("Error during daily sync:", err);
  }
};

module.exports = runDailySync;