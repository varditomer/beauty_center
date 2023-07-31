const express = require('express')
const router = express.Router()

const { getAppointments, addAppointment, removeAppointment} = require('./appointmentController')

router.get('/:id', getAppointments)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment', removeAppointment)

module.exports = router