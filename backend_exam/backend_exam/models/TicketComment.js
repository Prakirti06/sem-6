const Mongoose = required('mongoose');

const TicketCommentSchema = new Mongoose.Schema({
    ticket_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    user_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Mongoose.model('TicketComment', TicketCommentSchema);