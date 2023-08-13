const express = require('express')
const router = express.Router()

const { getTreatments, getEmployeeTreatments, removeTreatmentType } = require('./treatmentController.js')

router.get('/', getTreatments)
router.get('/employeeTreatments/:id', getEmployeeTreatments)
router.post('/removeTreatmentType', removeTreatmentType)

module.exports = router