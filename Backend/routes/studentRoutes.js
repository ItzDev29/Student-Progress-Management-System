const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.getAllStudents);
router.post("/", studentController.addStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
router.post("/:id/refresh", studentController.refreshCFData);
router.get('/:id/profile', studentController.getStudentProfile);
router.patch('/:id/toggle-email', studentController.toggleReminderEmail);
router.post('/:id/send-reminder', studentController.sendReminder);

module.exports = router;
