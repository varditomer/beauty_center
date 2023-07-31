const console = require("console");
const makeId = require('../../services/util.service');
const { doQuery, doQueryAndReturnResults } = require("../../services/database.service");

module.exports = {
  login,
  signup
}

// Function to handle user login
function login(req, res) {
  const {
    mail,
    password
  } = req.body;

  // Check if both username (email) and password are provided in the request
  if (mail && password) {
    // SQL query to fetch user data based on email and password
    const sql = `
      SELECT *
      FROM users 
      WHERE mail = ? AND password = ?
    `;
    const params = [mail, password];

    // Callback function to handle the database query results
    const cb = (error, results) => {
      if (error) throw error;

      // If the query returns results
      if (results.length > 0) {
        console.log(`Welcome ${results[0].isEmployee === 0 ? 'user' : 'employee'} :`, results[0].id);
        res.writeHead(200, { "Content-Type": "application/json" });
        const user = results[0]
        delete user.password
        res.end(JSON.stringify(user));
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
async function signup(req, res) {
  try {
    const {
      mail,
      password,
      name,
      address,
      phoneNumber,
    } = req.body;

    const isUserExist = await _isUserExist(mail)

    if (isUserExist) {
      // If the user already exists, return a conflict status (409) with the error message
      return res.status(409).json({ error: 'Email already exists' });
    }

    const id = makeId()
    // Check if all required signup fields are provided in the request
    if (!!id && !!name && !!mail && !!address && !!phoneNumber && !!password) {
      // SQL query to insert user data into the 'user' table
      const sql = `
        INSERT INTO users (id, name, mail , phoneNumber, address, password, isEmployee) 
        values (?,?,?,?,?,?,?)
      `;
      const isEmployee = '0' // assign new user to be customer
      const params = [id, name, mail, phoneNumber, address, password, isEmployee];

      // Callback function to handle the database query results
      const cb = (error) => {
        if (error) {
          // If there's an error during database insertion, return a server error status
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(error.message);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          const user = { id, name, mail, phoneNumber, address, isEmployee }
          res.end(JSON.stringify(user));
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


// Function to check if the user exists by email
async function _isUserExist(mail) {
  const sql = 'SELECT * FROM users WHERE mail = ?';
  const params = [mail];

  try {
    const results = await doQueryAndReturnResults(sql, params);

    // Check if the user exists
    if (results.length > 0) {
      console.log(`User exists:`, results[0].mail);
      return true;
    } else {
      console.log('User does not exist.');
      return false;
    }
  } catch (error) {
    console.error('Error while querying the database:', error);
    throw error;
  }
}