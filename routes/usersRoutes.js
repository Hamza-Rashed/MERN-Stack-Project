const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/userControllers")

router.route('/')
    .get(userControllers.getAllUsers)
    .post(userControllers.createNewUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser)

router.route('/:id')
    .get(userControllers.getUser)


module.exports = router
