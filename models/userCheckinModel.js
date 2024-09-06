const db = require('../config/database'); // Assuming you have a database connection setup

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
            // ลบโค้ดที่ใช้แล้ว
            const deleteSql = `DELETE FROM tbl_inout_code WHERE u_name_match = ? AND otp = ?`;
            db.query(deleteSql, [username, code], (deleteErr, deleteResult) => {
              if (deleteErr) {
                console.error('Error deleting used code:', deleteErr);
              } 
            });
  
            callback(null, result); // ดำเนินการเช็คอินต่อ
          } else {
            callback(null, []); // ไม่พบโค้ดที่ตรงกัน
          }
        });
      }
    });
  },

  recordCheckin: (username, code, callback) => {
    // แก้ไข SQL query เพื่อ insert ค่าตาม column ในตาราง tbl_checkin
    const sql = `INSERT INTO tbl_checkin (u_name, in_date, in_time, in_code, in_status) VALUES (?, CURDATE(), CURTIME(), ?, '1')`;
    db.query(sql, [username, code], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }
};

module.exports = checkinModel;
