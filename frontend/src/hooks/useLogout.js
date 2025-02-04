const express = require("express");

const router = express.Router();

// Logout Route
router.post("/api/logout", (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
