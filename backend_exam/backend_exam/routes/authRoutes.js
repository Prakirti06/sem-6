const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
router.post("/login", authController.login);

module.exports = router;
