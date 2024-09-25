const db = require("../config/database");

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
    db.query("SELECT MAX(id) AS maxId FROM tbl_checkin", (err, result) => {
      if (err) {
        return callback(err, null);
      }
      const newId = result[0].maxId + 1;

      // ดึงเวลาเปิดร้านจาก tbl_setting
      db.query(
        "SELECT open_time FROM tbl_setting ORDER BY id DESC LIMIT 1",
        (err, settingResult) => {
          if (err) {
            return callback(err, null);
          }

          const openTime = settingResult[0].open_time;

          // เปรียบเทียบเวลาเช็คอินกับเวลาเปิดร้าน
          const checkinTime = new Date(); // ได้เวลาปัจจุบัน

          // Create a new Date object for openTime
          const [hours, minutes] = openTime.split(":").map(Number);
          const openTimeDate = new Date();
          openTimeDate.setHours(hours, minutes, 0, 0); // ตั้งเวลาให้ตรงกับเวลาเปิดร้าน

          let inStatus = "1"; // Default: มาตรงเวลา
          if (checkinTime.getTime() > openTimeDate.getTime()) {
            inStatus = "2"; // มาสาย
          }

          // แก้ไข SQL query เพื่อ insert ค่าตาม column ในตาราง tbl_checkin พร้อม ID ใหม่ และ in_status
          const sql = `INSERT INTO tbl_checkin (id, u_name, in_date, in_time, in_code, in_status) VALUES (?, ?, CURDATE(), CURTIME(), ?, ?)`;
          db.query(sql, [newId, username, code, inStatus], (err, result) => {
            if (err) {
              return callback(err, null);
            }
            callback(null, result);
          });
        }
      );
    });
  },

  getTodaysCheckinTime: (username, callback) => {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust '7' to your time zone offset from UTC
    const formattedToday = today.toISOString().slice(0, 10);

    const sql = `SELECT in_time FROM tbl_checkin WHERE u_name = ? AND DATE(in_date) = ?`;
    db.query(sql, [username, formattedToday], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      // Check if a check-in record exists for today
      if (result.length > 0) {
        callback(null, result[0].in_time); // Return the in_time
      } else {
        // No check-in found for today, return the default message
        callback(null, "--:-- (ยังไม่ได้เช็คอิน)");
      }
    });
  },
};

module.exports = checkinModel;
