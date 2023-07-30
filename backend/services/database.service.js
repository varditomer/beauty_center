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
async function doQuery(sql, params = [], cb) {
  const result = await sqlConnection.query(sql, params, cb);
  return result[0];
}

// Export the doQuery function
module.exports = doQuery;

