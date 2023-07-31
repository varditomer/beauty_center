const console = require("console");
const doQuery = require('../../services/database.service')

module.exports = {
  login,
  signup
}

// Function to handle user login
function login(req, res) {
  const { mail, password } = req.body;

  // Check if both username (email) and password are provided in the request
  if (mail && password) {
    // SQL query to fetch user data based on email and password
    const sql = `
      SELECT id, isEmployee 
      FROM users 
      WHERE mail = ? AND password = ?
    `;
    const params = [mail, password];

    // Callback function to handle the database query results
    const cb = (error, results) => {
      if (error) throw error;

      // If the query returns results and the user is not an employee
      if (results.length > 0 && results[0].isEmployee === 0) {
        req.session.userId = results[0].Id;
        console.log("Welcome user: ", results[0].Id);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("valid");
      }
      // If the query returns results and the user is an employee
      else if (results.length > 0 && results[0].isEmployee === 1) {
        req.session.userId = results[0].Id;
        console.log("Welcome employee: ", results[0].Id);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("valid_employee");
      }
      // If the query returns no results, the credentials are invalid
      else {
        console.log("Invalid credentials");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("not valid");
      }
    }

    // Execute the SQL query using the 'doQuery' function
    doQuery(sql, params, cb);

  } else {
    // If either username or password is missing, return a bad request status
    res.sendStatus(400);
  }
}

// Function to handle user signup
function signup(req, res) {
  try {
    const {
      id,
      name,
      mail,
      city,
      phoneNumber,
      password
    } = req.body;

    // Check if all required signup fields are provided in the request
    if (id && name && mail && city && phoneNumber && password) {
      // SQL query to insert user data into the 'user' table
      const sql = `
        INSERT INTO users (id, name, mail , phoneNumber, address, password) 
        values (?,?,?,?,?,?)
      `;
      const params = [id, name, mail, phoneNumber, city, password];

      // Callback function to handle the database query results
      const cb = (error, results) => {
        if (error) {
          // If there's an error during database insertion, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        } else {
          req.session.userId = id;
          console.log("Welcome");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end("valid");
        }
      }

      // Execute the SQL query using the 'doQuery' function
      doQuery(sql, params, cb);
    } else {
      // If any required signup field is missing, return a bad request status
      res.sendStatus(400);
    }
  } catch (exp) {
    // If an exception occurs during signup processing, return a server error status
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(exp.message);
  }
}
