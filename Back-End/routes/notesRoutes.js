const express = require("express")
const router = express.Router()
const notesControllers = require('../controllers/notesController')


router.route('/')
    .get(notesControllers.getAllNotes)
    .post(notesControllers.createNewNote)
    .patch(notesControllers.updateNote)
    .delete(notesControllers.deleteNote)


router.route('/:id')
    .get(notesControllers.getNotesByUser)



module.exports = router