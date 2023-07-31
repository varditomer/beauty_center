const { doQuery } = require('../../services/database.service')

module.exports = {
  getTreatments,
}

function getTreatments(req, res) {
  try {
    const sql = `
      SELECT users.id, users.name, users.mail, users.address, treatments.treatmentType
      FROM users
      JOIN employees ON users.id = employees.id
      JOIN treatments ON employees.treatmentId = treatments.id;
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




