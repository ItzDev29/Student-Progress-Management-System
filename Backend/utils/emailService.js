// utils/sendReminderEmail.js
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendReminderEmail = async ({ name, email }) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "⏰ Time to get back to problem solving!",
      html: `<p>Hi ${name},</p>
             <p>We noticed you haven't solved any Codeforces problems in the last 7 days. 
             Don't lose momentum — get back to the grind 💪.</p>
             <p>Keep pushing!</p>
             <p> – Student Progress Tracker Bot</p>`
    });
    return data;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return null;
  }
};

module.exports = sendReminderEmail;
