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
  },

  getUserLeaveRequests: (username, callback) => {
    const sql = `
      SELECT id, q_leave_part_used, l_startdate, l_enddate, l_reason, l_status, l_timestamp
      FROM tbl_leave_request
      WHERE u_name = ?
      ORDER BY id DESC
    `;
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getPendingLeaveRequests: (callback) => {
    const sql = `
      SELECT 
        lr.id, 
        lr.u_name, 
        lr.q_leave_part_used, 
        lr.l_startdate, 
        lr.l_enddate, 
        lr.l_reason, 
        lr.l_timestamp,
        u.f_name,
        u.l_name
      FROM tbl_leave_request lr
      JOIN tbl_user u ON lr.u_name = u.u_name
      WHERE lr.l_status = 0
      ORDER BY lr.l_timestamp DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  updateLeaveRequestStatus: (id, status, callback) => {
    db.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }

      // 1. อัพเดทสถานะคำร้องขอ
      const updateStatusSql = 'UPDATE tbl_leave_request SET l_status = ? WHERE id = ?';
      db.query(updateStatusSql, [status, id], (err, result) => {
        if (err) {
          return db.rollback(() => callback(err));
        }

        if (status === 1) { // ถ้าอนุมัติ
          // 2. ดึงข้อมูลคำร้องขอลา
          const getRequestSql = 'SELECT u_name, q_leave_part_used, l_startdate, l_enddate FROM tbl_leave_request WHERE id = ?';
          db.query(getRequestSql, [id], (err, requests) => {
            if (err) {
              return db.rollback(() => callback(err));
            }

            if (requests.length === 0) {
              return db.rollback(() => callback(new Error('Leave request not found')));
            }

            const request = requests[0];

            // 3. อัพเดท tbl_month_quota
            const updateQuotaSql = 'UPDATE tbl_month_quota SET q_leave_part = q_leave_part - ? WHERE u_name = ?';
            db.query(updateQuotaSql, [request.q_leave_part_used, request.u_name], (err, result) => {
              if (err) {
                return db.rollback(() => callback(err));
              }

              // 4. ลบข้อมูลจาก tbl_schedule
              const deleteScheduleSql = 'DELETE FROM tbl_schedule WHERE u_name = ? AND s_date BETWEEN ? AND ?';
              db.query(deleteScheduleSql, [request.u_name, request.l_startdate, request.l_enddate], (err, result) => {
                if (err) {
                  return db.rollback(() => callback(err));
                }

                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => callback(err));
                  }
                  callback(null, result);
                });
              });
            });
          });
        } else {
          // ถ้าไม่อนุมัติ เพียงแค่ commit transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => callback(err));
            }
            callback(null, result);
          });
        }
      });
    });
  },

};

module.exports = UserLeaveModel;