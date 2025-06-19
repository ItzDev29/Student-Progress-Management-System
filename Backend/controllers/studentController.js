const Student = require("../models/Student");
const { fetchCodeforcesData } = require("../services/codeforcesService");
const { sendReminderEmail } = require("../utils/emailService");

// @desc   Get all students
// @route  GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

// @desc   Add a new student
// @route  POST /api/students
exports.addStudent = async (req, res) => {
  
  try {
    const student = new Student(req.body);
    await student.save();

    const cfData = await fetchCodeforcesData(student.codeforcesHandle);
    student.currentRating = cfData.currentRating;
    student.maxRating = cfData.maxRating;
    student.lastSyncedAt = new Date();
    await student.save();

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  
};

// @desc   Update student info
// @route  PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    const oldHandle = student.codeforcesHandle;
    Object.assign(student, req.body);

    if (oldHandle !== student.codeforcesHandle) {
      const cfData = await fetchCodeforcesData(student.codeforcesHandle);
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.lastSyncedAt = new Date();
    }

    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc   Delete a student
// @route  DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc   Manually refresh Codeforces data
// @route  POST /api/students/:id/refresh
exports.refreshCFData = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    const cfData = await fetchCodeforcesData(student.codeforcesHandle);
    student.currentRating = cfData.currentRating;
    student.maxRating = cfData.maxRating;
    student.lastSyncedAt = new Date();
    await student.save();

    res.status(200).json({ message: "CF data refreshed", student });
  } catch (err) {
    res.status(500).json({ error: "Failed to refresh Codeforces data." });
  }
};

// @desc   Get detailed student Codeforces profile
// @route  GET /api/students/:id/profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({
      name: student.name,
      contests: student.contests || [],
      stats: student.stats || {},
      submissionHeatmap: student.submissionHeatmap || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load student profile." });
  }
};

// @desc   Toggle reminder emails on/off
// @route  PATCH /api/students/:id/toggle-email
exports.toggleReminderEmail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.disableReminderEmails = !student.disableReminderEmails;
    await student.save();

    res.status(200).json({ disabled: student.disableReminderEmails });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle email setting." });
  }
};

exports.sendReminder = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.disableReminderEmails) {
      return res.status(400).json({ message: "Reminder emails are disabled for this student." });
    }

    await sendReminderEmail(student);

    student.reminderCount += 1;
    await student.save();

    res.status(200).json({ message: "Reminder sent" });
  } catch (err) {
    console.error("Send reminder error:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
};
