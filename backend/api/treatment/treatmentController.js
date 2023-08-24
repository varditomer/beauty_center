const { doQuery, doQueryAndReturnResults } = require('../../services/database.service')

module.exports = {
  getTreatments,
  getEmployeeTreatments,
  removeTreatmentType,
  addEmployeeTreatmentType,
  updateEmployeeTreatmentType
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
    const employeeId = req.params.id;
    const sql = `
      SELECT treatments.*, 
             employee_available_hours.patientAcceptStart, 
             employee_available_hours.patientAcceptEnd,
             employee_available_hours.day
      FROM treatments
      LEFT JOIN employee_treatments ON treatments.id = employee_treatments.treatmentId
      LEFT JOIN employee_available_hours ON employee_treatments.employeeId = employee_available_hours.employeeId 
                                         AND treatments.id = employee_available_hours.treatmentId
      WHERE employee_treatments.employeeId = ?
    `;
    const params = [employeeId];
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    };
    doQuery(sql, params, cb);
  } catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}

function addEmployeeTreatmentType(req, res) {
  console.log(`req.body:`, req.body)
  try {
    const {
      treatmentType,
      startTime,
      endTime,
      userId,
      selectedDays
    } = req.body.treatmentTypeToAdd

    const employee_treatmentsInsertSQL = `
      INSERT IGNORE INTO employee_treatments (employeeId, treatmentId) 
      VALUES (?,?)
      `;
    const employee_treatmentsParams = [userId, treatmentType];
    doQueryAndReturnResults(employee_treatmentsInsertSQL, employee_treatmentsParams)

    const employee_available_hoursInsertSQL = `
      INSERT INTO employee_available_hours (employeeId, treatmentId, patientAcceptStart, patientAcceptEnd, day) 
      VALUES (?,?,?,?,?)
      `;

    selectedDays.forEach(day => {
      const employee_available_hoursParams = [userId, treatmentType, startTime, endTime, day];
      doQueryAndReturnResults(employee_available_hoursInsertSQL, employee_available_hoursParams)
    })

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({}));
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}

function updateEmployeeTreatmentType(req, res) {
  try {
    const {
      treatmentType,
      startTime,
      endTime,
      userId
    } = req.body.treatmentTypeToUpdate


    const employee_available_hoursInsertSQL = `
    UPDATE employee_available_hours
    SET patientAcceptStart = ?, patientAcceptEnd = ? 
    WHERE employeeId = ? AND treatmentId=?
    `;
    const employee_available_hoursParams = [startTime, endTime, userId, treatmentType];



    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      }
    }
    doQuery(employee_available_hoursInsertSQL, employee_available_hoursParams, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}

function removeTreatmentType(req, res) {
  try {
    console.log(`req.body:`, req.body)
    const { employeeId, treatmentId, day, isSingleTreatFromType } = req.body


    const deleteTreatmentsSql = `
      DELETE FROM employee_treatments
      WHERE employeeId = ? AND treatmentId = ?;
    `;

    const deleteAvailableHoursSql = `
      DELETE FROM employee_available_hours
      WHERE employeeId = ? AND treatmentId = ? AND day =?;
    `;

    const params = [employeeId, treatmentId, day];

    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.body));
      }
    }
    if (isSingleTreatFromType) doQueryAndReturnResults(deleteTreatmentsSql, params)
    doQuery(deleteAvailableHoursSql, params, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}




