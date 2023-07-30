const express = require("express");
const router = express.Router();
const console = require("console");
const doQuery = require('../../services/database.service')


// Handle POST request to '/login'
router.post("/login", (req, res) => {
  const mail = req.body.username;
  const password = req.body.password;
  if (mail && password) {
    const sql = "SELECT Id, isEmployee FROM user WHERE Mail = ? AND Password = ?";
    const params = [mail, password];
    const cb = (error, results) => {
      if (error) throw error;

      if (results.length > 0 && results[0].isEmployee === 0) {
        req.session.userid = results[0].Id;
        console.log("Welcome");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("valid");
      } else if (results.length > 0 && results[0].isEmployee === 1) {
        req.session.userid = results[0].Id;
        console.log("Welcome");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("valid_empl");
      } else {
        console.log("Invalid credentials");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("not valid");
      }
    }
    doQuery(sql, params, cb)
  } else {
    res.sendStatus(400);
  }
});


router.post("/register", (req, res) => {
  try {
    const id = req.body.id;
    const username = req.body.username;
    const mail = req.body.mail;
    const city = req.body.city;
    const phonenumber = req.body.phonenumber;
    const password = req.body.password;

    if (id && username && mail && city && phonenumber && password) {
      const sql = "INSERT INTO user (id, Name, Mail , PhoneNumber, Address, Password) values (?,?,?,?,?,?)";
      const params = [id, username, mail, phonenumber, city, password];
      const cb = (error, results) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        }
        else {
          req.session.userid = id;
          console.log("Welcome");
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

}); router.post("/", (req, res) => {

  try {
    const id = req.body.id;
    const username = req.body.username;
    const mail = req.body.mail;
    const city = req.body.city;
    const phonenumber = req.body.phonenumber;
    const password = req.body.password;

    if (id && username && mail && city && phonenumber && password) {
      doQuery(
        "INSERT INTO user (id, Name, Mail , PhoneNumber, Address, Password) values (?,?,?,?,?,?)",
        [id, username, mail, phonenumber, city, password],
        (error, results) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(error.message);
          }
          else {
            req.session.userid = id;
            console.log("Welcome");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end("valid");
          }
        }
      );
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
