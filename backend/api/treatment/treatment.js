const express = require("express");
const router = express.Router();
const console = require("console");
const doQuery = require('../../services/database.service')


// Handle POST request to '/treatment'
router.get("/", (req, res) => {
  try {
    const sql = "select  time, price, treatmentType from treatment";
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

module.exports = router;


