const db = require('../config/database');

const checkinModel = {
  verifyCodeAndUser: (username, code, callback) => {
    // 1. ตรวจสอบก่อนว่ามีการเช็คอินในวันนี้หรือยัง
    const checkExistingCheckinSql = `
      SELECT * 
      FROM tbl_checkin 
      WHERE u_name = ? 
      AND in_date = CURDATE()
    `;

    db.query(checkExistingCheckinSql, [username], (checkErr, checkResult) => {
      if (checkErr) {
        return callback(checkErr, null);
      }

      if (checkResult.length > 0) {
        // พบข้อมูลการเช็คอินในวันนี้แล้ว
        return callback(null, []); // ส่งผลลัพธ์เป็น array ว่างเพื่อให้เช็คอินไม่สำเร็จ
      } else {
        // 2. หากยังไม่มีการเช็คอินในวันนี้ ให้ดำเนินการตรวจสอบ OTP ต่อ
        const sql = `SELECT * FROM tbl_inout_code WHERE u_name_match = ? AND otp = ?`;
        db.query(sql, [username, code], (err, result) => {
          if (err) {
            return callback(err, null);
          }

          if (result.length > 0) {
            // ไม่ต้องลบโค้ดที่ใช้แล้ว

            callback(null, result); // ดำเนินการเช็คอินต่อ
          } else {
            callback(null, []); // ไม่พบโค้ดที่ตรงกัน
          }
        });
      }
    });
  },

  recordCheckin: (username, code, callback) => {
    // ดึง ID ล่าสุดจาก tbl_checkin
    db.query('SELECT MAX(id) AS maxId FROM tbl_checkin', (err, result) => {
      if (err) {
        return callback(err, null);
      }
      const newId = result[0].maxId + 1; // คำนวณ ID ใหม่

      // แก้ไข SQL query เพื่อ insert ค่าตาม column ในตาราง tbl_checkin พร้อม ID ใหม่
      const sql = `INSERT INTO tbl_checkin (id, u_name, in_date, in_time, in_code, in_status) VALUES (?, ?, CURDATE(), CURTIME(), ?, '1')`;
      db.query(sql, [newId, username, code], (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
    });
  },

  getTodaysCheckinTime: (username, callback) => {
    const today = new Date().toISOString().slice(0, 10);
    const sql = `SELECT in_time FROM tbl_checkin WHERE u_name = ? AND in_date = ?`;
    db.query(sql, [username, today], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.length > 0) {
        callback(null, result[0].in_time); // Return the in_time
      } else {
        callback(null, null); // No check-in found for today
      }
    });
  }
};

module.exports = checkinModel;
