const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");
router.post("/:id/comments", protect, commentController.createComment);
router.get("/:id/comments", protect, commentController.getComments);
router.patch("/:id/comments/:commentId", protect, commentController.updateComment);
router.delete("/:id/comments/:commentId", protect, commentController.deleteComment);

module.exports = router;