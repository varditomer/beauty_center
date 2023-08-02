const express = require('express')
const router = express.Router()

const { getAppointments, addAppointment, removeAppointment, getNextAppointment, getNextTreatment } = require('./appointmentController')

router.get('/:id', getAppointments)
router.get('/nextAppointment/:id', getNextAppointment)
router.get('/nextTreatment/:id', getNextTreatment)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment/:id', removeAppointment)

module.exports = router