const express = require('express')
const router = express.Router()

const { updateProfile,login, signup, initiateResetPassword, resetPassword } = require('./userController')

router.post('/login', login)
router.post('/signup', signup)
router.get('/initiateResetPassword/:mail', initiateResetPassword)
router.post('/resetPassword', resetPassword)
router.put('/updateProfile', updateProfile)

module.exports = router