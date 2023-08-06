const console = require("console");
const makeId = require('../../services/util.service');
const { doQuery, doQueryAndReturnResults } = require("../../services/database.service");
const transporter = require("../../services/mail.service");

module.exports = {
  login,
  signup,
  initiateResetPassword,
  resetPassword
}

// Function to handle user login
function login(req, res) {
  const {
    mail,
    password
  } = req.body;

  console.log(`req.body:`, req.body)

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
        console.log(`results:`, results)
        res.writeHead(200, { "Content-Type": "application/json" });
        const user = results[0]
        delete user.password
        delete user.resetPasswordCode
        res.end(JSON.stringify(user));
      }
      // If the query returns no results, the credentials are invalid
      else {
        console.log("Invalid credentials");
        return res.status(409).json({ error: `Invalid Password or Email!` });
      }
    }

    // Execute the SQL query using the 'doQuery' function
    doQuery(sql, params, cb);

  } else {
    // If either username or password is missing, return a bad request status
    return res.status(409).json({ error: `Invalid Password or Email!` });
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
      const isEmployee = 0  // assign new user to be customer
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

// Function to initiate reset password
async function initiateResetPassword(req, res) {
  const mail = req.params.mail;
  const isUserExist = await _isUserExist(mail)

  if (!isUserExist) {
    // If the user isn't already exists, return a conflict status (409) with the error message
    return res.status(409).json({ error: `Email doesn't exists!` });
  } else {
    const resetPasswordCode = makeId()

    const sql = `
    UPDATE users
    SET resetPasswordCode = ?
    WHERE mail = ?;
    `
      ;
    const params = [resetPasswordCode, mail];

    try {
      await doQueryAndReturnResults(sql, params);
    } catch (error) {
      console.error('Error while querying the database:', error);
      throw error;
    }

    const resetPasswordLink = 'http://localhost:3000/resetPassword'; // Update with the actual reset password link


    const mailOptions = {
      from: 'varditom@post.bgu.ac.il',
      to: mail,
      subject: 'Password Reset',
      html: `
      <p>This is a reset email sent from Beauty Center.</p>
      <p>Your reset password code is: <span style="color: blue; user-select: all; cursor: pointer;">${resetPasswordCode}</span></p>
      <p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>
      `
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });



    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify('reset password mail sent'));
  }

}

// Function to initiate reset password
async function resetPassword(req, res) {
  const resetPasswordDetails = req.body;
  const isResetCodesMatches = await _isResetPasswordCodeMatchToCodeInDB(resetPasswordDetails.mail, resetPasswordDetails.resetPasswordCode)
  if (isResetCodesMatches) {
    await _updateUserPassword(resetPasswordDetails.password, resetPasswordDetails.mail)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify('Password was changed'));
  } else {
    return res.status(409).json({ error: `Invalid Reset Password Code!` })
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

// Function to get user's reset password code by mail
async function _isResetPasswordCodeMatchToCodeInDB(mail, providedResetPasswordCode) {
  const sql = 'SELECT resetPasswordCode FROM users WHERE mail = ?';
  const params = [mail];
  try {
    const results = await doQueryAndReturnResults(sql, params);
    const row = results[0]; // Your result: RowDataPacket { resetPasswordCode: '3i3ci' }
    // Extract the resetPasswordCode from the RowDataPacket
    const resetPasswordCodeFromDB = row.resetPasswordCode;
    return resetPasswordCodeFromDB === providedResetPasswordCode
  } catch (error) {
    console.error('Error while querying the database:', error);
    throw error;
  }
}

// Function to get user's reset password code by mail
async function _updateUserPassword(password, mail) {
  const sql = `
  UPDATE users
  SET password = ?
  WHERE mail = ?;
  `
    ;
  const params = [password, mail];
  try {
    return await doQueryAndReturnResults(sql, params);
  } catch (error) {
    console.error('Error while querying the database:', error);
    throw error;
  }
}