const console = require("console");
const { doQuery } = require('../../services/database.service');
const makeId = require("../../services/util.service");

module.exports = {
  getCustEmployeeRevenu,
  addAppointment,
  removeAppointment,
  getNextAppointments,
  getNextTreatments,
  getEmployeeIncomes
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

// Get appointmentzs by emEmployeeRevenu(req, res) {
function getCustEmployeeRevenu(req,res) {
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
    // const id = makeId()
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

// Remove appointment
function removeAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    if (appointmentId) {
      // SQL query to remove an appointment by its ID
      const sql = `
      DELETE FROM appointments where id=?
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
          res.end(JSON.stringify(appointmentId));
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


function getEmployeeTreatments(req, res) {
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











