const { doQuery } = require('../../services/database.service');
const transporter = require("../../services/mail.service");


module.exports = {
  getEmployees,
  getEmployeesByTreatmentId,
  getEmployeeAvailableHoursByTreatmentId,
  getEmployeeAppointmentsByDay,
  getEmployeeAvailableHoursByTreatmentIdAndDay,
  getEmployeeConstraints,
  removeEmployeeConstraint,
  getEmployeeTreatmentDaysToAdd,
  getEmployeeConstraintsByDate,
  addEmployeeConstraint
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
        const employees = results.map(employee => {
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
    SELECT
    employee_available_hours.employeeId,
    employee_available_hours.treatmentId,
    employee_available_hours.patientAcceptStart,
    employee_available_hours.patientAcceptEnd
    FROM employee_available_hours
    WHERE employeeId = ? AND treatmentId = ?;    
    `;
    const params = [employeeId, treatmentId]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
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

function getEmployeeAvailableHoursByTreatmentIdAndDay(req, res) {
  try {
    const { employeeId, treatmentId, day } = req.body
    const sql = `
    SELECT
    employee_available_hours.employeeId,
    employee_available_hours.treatmentId,
    employee_available_hours.patientAcceptStart,
    employee_available_hours.patientAcceptEnd
    FROM employee_available_hours
    WHERE employeeId = ? AND treatmentId = ? AND day = ?;    
    `;
    const params = [employeeId, treatmentId, day]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
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

function getEmployeeConstraintsByDate(req, res) {
  try {
    const { employeeId, date } = req.body
    const sql = `
    SELECT *
    FROM employee_constraints
    WHERE employeeId = ? AND date = ?;    
    `;
    const params = [employeeId, date]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
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

function getEmployeeConstraints(req, res) {
  try {
    console.log(`req.params:`, req.params)
    const { employeeId } = req.params
    const sql = `
    SELECT *
    FROM employee_constraints
    WHERE employeeId = ?;   
    `;
    const params = [employeeId]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
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

function addEmployeeConstraint(req, res) {
  try {
    const { employeeId, date, constraintStart, constraintEnd, description } = req.body;

    const getAppointmentsSql = `
      SELECT * FROM appointments
      WHERE employeeId = ? AND DATE(appointmentDateTime) = ? AND
      TIME(appointmentDateTime) >= ? AND TIME(appointmentDateTime) <= ?;
    `;
    const getAppointmentsParams = [employeeId, date, constraintStart, constraintEnd];

    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log("error.message:", error.message);
      } else {
        // Step 2: Get customer emails
        const customerEmails = results.map((appointment) => appointment.customerId);

        // Step 3: Send cancellation emails
        customerEmails.forEach((customerId) => {
          console.log(`customerId:`, customerId)
          const getUserEmailSql = `
            SELECT mail FROM users
            WHERE id = ?;
          `;
          const getUserEmailParams = [customerId];

          doQuery(getUserEmailSql, getUserEmailParams, (emailError, emailResults) => {
            if (emailError) {
              console.error("Error getting customer email:", emailError);
            } else if (emailResults.length > 0) {
              const email = emailResults[0].mail;

              // Send email here (Step 3) using nodemailer
              const mailOptions = {
                from: "nourgbareen2001@gmail.com",
                to: email,
                subject: "Appointment Cancellation",
                html: `
                  <p>This is a notification from Beauty Center.</p>
                  <p>Your appointment on ${date} has been canceled due to employee constraint.</p>
                `,
              };

              transporter.sendMail(mailOptions, (emailSendError, info) => {
                if (emailSendError) {
                  console.error("Error sending email:", emailSendError);
                } else {
                  console.log("Email sent:", info.response);
                }
              });
            }
          });
        });

        // Step 4: Delete appointments
        const deleteAppointmentsSql = `
          DELETE FROM appointments
          WHERE employeeId = ? AND DATE(appointmentDateTime) = ? AND
          TIME(appointmentDateTime) >= ? AND TIME(appointmentDateTime) <= ?;
        `;
        const deleteAppointmentsParams = [employeeId, date, constraintStart, constraintEnd];

        doQuery(deleteAppointmentsSql, deleteAppointmentsParams, (deleteError, deleteResults) => {
          if (deleteError) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(deleteError.message);
            console.log("deleteError.message:", deleteError.message);
          } else {
            // Step 5: Add the constraint (already added in the original code)
             const sql = `
      INSERT INTO employee_constraints (employeeId, date, constraintStart, constraintEnd, description)
      VALUES (?, ?, ?, ?, ?);
    `;
    const params = [employeeId, date, constraintStart, constraintEnd, description];

            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({}));
          }
        });
      }
    };

    doQuery(getAppointmentsSql, getAppointmentsParams, cb);
  } catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}



function removeEmployeeConstraint(req, res) {
  try {
    const { constraintId } = req.body
    const sql = `
    DELETE
    FROM employee_constraints
    WHERE id = ?;   
    `;
    const params = [constraintId]
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      }
    }
    doQuery(sql, params, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

}

function getEmployeeTreatmentDaysToAdd(req, res) {
  try {
    console.log(`req.body:`, req.body)
    const { employeeId, treatmentId } = req.body;
    const sql = `
      SELECT
        employee_available_hours.day
      FROM
        employee_available_hours
      WHERE
        employee_available_hours.employeeId = ?
        AND employee_available_hours.treatmentId = ?
      `;
    const params = [employeeId, treatmentId, employeeId, treatmentId];
    const cb = (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(error.message);
        console.log(`error.message:`, error.message)
      }
      else {
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log(`JSON.stringify(results):`, JSON.stringify(results))
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
    const { employeeId, date } = req.body;
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
        WHERE employeeId = ?
        AND DATE(appointmentDateTime) = DATE(?);
    `;
    const params = [employeeId, date];
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







