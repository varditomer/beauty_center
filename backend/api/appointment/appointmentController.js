const console = require("console");
const { doQuery } = require('../../services/database.service')

// Appointments:

module.exports = {
  getAppointments,
  addAppointment,
  removeAppointment
}

// Get appointments by user Id
function getAppointments(req, res) {
  try {
    const userId = req.params.id
    console.log(`userId:`, userId)
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
      SELECT 
      appointments.id,
      appointments.appointmentDateTime,
      treatments.treatmentType,
      treatments.duration AS treatmentDuration,
      treatments.price AS treatmentPrice,
      users.name AS employeeName
      FROM 
      appointments
      INNER JOIN 
      treatments ON appointments.treatmentId = treatments.id
      INNER JOIN 
      users ON appointments.employeeId = users.id
      WHERE 
      appointments.customerId = ?;
    `
    const params = [userId];
    const cb = (error, results) => {
      if (error) {
        console.log(`error:`, error)
        // If there's an error during the database query, return a server error status
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        // If the query is successful, return the appointments data as JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    }
    // Execute the SQL query using the 'doQuery' function
    doQuery(sql, params, cb)
  }
  catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}

// Add appointment
function addAppointment(req, res) {
  try {
    const { date, employeeId, treatmentId, startTime } = req.body;
    if (date && employeeId && treatmentId && startTime) {
      // SQL query to add a new appointment
      const sql = `
        INSERT INTO appointments (date, employeeId, customerId , treatmentId, startTime, endTime) 
        values (?,?,?,?,?,?)
      `;
      // Set customerId to the user's session userId
      const params = [date, employeeId, req.session.userId, treatmentId, startTime, startTime];
      const cb = (error, results) => {
        if (error) {
          // If there's an error during database insertion, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          console.log("Added");
          // If the appointment is added successfully, return a success status
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end("valid");
        }
      }
      // Execute the SQL query using the 'doQuery' function
      doQuery(sql, params, cb);
    } else {
      // If any required appointment field is missing, return a bad request status
      res.sendStatus(400);
    }
  }
  catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}

// Remove appointment
function removeAppointment(req, res) {
  try {
    const appointmentId = req.params;
    if (appointmentId) {
      // SQL query to remove an appointment by its ID
      const sql = `
        DELETE FROM appointments where appointmentId=?
      `;
      // Set the appointmentId to the value from the request parameters
      const params = [appointmentId];
      const cb = (error, results) => {
        if (error) {
          // If there's an error during database deletion, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          console.log("Deleted");
          // If the appointment is deleted successfully, return a success status
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end("valid");
        }
      }
      // Execute the SQL query using the 'doQuery' function
      doQuery(sql, params, cb)
    } else {
      // If the appointmentId parameter is missing, return a bad request status
      res.sendStatus(400);
    }
  }
  catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}
