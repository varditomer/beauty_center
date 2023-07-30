const express = require("express");
const router = express.Router();
const console = require("console");
const doQuery = require('../../services/database.service')


// Handle treatments request to '/appointments'
router.get("/treatments", (req, res) => {
  try {
    const sql = "select  treatmentId, treatmentType from treatment";
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
    doQuery(sql, null, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

});

// Handle treatments request to '/appointments'
router.post("/empbytreatid", (req, res) => {
  try {
    const sql = `select user.Id,user.Name  from user, employee where user.Id = employee.Id and employee.treatmentId=${req.body.treatmentId}`
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
    doQuery(sql, null, cb)
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
});


router.post("/addappointment", (req, res) => {

  try {
    const emp = req.body.emp;
    const treatmentID = req.body.treatmentID;
    const date = req.body.appdate;
    const startTime = req.body.apptime;



    if (treatmentID && emp && date && startTime) {

      const sql = "INSERT INTO appointment (date, employeeID, customerID , treatmentID, startTime, endTime) values (?,?,?,?,?,?)";
      const params = [date, emp, req.session.userid, treatmentID, startTime, startTime];
      const cb = (error, results) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          console.log("Added");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end("valid");
        }
      }
      doQuery(sql, params, cb);
    } else {
      res.sendStatus(400);
    }
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

});


router.get("/", (req, res) => {
  console.log(`here:`)
  try {
    console.log(req.session.userid);
    const sql = "select  appointment.appointmentID, appointment.date, user.name as employeeID, startTime, endTime, treatment.treatmentType from appointment, user, treatment where appointment.employeeID = user.Id and appointment.treatmentID = treatment.treatmentID and appointment.customerID = ?";
    const params = [req.session.userid];
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
});


router.delete("/deleteappointment", (req, res) => {
  try {
    const appointmentID = req.body.appointmentID;
    if (appointmentID) {
      const sql = "DELETE FROM appointment where appointmentID=?";
      const params = [appointmentID];
      const cb = (error, results) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          console.log("Deleted");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end("valid");
        }
      }
      doQuery(sql, params, cb)
    } else {
      res.sendStatus(400);
    }
  }
  catch (exp) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }

});

module.exports = router;


