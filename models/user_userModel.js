const db = require('../config/database'); 

const UserModel = {
  getUserProfile: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          u.f_name, 
          u.l_name, 
          COALESCE(u.u_profile, dp.u_profile) AS profile_pic 
        FROM 
          tbl_user u
        LEFT JOIN 
          tbl_default_pic dp ON 1=1
        WHERE 
          u.id = ? 
      `;
      db.query(sql, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Convert the binary data to base64
          if (result[0] && result[0].profile_pic) {
            result[0].profile_pic = `data:image/jpeg;base64,${result[0].profile_pic.toString('base64')}`;
          }
          resolve(result[0]); 
        }
      });
    });
  },

  

  checkAndUpdateMonthlyQuota: (username) => {
    return new Promise((resolve, reject) => {
      const checkExistingSql = 'SELECT * FROM tbl_month_quota WHERE u_name = ?';
      db.query(checkExistingSql, [username], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const getCurrentQuotaSql = 'SELECT leave_part, late_part, absent_part FROM tbl_setting ORDER BY id DESC LIMIT 1';
        db.query(getCurrentQuotaSql, (err, quotaResult) => {
          if (err) {
            reject(err);
            return;
          }

          const { leave_part, late_part, absent_part } = quotaResult[0];
          const currentDate = new Date();

          if (result.length === 0) {
            // หา ID ล่าสุดก่อน
            const getLastIdSql = 'SELECT MAX(id) as lastId FROM tbl_month_quota';
            db.query(getLastIdSql, (err, idResult) => {
              if (err) {
                reject(err);
                return;
              }
              
              const newId = (idResult[0].lastId || 0) + 1; // ถ้าไม่มี ID ให้เริ่มที่ 1
          
              // User doesn't exist in tbl_month_quota, insert new record
              const insertSql = `
                INSERT INTO tbl_month_quota (id, u_name, q_leave_part, q_late_part, q_absent_part, q_date_stamp)
                VALUES (?, ?, ?, ?, ?, ?)
              `;
              db.query(insertSql, [newId, username, leave_part, late_part, absent_part, currentDate], (err, insertResult) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(insertResult);
                }
              });
            });
          } else {
            // User exists, check if it's the current month
            const existingRecord = result[0];
            const existingDate = new Date(existingRecord.q_date_stamp);

            if (existingDate.getMonth() !== currentDate.getMonth() || existingDate.getFullYear() !== currentDate.getFullYear()) {
              // Not current month, update the record
              const updateSql = `
                UPDATE tbl_month_quota
                SET q_leave_part = ?, q_late_part = ?, q_absent_part = ?, q_date_stamp = ?
                WHERE u_name = ?
              `;
              db.query(updateSql, [leave_part, late_part, absent_part, currentDate, username], (err, updateResult) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(updateResult);
                }
              });
            } else {
              // Current month, no action needed
              resolve(null);
            }
          }
        });
      });
    });
  },

  checkUserSchedule: (username, callback) => {
    const today = new Date().toISOString().split('T')[0]; // รูปแบบ YYYY-MM-DD
    const sql = `
      SELECT * FROM tbl_schedule 
      WHERE u_name = ? AND s_date = ?
    `;

    db.query(sql, [username, today], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      const hasScheduleToday = result.length > 0;
      callback(null, hasScheduleToday);
    });
  },
  
};

module.exports = UserModel;
