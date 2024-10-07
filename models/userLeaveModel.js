const db = require('../config/database');

const UserLeaveModel = {
  getRemainingLeaveDays: (username, callback) => {
    const sql = 'SELECT q_leave_part FROM tbl_month_quota WHERE u_name = ?';
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0].q_leave_part : 0);
    });
  },

  submitLeaveRequest: (leaveData, callback) => {
    const sql = `INSERT INTO tbl_leave_request 
                 (u_name, q_leave_part_used, l_startdate, l_enddate, l_reason, l_status) 
                 VALUES (?, ?, ?, ?, ?, 'pending')`;
    db.query(sql, [
      leaveData.username,
      leaveData.daysUsed,
      leaveData.startDate,
      leaveData.endDate,
      leaveData.reason
    ], (err, result) => {
      if (err) return callback(err);
      callback(null, result.insertId);
    });
  }
};

module.exports = UserLeaveModel;