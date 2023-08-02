const console = require("console");
const { doQuery } = require('../../services/database.service');
const makeId = require("../../services/util.service");

module.exports = {
  getAppointments,
  addAppointment,
  removeAppointment,
  getNextAppointments
}

function getNextAppointments(req, res) {
  try {
    const userId = req.params.id
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
    SELECT 
    appointments.id,
    CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
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
    appointments.customerId = ? AND
    appointments.appointmentDateTime >= DATE(NOW()) -- Filter appointments with date greater than or equal to today
    ORDER BY 
    appointments.appointmentDateTime ASC
    LIMIT 1;
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
        console.log(JSON.stringify(results[0]));
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

// Get appointments by user Id
function getAppointments(req, res) {
  try {
    const userId = req.params.id
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
      SELECT 
      appointments.id,
      CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
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
    const { customerId, employeeId, treatmentId, appointmentDateTime } = req.body.newAppointment;
    const id = makeId()
    if (id && appointmentDateTime && customerId && employeeId && treatmentId) {
      // SQL query to add a new appointment
      const sql = `
        INSERT INTO appointments (id, appointmentDateTime, customerId, employeeId, treatmentId) 
        values (?,?,?,?,?)
      `;

      const formattedDateTime = appointmentDateTime.substring(0,10) + '' + appointmentDateTime.substring(10,18)
      const params = [id, formattedDateTime, customerId, employeeId, treatmentId];
      const cb = (error, results) => {
        if (error) {
          // If there's an error during database insertion, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          // If the appointment is added successfully, return a the added appointment
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(req.body.newAppointment));
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
