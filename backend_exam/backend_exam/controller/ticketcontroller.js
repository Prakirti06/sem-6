const Ticket = require("../models/Ticket");
const TicketStatusLog = require("../models/TicketStatusLog");
const User = require("../models/User");

const STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["CLOSED"],
  CLOSED: []
};


exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const created_by = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }
    if (title.length < 5) {
      return res.status(400).json({ message: "Title must be at least 5 characters" });
    }
    if (description.length < 10) {
      return res.status(400).json({ message: "Description must be at least 10 characters" });
    }
    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority!Please check for correct priority values." });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "MEDIUM",
      created_by
    });

    await ticket.populate([
      { path: "created_by", select: "id name email" },
      { path: "assigned_to", select: "id name email" }
    ]);

    res.status(201).json(formatTicket(ticket));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "MANAGER") {
      query = {};
    } else if (req.user.role === "SUPPORT") {
      query = { assigned_to: req.user.id };
    } else if (req.user.role === "USER") {
      query = { created_by: req.user.id };
    }

    const tickets = await Ticket.find(query)
      .populate([
        { path: "created_by", select: "id name email" },
        { path: "assigned_to", select: "id name email" }
      ])
      .sort({ created_at: -1 });

    res.json(tickets.map(formatTicket));
  } catch (error) {
    res.status(400).json({ message: "Error fetching all tickets!" });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate([
      { path: "created_by", select: "id name email role_id" },
      { path: "assigned_to", select: "id name email role_id" }
    ]);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (
      req.user.role !== "MANAGER" &&
      req.user.role !== "SUPPORT" &&
      ticket.created_by._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Access denied to this ticket!" });
    }

    res.json(formatTicket(ticket));
  } catch (error) {
    res.status(400).json({ message: "Error fetching ticket by its id!"});
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const assignUser = await User.findById(userId).populate("role_id");
    if (!assignUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (assignUser.role_id.name === "USER") {
      return res.status(400).json({ message: "Cannot assign to USER role" });
    }

    ticket.assigned_to = userId;
    await ticket.save();

    await ticket.populate([
      { path: "created_by", select: "id name email" },
      { path: "assigned_to", select: "id name email" }
    ]);

    res.json(formatTicket(ticket));
  } catch (error) {
    res.status(400).json({ message: "Error assigning ticket!" });
  }
};


exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    if (!["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status! Please check for correct status values." });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (!STATUS_TRANSITIONS[ticket.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${ticket.status} to ${status}`
      });
    }

    await TicketStatusLog.create({
      ticket_id: ticket._id,
      old_status: ticket.status,
      new_status: status,
      changed_by: req.user.id
    });

    ticket.status = status;
    await ticket.save();

    await ticket.populate([
      { path: "created_by", select: "id name email" },
      { path: "assigned_to", select: "id name email" }
    ]);

    res.json(formatTicket(ticket));
    res.json({message: 'Ticket status updated successfully!'});
  } catch (error) {
    res.status(400).json({ message: 'Error updating ticket status!' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    await TicketStatusLog.deleteMany({ ticket_id: req.params.id });

    res.status(204).send();
    res.json({ message: "Role deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message:"Error deleting ticket!" });
  }
};

function formatTicket(ticket) {
  return {
    id: ticket._id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    created_by: ticket.created_by ? {
      id: ticket.created_by._id,
      name: ticket.created_by.name,
      email: ticket.created_by.email
    } : null,
    assigned_to: ticket.assigned_to ? {
      id: ticket.assigned_to._id,
      name: ticket.assigned_to.name,
      email: ticket.assigned_to.email
    } : null,
    created_at: ticket.created_at
  };
};
