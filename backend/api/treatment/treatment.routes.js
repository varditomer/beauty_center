const express = require('express')
const router = express.Router()

const { getTreatments } = require('./treatmentController.js')

router.get('/', getTreatments)

module.exports = router