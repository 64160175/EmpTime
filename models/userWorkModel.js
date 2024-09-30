// userWorkModel.js
const db = require('../config/database'); 

const UserWorkModel = {
  getWorkScheduleByUname: (username, callback) => {
    const sql = `
      SELECT 
          DATE_FORMAT(s.s_date, '%Y-%m-%d') AS work_date, 
          s.s_time_in AS start_time, 
          s.s_time_out AS end_time,
          DATE_FORMAT(s.date_his, '%Y-%m-%d %H:%i:%s') AS date_his  -- เพิ่มคอลัมน์ date_his
      FROM 
          tbl_schedule s
      WHERE 
          s.u_name = ?
      ORDER BY 
          s.s_date, s.s_time_in
  `;

    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error fetching work schedule:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};

module.exports = UserWorkModel;
