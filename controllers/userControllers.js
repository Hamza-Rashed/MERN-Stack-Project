const User = require('../modles/User')
const Note = require("../modles/Note")
const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt")

// @decs GET all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()

    if (!users?.length) {
        return res.status(400).json({ message: 'No Users Found!' })
    }

    res.json(users)
})

// @decs GET all users
// @route GET /user
// @access Private

const getUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ message: "The ID is required" })

    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: `User ID => ${id} Not Found` })

    const userData = {
        username: user.username,
        roles: user.roles,
        active: user.active
    }
    res.json(userData)

})

// @decs create a user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm Data is not empty
    if (!username || !password || !roles.length || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'All Fileds Are Required' })
    }

    // Check if duplicate
    const findUser = await User.findOne({ username }).lean().exec()
    if (findUser) {
        return res.status(403).json({ message: `User ${username} Already Created!` })
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10)
    const newUser = { username, 'password': hashedPwd, roles }

    // Store and send the user to DB
    const user = await User.create(newUser)
    
    if (!user) return res.status(400).json({ message: 'Invalid Response!' })
    console.log(user);
    return res.status(201).json(`User ${username} Created!`)

})

// @decs update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    // Get the data
    const { id, username, active, password, roles } = req.body

    // Confirm Data thet not empty
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All Fields Are Required' })
    }

    // Find user that we need to update
    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: `User ${username} Not Found` })

    // Check for duplicate after update
    const duplicateUser = await User.findOne({ username }).lean().exec()
    if (duplicateUser && duplicateUser?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Update the data
    user.username = username
    user.roles = roles
    user.active = active
    if (password) {
        // Need to Hash the new password
        const hashedNewPwd = await bcrypt.hash(password, 10)
        user.password = hashedNewPwd
    }

    // Save the changes on Mongo DB then send the response back to the front end

    const updatedUser = await user.save()

    res.status(200).json({ message: `${updatedUser.username} Updated` })

})

// @decs delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    // Get id and confirm data
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'The ID is required' })

    // check if there are any notes for that user .. If we have any notes for this user we can't delete it
    const userNotes = await Note.findOne({ user: id }).lean().exec()
    if (userNotes) return res.status(400).json({ message: `Can't delete a user has assigned notes` })

    // find the user that we need to delete it and check if exist or not
    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: "User not found" })

    // Delete the user and send a response back to the front end
    const userDeleted = await user.deleteOne()

    const response = `User ${userDeleted.username} => ID ${userDeleted.id} deleted`

    res.status(200).json(response)

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}