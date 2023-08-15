const console = require("console");
const { doQuery } = require('../../services/database.service');

module.exports = {
  getCustEmployeeRevenue,
  addAppointment,
  updateAppointment,
  removeAppointment,
  getNextAppointments,
  getNextTreatments,
  getEmployeeIncomes,
  getCustomerAppointments,
  getEmployeeAppointments,
  getCustomerAppointmentsByDay,
  getCanceledAppointments
}

// Get appointments by user Id
function getCustomerAppointments(req, res) {
  try {
    const userId = req.params.id
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
      SELECT 
      appointments.id,
      CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
      appointments.treatmentId,
      appointments.customerId,
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
        console.log(`results:`, results)
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

// Get appointmentzs by emEmployeeRevenu(req, res) {
function getCustEmployeeRevenue(req, res) {
  try {
    const employeeId = req.params.id
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
    SELECT 
    SUM(treatments.price) AS monthlyTotal
    FROM 
    appointments
    INNER JOIN 
    treatments ON appointments.treatmentId = treatments.id
    WHERE 
    appointments.employeeId = ?
    AND MONTH(appointments.appointmentDateTime) = MONTH(CURDATE()); -- Filter appointments for the current month
`
    const params = [employeeId];
    const cb = (error, results) => {
      if (error) {
        console.log(`error:`, error)
        // If there's an error during the database query, return a server error status
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      }
      else {
        //       // If the query is successful, return the appointments data as JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results[0]));
      }
    }
    // Execute the SQL query using the 'doQuery' function
    doQuery(sql, params, cb)
  }
  catch (exp) {
    //   // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}


function getNextAppointments(req, res) {
  try {
    const userId = req.params.id
    // SQL query to get appointments for a specific customer (customerId)
    const sql = `
    SELECT 
    appointments.id,
    appointments.treatmentId,
    appointments.customerId,
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
    appointments.customerId = ? 
    AND DATE(appointments.appointmentDateTime) = CURDATE() -- Filter appointments for today
    ORDER BY 
    appointments.appointmentDateTime ASC;
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

function getNextTreatments(req, res) {
  try {
    const employeeId = req.params.id;
    // SQL query to get the next appointment for a specific employee (employeeId)
    const sql = `
    SELECT 
    appointments.id,
    appointments.treatmentId,
    appointments.customerId,
    CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
    treatments.treatmentType,
    treatments.duration AS treatmentDuration,
    treatments.price AS treatmentPrice,
    users.name AS customerName
    FROM 
    appointments
    INNER JOIN 
    treatments ON appointments.treatmentId = treatments.id
    INNER JOIN 
    users ON appointments.customerId = users.id
    WHERE 
    appointments.employeeId = ?
    AND DATE(appointments.appointmentDateTime) = CURDATE() -- Filter appointments for today
    ORDER BY 
    appointments.appointmentDateTime ASC;
    `;
    const params = [employeeId];
    const cb = (error, results) => {
      if (error) {
        console.log(`error:`, error);
        // If there's an error during the database query, return a server error status
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
      } else {
        // If the query is successful, return the appointment data as JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log(JSON.stringify(results[0]));
        res.end(JSON.stringify(results));
      }
    };
    // Execute the SQL query using the 'doQuery' function
    doQuery(sql, params, cb);
  } catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}


// Add appointment
function addAppointment(req, res) {
  try {
    const { customerId, employeeId, treatmentId, appointmentDateTime } = req.body.newAppointment;
    if (appointmentDateTime && customerId && employeeId && treatmentId) {
      // SQL query to add a new appointment
      const sql = `
        INSERT INTO appointments (appointmentDateTime, customerId, employeeId, treatmentId) 
        values (?,?,?,?)
      `;

      const formattedDateTime = appointmentDateTime.substring(0, 10) + '' + appointmentDateTime.substring(10, 18)
      const params = [formattedDateTime, customerId, employeeId, treatmentId];
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

// Update appointment
function updateAppointment(req, res) {
  try {
    const { customerId, employeeId, treatmentId, appointmentDateTime, appointmentId } = req.body.rescheduledAppointment;

    if (appointmentId && appointmentDateTime && customerId && employeeId && treatmentId) {
      // SQL query to update an existing appointment
      const sql = `
        UPDATE appointments
        SET appointmentDateTime = ?, customerId = ?, employeeId = ?, treatmentId = ? 
        WHERE id = ?
      `;
console.log(`appointmentDateTime:`, appointmentDateTime)
      const formattedDateTime = appointmentDateTime.substring(0, 10) + ' ' + appointmentDateTime.substring(11, 16);
      console.log(`formattedDateTime:`, formattedDateTime)
      const params = [formattedDateTime, customerId, employeeId, treatmentId, appointmentId];

      const cb = (error, results) => {
        if (error) {
          // If there's an error during database update, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        } else {
          // If the appointment is updated successfully, return a success status
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Appointment updated successfully" }));
        }
      }

      // Execute the SQL query using the 'doQuery' function
      doQuery(sql, params, cb);
    } else {
      // If any required appointment field or appointmentId is missing, return a bad request status
      res.sendStatus(400);
    }
  } catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}


function removeAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    if (appointmentId) {
      // SQL query to move the appointment to the canceled_appointments table
      const moveSql = `
      INSERT INTO canceled_appointments (appointmentDateTime, employeeId, customerId, treatmentId)
      SELECT appointmentDateTime, employeeId, customerId, treatmentId
      FROM appointments
      WHERE id = ?
      `;
      const moveParams = [appointmentId];

      const moveCb = (moveError, moveResults) => {
        if (moveError) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(moveError.message);
        } else {
          // SQL query to delete the appointment from the appointments table
          const deleteSql = `
          DELETE FROM appointments WHERE id = ?
          `;
          const deleteParams = [appointmentId];

          const deleteCb = (deleteError, deleteResults) => {
            if (deleteError) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(deleteError.message);
            } else {
              console.log("Appointment Moved and Deleted");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(appointmentId));
            }
          };

          // Execute the delete SQL query using the 'doQuery' function
          doQuery(deleteSql, deleteParams, deleteCb);
        }
      };

      // Execute the move SQL query using the 'doQuery' function
      doQuery(moveSql, moveParams, moveCb);
    } else {
      // If the appointmentId parameter is missing, return a bad request status
      res.sendStatus(400);
    }
  } catch (exp) {
    // If an exception occurs during the process, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}

function getEmployeeAppointments(req, res) {
  try {
    const employeeId = req.params.id
    const sql = `
    SELECT 
    appointments.id,
    appointments.treatmentId,
    appointments.customerId,
    CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
    treatments.treatmentType,
    treatments.duration AS treatmentDuration,
    treatments.price AS treatmentPrice,
    users.name AS customerName
    FROM 
    appointments
    INNER JOIN 
    treatments ON appointments.treatmentId = treatments.id
    INNER JOIN 
    users ON appointments.customerId = users.id
    WHERE 
    appointments.employeeId = ?;
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

function getEmployeeIncomes(req, res) {
  try {
    const employeeId = req.params.id
    const sql = `
    SELECT 
    appointments.customerId,
    users.name AS customerName,
    treatments.treatmentType,
    users.name AS employeeName,
    SUM(treatments.price) AS totalTreatmentPrice
    FROM 
    appointments
    INNER JOIN 
    treatments ON appointments.treatmentId = treatments.id
    INNER JOIN 
    users ON appointments.employeeId = users.id
    WHERE 
    MONTH(appointments.appointmentDateTime) = MONTH(NOW()) -- Filter appointments for the current month
    AND YEAR(appointments.appointmentDateTime) = YEAR(NOW()) -- Filter appointments for the current year
    AND appointments.customerId = :customer_id -- Parameter for customer ID
    GROUP BY 
    appointments.customerId,
    treatments.treatmentType,
    users.name;
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

function getCustomerAppointmentsByDay(req, res) {
  try {
    const { customerId, date } = req.body
    const sql = `
      SELECT
      appointments.id,
      CONVERT_TZ(appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
      appointments.employeeId,
      appointments.customerId,
      appointments.treatmentId,
      treatments.duration AS appointmentDuration
      FROM appointments
      JOIN treatments ON appointments.treatmentId = treatments.id
      WHERE customerId = ?
      AND DATE(appointmentDateTime) = DATE(?);
    `;
    const params = [customerId, date]
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

function getCanceledAppointments(req, res) {
  try {
    const employeeId = +req.params.id
    const sql = `
    SELECT 
    canceled_appointments.id,
    canceled_appointments.treatmentId,
    canceled_appointments.customerId,
    CONVERT_TZ(canceled_appointments.appointmentDateTime, '+00:00', '+03:00') AS appointmentDateTime,
    treatments.treatmentType,
    treatments.duration AS treatmentDuration,
    treatments.price AS treatmentPrice,
    users.name AS customerName
    FROM 
    canceled_appointments
    INNER JOIN 
    treatments ON canceled_appointments.treatmentId = treatments.id
    INNER JOIN 
    users ON canceled_appointments.customerId = users.id
    WHERE 
    canceled_appointments.employeeId = ?;
    `;
    const params = [employeeId]
    const cb = (error, results) => {
      if (error) {
        console.log(error);
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