const Mongoose = required('mongoose');

const TicketSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        default: "OPEN",
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "MEDIUM",
    },
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assigned_to: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    created_at:{
        type: Date,
        default: Date.now,
    }
})

module.exports = Mongoose.model('Ticket', TicketSchema);