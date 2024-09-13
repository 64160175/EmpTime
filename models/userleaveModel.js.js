const db = require('../config/database');

const UserLeaveModel = {
  // ดึงข้อมูลประเภทการลา
  getLeaveTypes: (callback) => {
    const sql = 'SELECT * FROM tbl_leave_types';
    db.query(sql, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // ส่งคำร้องขอลา
  submitLeaveRequest: (userId, leaveData, callback) => {
    const { leaveTypeId, startDate, endDate, reason } = leaveData;
    const sql = `
      INSERT INTO tbl_leave_requests (user_id, leave_type_id, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    db.query(sql, [userId, leaveTypeId, startDate, endDate, reason], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.insertId); // ส่งกลับ ID ของคำร้องที่สร้างใหม่
    });
  },

  // ดึงประวัติการลาของพนักงาน
  getLeaveHistory: (userId, callback) => {
    const sql = `
      SELECT lr.*, lt.leave_type_name
      FROM tbl_leave_requests lr
      JOIN tbl_leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.user_id = ?
      ORDER BY lr.start_date DESC
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};

module.exports = UserLeaveModel;
