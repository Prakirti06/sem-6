const TicketComment = require("../models/TicketComment");
const Ticket = require("../models/Ticket");

async function checkTicketAccess(ticketId, userId, userRole) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return null;

  if (userRole === "MANAGER") return ticket;
  if (
    userRole === "SUPPORT" &&
    ticket.assigned_to &&
    ticket.assigned_to.toString() === userId.toString()
  ) {
    return ticket;
  }
  if (ticket.created_by.toString() === userId.toString()) return ticket;

  return false;
}

exports.createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const ticket_id = req.params.id;
    const user_id = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: "Comment required" });
    }

    const access = await checkTicketAccess(ticket_id, user_id, req.user.role);
    if (access === false) {
      return res.status(403).json({ message: "Access denied!" });
    }
    if (!access) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newComment = await TicketComment.create({
      ticket_id,
      user_id,
      comment
    });

    await newComment.populate({
      path: "user_id",
      select: "id name email role_id"
    });

    res.status(201).json(formatComment(newComment));
  } catch (error) {
    res.status(400).json({ message: "Error creating a comment!" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const access = await checkTicketAccess(ticket_id, req.user.id, req.user.role);
    if (access === false) {
      return res.status(403).json({ message: "Access denied!" });
    }
    if (!access) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comments = await TicketComment.find({ ticket_id })
      .populate({
        path: "user_id",
        select: "id name email role_id"
      })
      .sort({ created_at: 1 });

    res.json(comments.map(formatComment));
  } catch (error) {
    res.status(400).json({ message: "Error getting all comments!" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentId = req.params.commentId;

    if (!comment) {
      return res.status(400).json({ message: "Comment required" });
    }

    const existingComment = await TicketComment.findById(commentId).populate(
      "user_id"
    );

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (
      req.user.role !== "MANAGER" &&
      existingComment.user_id._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Access denied to this role!" });
    }

    existingComment.comment = comment;
    await existingComment.save();

    await existingComment.populate({
      path: "user_id",
      select: "id name email role_id"
    });

    res.json(formatComment(existingComment));
  } catch (error) {
    res.status(400).json({ message: "Error updating the comment!" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await TicketComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (
      req.user.role !== "MANAGER" &&
      comment.user_id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Access denied to this role!" });
    }

    await TicketComment.findByIdAndDelete(commentId);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error deleting the comment!" });
  }
};

function formatComment(comment) {
  return {
    id: comment._id,
    comment: comment.comment,
    user: {
      id: comment.user_id._id,
      name: comment.user_id.name,
      email: comment.user_id.email,
      role: {
        id: comment.user_id.role_id._id,
        name: comment.user_id.role_id.name
      },
      created_at: comment.user_id.created_at
    },
    created_at: comment.created_at
  };
}
