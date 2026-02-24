const Mongoose = required('mongoose');

const TicketStatusLogSchema = new Mongoose.Schema({
    ticket_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    old_status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        required: true,
    },
    new_status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        required: true,
    },
    changed_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    changed_at: {
        type: Date,
        default: Date.now,
    },
})

module.exports = Mongoose.model('TicketStatusLog', TicketStatusLogSchema);