const cron = require("node-cron");
const Student = require("../models/Student");
const { fetchCodeforcesData } = require("../services/codeforcesService");
const { sendReminderEmail } = require("../utils/emailService");

// Schedule: Every day at 2:00 AM
const scheduleDailyCFUpdate = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Starting daily Codeforces sync at 2 AM...");

    try {
      const students = await Student.find();

      for (const student of students) {
        if (!student.disableReminderEmails) {
          const lastSubmissionDate = new Date(
            student.stats?.lastSubmission || 0
          );
          const now = new Date();
          const daysInactive =
            (now - lastSubmissionDate) / (1000 * 60 * 60 * 24);

          if (daysInactive > 7) {
            const result = await sendReminderEmail({
              name: student.name,
              email: student.email,
            });
            if (result) {
              student.reminderCount = (student.reminderCount || 0) + 1;
              console.log(`📧 Reminder sent to ${student.name}`);
            }
          }
        }
        try {
          const cfData = await fetchCodeforcesData(student.codeforcesHandle);
          student.currentRating = cfData.currentRating;
          student.maxRating = cfData.maxRating;
          student.lastSyncedAt = new Date();
          student.contests = cfData.contests;
          student.stats = cfData.stats;
          student.submissionHeatmap = cfData.submissionHeatmap;
          await student.save();
          console.log(`✅ Synced ${student.name}`);
        } catch (err) {
          console.error(`❌ Failed to sync ${student.name}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error("🚨 Cron job error:", err.message);
    }

    console.log("✅ Daily Codeforces sync completed.");
  });
};

module.exports = scheduleDailyCFUpdate;
