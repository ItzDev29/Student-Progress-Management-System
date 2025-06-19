const express = require("express");
const router = express.Router();
const { fetchCodeforcesData } = require("../services/codeforcesService");
const Student = require("../models/Student");

// Manual sync by handle
router.post("/handle", async (req, res) => {
  const { handle } = req.body;
  try {
    const data = await fetchCodeforcesData(handle);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;