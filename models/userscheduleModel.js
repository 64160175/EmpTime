const db = require('../config/database');

const CalendarModel = {
  getAllSchedules: (username, callback) => { 
    const sql = 'SELECT * FROM tbl_schedule WHERE u_name = ? ORDER BY s_date DESC'; 
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Error fetching schedules:", err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  addSchedule: (scheduleData, callback) => {
    const { u_name, s_date, s_time_in, s_time_out } = scheduleData; 

    // ตรวจสอบข้อมูลซ้ำก่อนการบันทึก
    const checkDuplicateSql = `
      SELECT 1 
      FROM tbl_schedule 
      WHERE u_name = ? AND s_date = ? AND s_time_in = ? AND s_time_out = ?
    `;
    db.query(checkDuplicateSql, [u_name, s_date, s_time_in, s_time_out], (err, duplicateResult) => {
      if (err) {
        console.error("Error checking for duplicate schedule:", err);
        return callback(err, null);
      }

      if (duplicateResult.length > 0) {
        // พบข้อมูลซ้ำ
        return callback(new Error('ตารางงานนี้มีอยู่แล้ว'), null);
      } else {
        // ไม่มีข้อมูลซ้ำ ดำเนินการบันทึก
        // ดึง ID สูงสุดจากตารางและบวก 1 เพื่อสร้าง ID ใหม่
        db.query('SELECT MAX(id) AS maxId FROM tbl_schedule', (err, result) => {
          if (err) {
            return callback(err, null);
          }
          const newId = result[0].maxId + 1;

          const sql = 'INSERT INTO tbl_schedule (id, u_name, s_date, s_time_in, s_time_out, date_his) VALUES (?, ?, ?, ?, ?, NOW())'; 
          const values = [newId, u_name, s_date, s_time_in, s_time_out];

          db.query(sql, values, (err, result) => {
            if (err) {
              console.error("Error adding schedule:", err);
              callback(err, null);
            } else {
              callback(null, result.insertId);
            }
          });
        });
      }
    });
  },

  deleteSchedule: (scheduleId, callback) => {
    const sql = 'DELETE FROM tbl_schedule WHERE id = ?';
    db.query(sql, [scheduleId], (err, result) => {
      if (err) {
        console.error("Error deleting schedule:", err);
        callback(err, null);
      } else {
        callback(null, result.affectedRows); // ส่งผลลัพธ์เป็นจำนวนแถวที่ถูกลบ
      }
    });
  },

  checkUserSchedule: (username, date) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tbl_schedule WHERE u_name = ? AND s_date = ?';
      db.query(query, [username, date], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  },

};

module.exports = CalendarModel;
