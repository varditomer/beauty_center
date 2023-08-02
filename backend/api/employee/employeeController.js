const { doQuery } = require('../../services/database.service')

module.exports = {
  getEmployees,
  getEmployeesByTreatmentId,
  getEmployeeAvailableHoursByTreatmentId,
  getEmployeeAppointmentsByDay
}

function getEmployees(req, res) {
  try {
    const sql = `
      SELECT
      users.id,
      users.name,
      users.address,
      GROUP_CONCAT(DISTINCT treatments.treatmentType ORDER BY treatments.treatmentType ASC) AS treatmentTypes
      FROM
      users
      JOIN
      employee_treatments ON users.id = employee_treatments.employeeId
      JOIN
      treatments ON employee_treatments.treatmentId = treatments.id
      WHERE
      users.isEmployee = 1
      GROUP BY
      users.id, users.name, users.address;
    `;
    const cb = (error, results) => {
      if (error) {
        console.log(`000000000000000000000000000:`, )
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        console.log(`results:`, results)
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

function getEmployeeAppointmentsByDay(req, res) {
  try {
    const { employeeId, date } = req.body
    const sql = `
      SELECT *
      FROM appointments
      WHERE employeeId = ?
      AND DATE(appointmentDateTime) = DATE(?);

    `;
    const params = [employeeId, date]
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






