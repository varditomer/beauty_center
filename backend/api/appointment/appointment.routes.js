const express = require('express')
const router = express.Router()

const { getCustomerAppointments, getEmployeeAppointments, getCustEmployeeRevenue, addAppointment, removeAppointment, getNextAppointments, getNextTreatments, getCustomerAppointmentsByDay } = require('./appointmentController')

router.get('/:id', getCustomerAppointments)
router.post('/customerAppointmentsByDay', getCustomerAppointmentsByDay)
router.get('/employee/:id', getEmployeeAppointments)
router.get('/nextAppointments/:id', getNextAppointments)
router.get('/nextTreatments/:id', getNextTreatments)
router.get('/revenue/:id', getCustEmployeeRevenue)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment/:id', removeAppointment)

module.exports = router