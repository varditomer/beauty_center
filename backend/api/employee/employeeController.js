const { doQuery } = require('../../services/database.service')

module.exports = {
  getEmployees,
  getEmployeesByTreatmentId,
  getEmployeeAvailableHoursByTreatmentId,
  getEmployeeAppointmentsByTreatmentIdAndDay
}

function getEmployees(req, res) {
  try {
    const sql = `
      SELECT users.id, users.name, users.mail, users.address, treatments.treatmentType
      FROM users
      JOIN employee_treatments ON users.id = employee_treatments.id
      JOIN treatments ON employee_treatments.treatmentId = treatments.id;
    `;
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    }
    doQuery(sql, [], cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}
function getEmployeesByTreatmentId(req, res) {
  try {
    const treatmentId = req.params.id
    const sql = `
    SELECT users.*
    FROM users
    JOIN employee_treatments ON users.id = employee_treatments.employeeId
    WHERE employee_treatments.treatmentId = ?;    
    `;
    const params = [treatmentId]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        const employees = results.map(employee=> {
          delete employee.password
          return employee
        })
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(employees));
      }
    }
    doQuery(sql, params, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}
function getEmployeeAvailableHoursByTreatmentId(req, res) {
  try {
    const { employeeId, treatmentId } = req.body
    const sql = `
    SELECT *
    FROM employee_available_hours
    WHERE employeeId = ? AND treatmentId = ?;    
    `;
    const params = [employeeId, treatmentId]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    }
    doQuery(sql, params, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}

function getEmployeeAppointmentsByTreatmentIdAndDay(req, res) {
  try {
    const { employeeId, treatmentId, date } = req.body
    const sql = `
      SELECT *
      FROM appointments
      WHERE employeeId = ?
      AND treatmentId = ?
      AND DATE(appointmentDateTime) = DATE(?);

    `;
    const params = [employeeId, treatmentId, date]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    }
    doQuery(sql, params, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}






