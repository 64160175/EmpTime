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
  },

  getHourlyRate: (callback) => {
    const query = 'SELECT rate_hr FROM tbl_setting ORDER BY id DESC LIMIT 1';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0] ? results[0].rate_hr : null);
    });
  },
};

module.exports = userreceiptModel;