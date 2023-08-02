const express = require('express')
const router = express.Router()

const { getTreatments, getEmployeeTreatments } = require('./treatmentController.js')

router.get('/', getTreatments)
router.get('/employeeTreatments/:id', getEmployeeTreatments)

module.exports = router