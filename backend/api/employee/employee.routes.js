const express = require('express')
const router = express.Router()

const { getEmployees, getEmployeesByTreatmentId, getEmployeeAvailableHoursByTreatmentId, getEmployeeAppointmentsByDay, getEmployeeAvailableHoursByTreatmentIdAndDay, getEmployeeTreatmentDaysToAdd, getEmployeeConstraintsByDate } = require('./employeeController')

router.get('/', getEmployees)
router.get('/byTreatmentId/:id', getEmployeesByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentId', getEmployeeAvailableHoursByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentIdAndDay', getEmployeeAvailableHoursByTreatmentIdAndDay)
router.post('/employeeAppointmentsByDay', getEmployeeAppointmentsByDay)
router.post('/employeeConstraintsByDate', getEmployeeConstraintsByDate)
router.post('/employeeTreatmentDaysToAdd', getEmployeeTreatmentDaysToAdd)

module.exports = router