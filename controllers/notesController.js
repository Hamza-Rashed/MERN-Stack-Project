const Note = require("../modles/Note")
const asyncHandler = require('express-async-handler')
const User = require("../modles/User")


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()

    if (!notes?.length) return res.status(400).json({ message: "There are no notes" })

    return res.status(200).json(notes)
})

const getNotesByUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json({ message: "User ID is required" })

    const user = await User.findById(userId).exec()
    if (!user) return res.status(400).json({ message: `ID User = ${userId} Not Found` })

    const notes = await Note.findOne({ user: userId }).lean().exec()
    if (!notes?.length) return res.status(400).json({ message: "There are no notes for this user" })

    return res.status(200).json(notes)
})

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text, completed } = req.body
    if (!user || !title || !text || !completed || typeof completed !== 'boolean') return res.status(400).json({ message: "All Fields are required" })

    // Check if there are a user to create a note for him
    const userToCreateNote = await User.findById(user).exec()
    if(!userToCreateNote) return res.status(400).json({message: `Please insert a correct user to create a note`})

    // Check if there is the same note for the same user
    const notesUser = await Note.findOne({ user, title}).lean().exec()
    if (notesUser) return res.status(403).json({ message: "Can't make a duplicate note for the same user" })

    const note = await Note.create({ user, title, text, completed })
    console.log(note);
    if (!note) return res.status(400).json({ message: "Invalid Response!" })
    
    return res.status(201).json({message: `Note: ${note.title} Created`})
})

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body
    if (!id || !user || !title || !text || !completed || typeof completed !== 'boolean') return res.status(400).json({ message: "All Fields are required" })

    const note = await Note.findById(id).exec()
    if (!note) return res.status(400).json({ message: `Note ID => ${id} Not Found` })

    const duplicateNote = await Note.findOne({title}).lean().exec()
    if(duplicateNote && duplicateNote.user === user) return res.status(409).json({message: "Duplicate Note for the same user"})

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updateNote = await Note.save()

    return res.status(200).json({messaage: `Note: ${updateNote.title} Updated!`})


})

const deleteNote = asyncHandler(async (req, res) => {
    const {id} = req.body
    if(!id) return res.status(400).json({message: "ID is required"})

    const note = await Note.findById(id).exec()
    if(!note) return res.status(400).json({message: "Note not found to delete"})

    const deleteNote = await note.deleteOne()

    return res.status(200).json({message: `Note: ${deleteNote.title} Deleted`})

})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote,
    getNotesByUser
}