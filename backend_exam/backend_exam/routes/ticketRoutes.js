const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const ticketController = require("../controllers/ticketController");
router.post(
  "/",
  protect,
  authorize("USER", "MANAGER"),
  ticketController.createTicket
);
router.get("/", protect, ticketController.getTickets);
router.get("/:id", protect, ticketController.getTicketById);
router.patch(
  "/:id/assign",
  protect,
  authorize("MANAGER", "SUPPORT"),
  ticketController.assignTicket
);
router.patch(
  "/:id/status",
  protect,
  authorize("MANAGER", "SUPPORT"),
  ticketController.updateTicketStatus
);
router.delete(
  "/:id",
  protect,
  authorize("MANAGER"),
  ticketController.deleteTicket
);

module.exports = router;