const express = require("express");
const router = express.router();
const { protect, authorize } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/",protect, authorize("MANAGER"), userController.getAllUsers);
router.get("/:id", protect,userController.getUserById);
router.post("/", protect, authorize("MANAGER"), userController.createUser);
router.put("/:id", protect,userController.updateUser);
router.delete("/:id", protect, authorize("MANAGER"), userController.deleteUser);

module.exports = router;