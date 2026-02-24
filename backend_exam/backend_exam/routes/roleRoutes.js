const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const roleController = require("../controllers/roleController");

router.post("/", protect, authorize("MANAGER"), roleController.createRole);
router.get("/", protect, roleController.getRoles);
router.get("/:id", protect, roleController.getRoleById);
router.put("/:id", protect, authorize("MANAGER"), roleController.updateRole);
router.delete("/:id", protect, authorize("MANAGER"), roleController.deleteRole);

module.exports = router;

