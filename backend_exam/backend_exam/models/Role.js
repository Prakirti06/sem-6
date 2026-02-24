const Mongoose = require ('mongoose');

const RoleSchema = new Mongoose.Schema({
    name : {
        type: String,
        enum: ["MANAGER", "SUPPORT", "USER"],
        required: true,
        unique: true,
    },
})

module.exports = Mongoose.model('Role', RoleSchema);