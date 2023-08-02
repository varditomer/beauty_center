const express = require('express')
const router = express.Router()

const { getEmployees, getEmployeesByTreatmentId, getEmployeeAvailableHoursByTreatmentId, getEmployeeAppointmentsByDay } = require('./employeeController')

router.get('/', getEmployees)
router.get('/byTreatmentId/:id', getEmployeesByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentId', getEmployeeAvailableHoursByTreatmentId)
router.post('/employeeAppointmentsByDay', getEmployeeAppointmentsByDay)

module.exports = router