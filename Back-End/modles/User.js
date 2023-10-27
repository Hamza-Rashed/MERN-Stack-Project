const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    // We put roles inside an array because each user may have more that one note
    roles: [{
        type: String,
        default: "Employee"
    }],

    active: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('User', userSchema)