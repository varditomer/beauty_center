const express = require('express')
const router = express.Router()

const { getTreatments, getEmployeeTreatments, removeTreatmentType, addEmployeeTreatmentType, updateEmployeeTreatmentType } = require('./treatmentController.js')

router.get('/', getTreatments)
router.get('/employeeTreatments/:id', getEmployeeTreatments)
router.post('/addEmployeeTreatmentType', addEmployeeTreatmentType)
router.put('/updateEmployeeTreatmentType', updateEmployeeTreatmentType)
router.delete('/removeTreatmentType', removeTreatmentType)

module.exports = router