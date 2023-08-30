const express = require('express')
const router = express.Router()

const { getEmployees, getEmployeesByTreatmentId, getEmployeeAvailableHoursByTreatmentId, getEmployeeAppointmentsByDay, getEmployeeAvailableHoursByTreatmentIdAndDay, getEmployeeTreatmentDaysToAdd, getEmployeeConstraintsByDate, getEmployeeConstraints, removeEmployeeConstraint, addEmployeeConstraint } = require('./employeeController')

router.get('/', getEmployees)
router.get('/byTreatmentId/:id', getEmployeesByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentId', getEmployeeAvailableHoursByTreatmentId)
router.post('/employeeAvailableHoursByTreatmentIdAndDay', getEmployeeAvailableHoursByTreatmentIdAndDay)
router.post('/employeeAppointmentsByDay', getEmployeeAppointmentsByDay)
router.get('/employeeConstraints/:employeeId', getEmployeeConstraints)
router.delete('/removeEmployeeConstraint', removeEmployeeConstraint)
router.delete('/addEmployeeConstraint', addEmployeeConstraint)

router.post('/employeeConstraintsByDate', getEmployeeConstraintsByDate)
router.post('/employeeTreatmentDaysToAdd', getEmployeeTreatmentDaysToAdd)


module.exports = router