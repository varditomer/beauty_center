const express = require('express')
const router = express.Router()

const {getCanceledAppointments, getCustomerAppointments, getEmployeeAppointments, getCustEmployeeRevenue, addAppointment, updateAppointment, removeAppointment, getNextAppointments, getNextTreatments, getCustomerAppointmentsByDay } = require('./appointmentController')

router.get('/:id', getCustomerAppointments)
router.post('/customerAppointmentsByDay', getCustomerAppointmentsByDay)
router.get('/employee/:id', getEmployeeAppointments)
router.get('/nextAppointments/:id', getNextAppointments)
router.get('/canceledAppointments/:id', getCanceledAppointments)
router.get('/nextTreatments/:id', getNextTreatments)
router.get('/revenue/:id', getCustEmployeeRevenue)
router.post('/addAppointment', addAppointment)
router.put('/updateAppointment', updateAppointment)
router.delete('/removeAppointment/:id', removeAppointment)

module.exports = router