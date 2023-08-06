const express = require('express')
const router = express.Router()

const { login, signup, initiateResetPassword, resetPassword } = require('./userController')

router.post('/login', login)
router.post('/signup', signup)
router.get('/initiateResetPassword/:mail', initiateResetPassword)
router.post('/resetPassword', resetPassword)

module.exports = router