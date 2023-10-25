const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose)

const noteSchema = mongoose.Schema(
    {
        // The user here which mean each note will be assigned to one user .. So each user has many notes (One to Many)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },

        title: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        completed: {
            type: Boolean,
            default: false
        }

    },

    // Mongo DB allow to us create 2 fildes (Created At + Updated At) for each record using below object

    { timestamp: true }
)

// Mongo DB always generate a long ID string with each record .. So AutoIncremnent ways makes this esear to do
// noteSchema.plugin(AutoIncrement, {
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 500
// })

module.exports = mongoose.model("Note", noteSchema)