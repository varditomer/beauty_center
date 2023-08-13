const express = require('express')
const router = express.Router()

const { getCustEmployeeRevenu, addAppointment, removeAppointment, getNextAppointments, getNextTreatments } = require('./appointmentController')

// router.get('/:id', getCustomerAppointments)
// router.get('/employee/:id', getEmployeeAppointments)
router.get('/nextAppointments/:id', getNextAppointments)
router.get('/nextTreatments/:id', getNextTreatments)
router.get('/revenue/:id', getCustEmployeeRevenu)
router.post('/addAppointment', addAppointment)
router.delete('/removeAppointment/:id', removeAppointment)

module.exports = router