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
    // ดึงค่า id ล่าสุด
    db.query('SELECT MAX(id) as maxId FROM tbl_leave_request', (err, result) => {
      if (err) return callback(err);
  
      const newId = (result[0].maxId || 0) + 1;
  
      const sql = `INSERT INTO tbl_leave_request 
                   (id, u_name, q_leave_part_used, l_startdate, l_enddate, l_reason, l_status) 
                   VALUES (?, ?, ?, ?, ?, ?, 0)`;
      db.query(sql, [
        newId,
        leaveData.username,
        leaveData.daysUsed,
        leaveData.startDate,
        leaveData.endDate,
        leaveData.reason
      ], (err, result) => {
        if (err) return callback(err);
        callback(null, newId);
      });
    });
  }
};

module.exports = UserLeaveModel;