const express = require('express')
const router = express.Router()

const { getCustomerAppointments, getEmployeeAppointments, addAppointment, removeAppointment, getNextAppointment, getNextTreatment } = require('./appointmentController')

router.get('/:id', getCustomerAppointments)
router.get('/employee/:id', getEmployeeAppointments)
router.get('/nextAppointment/:id', getNextAppointment)
router.get('/nextTreatment/:id', getNextTreatment)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment/:id', removeAppointment)

module.exports = router