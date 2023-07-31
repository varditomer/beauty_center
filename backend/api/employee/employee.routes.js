const express = require('express')
const router = express.Router()

const { getEmployees } = require('./employeeController')

router.get('/', getEmployees)

module.exports = router