const express = require('express')
const router = express.Router()

const { getEmployees, getEmployeesByTreatmentId, getEmployeeAvailableHoursByTreatmentId, getEmployeeAppointmentsByTreatmentIdAndDay } = require('./employeeController')

router.get('/', getEmployees)
router.get('/byTreatmentId/:id', getEmployeesByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentId', getEmployeeAvailableHoursByTreatmentId)
router.post('/employeeAppointmentsByTreatmentIdAndDay', getEmployeeAppointmentsByTreatmentIdAndDay)

module.exports = router