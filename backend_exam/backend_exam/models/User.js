const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref : 'Role',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('User', UserSchema);