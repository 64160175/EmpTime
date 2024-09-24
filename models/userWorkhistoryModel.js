const db = require('../config/database');

const UserWorkhistoryModel = {
  getWorkHistory: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          ci.u_name AS user_id, 
          DATE_FORMAT(ci.in_date, '%Y-%m-%d') AS work_date,
          ci.in_time AS actual_in_time,
          co.out_time AS actual_out_time
        FROM 
          tbl_checkin ci
        LEFT JOIN 
          tbl_checkout co ON ci.u_name = co.u_name AND DATE(ci.in_date) = DATE(co.out_date)
        WHERE 
          ci.u_name = (SELECT u_name FROM tbl_user WHERE id = ?) 
        ORDER BY 
          work_date DESC, ci.in_time DESC
      `;

      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching work history:', err);
          reject(err); 
        } else {
          resolve(results); 
        }
      });
    });
  }
};

module.exports = UserWorkhistoryModel;
