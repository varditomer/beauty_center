const mysql = require("mysql");

// Create a reusable database connection
const sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beauty_center",
});

// Connect to the database
sqlConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// Function to execute a query
function doQuery(sql, params = [], cb) {
  sqlConnection.query(sql, params, cb);
}

// Function to execute a query and return a Promise with results
function doQueryAndReturnResults(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqlConnection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Export the doQuery function
module.exports = {
  doQuery,
  doQueryAndReturnResults
}
