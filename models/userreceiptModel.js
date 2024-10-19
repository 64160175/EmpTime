const db = require('../config/database');

const userreceiptModel = {
  getAllUserReceipts: (u_name, callback) => {
    const query = `
      SELECT *, DATE_FORMAT(day_slip, '%Y-%m-%d') AS day_slip 
      FROM tbl_slip 
      WHERE u_name = ?
      ORDER BY day_slip DESC
    `;
    
    db.query(query, [u_name], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = userreceiptModel;