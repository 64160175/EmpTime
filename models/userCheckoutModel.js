const db = require('../config/database');

const checkoutModel = { // เปลี่ยนชื่อเป็น checkoutModel
  verifyCodeAndUser: (username, code, callback) => {
    // 1. ตรวจสอบว่ามีการเช็คอินในวันนี้หรือยัง
    const checkExistingCheckinSql = `
      SELECT * 
      FROM tbl_checkin 
      WHERE u_name = ? 
      AND in_date = CURDATE() AND in_status = 1
    `;

    db.query(checkExistingCheckinSql, [username], (checkErr, checkResult) => {
      if (checkErr) {
        return callback(checkErr, null);
      }

      if (checkResult.length > 0) {
        // 2. หากมีการเช็คอินในวันนี้ ให้ดำเนินการตรวจสอบ OTP ต่อ
        const sql = `SELECT * FROM tbl_inout_code WHERE u_name_match = ? AND otp = ?`;
        db.query(sql, [username, code], (err, result) => {
          if (err) {
            return callback(err, null);
          }

          if (result.length > 0) {
            callback(null, result); // ดำเนินการเช็คเอาท์ต่อ
          } else {
            callback(null, []); // ไม่พบโค้ดที่ตรงกัน
          }
        });
      } else {
        // ยังไม่มีการเช็คอินในวันนี้
        return callback(null, []); 
      }
    });
  },

  recordCheckout: (username, code, callback) => { 
    const sql = `INSERT INTO tbl_checkout (u_name, out_date, out_time, out_code, out_status) 
                 VALUES (?, CURDATE(), CURTIME(), ?, '1')`;
    db.query(sql, [username, code], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  getTodaysCheckinTime: (username, callback) => {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust '7' to your time zone offset from UTC
    const formattedToday = today.toISOString().slice(0, 10); 
    
  
    const sql = `SELECT in_time FROM tbl_checkout WHERE u_name = ? AND DATE(out_date) = ?`;
    db.query(sql, [username, formattedToday], (err, result) => {
      if (err) {
        return callback(err, null);
      }
  
      // Check if a check-in record exists for today
      if (result.length > 0) {
        callback(null, result[0].in_time); // Return the in_time
      } else {
        // No check-in found for today, return the default message
        callback(null, '--:-- (ยังไม่ได้เช็คเอ้าท์)'); 
      }
    });
  }
  
};


module.exports = checkoutModel; 
