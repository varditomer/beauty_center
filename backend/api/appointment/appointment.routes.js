const express = require('express')
const router = express.Router()

const { getAppointments, addAppointment, removeAppointment,getNextAppointments} = require('./appointmentController')

router.get('/:id', getAppointments)
router.get('/nextAppointment/:id', getNextAppointments)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment', removeAppointment)

module.exports = router