const { doQuery } = require('../../services/database.service')

module.exports = {
  getTreatments,
  getEmployeeTreatments
}

function getTreatments(req, res) {
  try {
    const sql = `SELECT * FROM treatments`;
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

function getEmployeeTreatments(req, res) {
  try {
    const employeeId = req.params.id
    const sql = `
      SELECT employeeId,
      GROUP_CONCAT(treatmentId) AS treatmentTypeIds
      FROM employee_treatments
      WHERE employeeId = ?
      GROUP BY employeeId;
    `;
    const params = [employeeId]
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




