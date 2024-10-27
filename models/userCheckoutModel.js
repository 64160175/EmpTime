const db = require("../config/database");

const checkoutModel = {
  // เปลี่ยนชื่อเป็น checkoutModel
  verifyCodeAndUser: (username, code, callback) => {
    // 1. ตรวจสอบว่ามีการเช็คอินในวันนี้หรือยัง
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
    // ดึง ID ล่าสุดจาก tbl_checkout
    db.query("SELECT MAX(id) AS maxId FROM tbl_checkout", (err, result) => {
      if (err) {
        return callback(err, null);
      }
      const newId = result[0].maxId + 1; // คำนวณ ID ใหม่
  
      // ดึงข้อมูลตารางงานของวันนี้จาก tbl_schedule
      const getScheduleSql = `
        SELECT s_time_out 
        FROM tbl_schedule 
        WHERE u_name = ? 
        AND s_date = CURDATE()
        ORDER BY s_time_out DESC
        LIMIT 1
      `;
      db.query(getScheduleSql, [username], (err, scheduleResult) => {
        if (err) {
          return callback(err, null);
        }
  
        if (scheduleResult.length === 0) {
          return callback(new Error("ไม่พบข้อมูลตารางงานสำหรับวันนี้"), null);
        }
  
        const scheduledEndTime = scheduleResult[0].s_time_out;
  
        // ดึงเวลาเช็คอินล่าสุดของวันนี้จาก tbl_checkin
        const getCheckinTimeSql = `
          SELECT in_time 
          FROM tbl_checkin 
          WHERE u_name = ? 
          AND in_date = CURDATE()
        `;
        db.query(getCheckinTimeSql, [username], (err, checkinResult) => {
          if (err) {
            return callback(err, null);
          }
  
          if (checkinResult.length === 0) {
            return callback(new Error("ไม่พบข้อมูลการเช็คอิน"), null);
          }
  
          const checkinTime = new Date(checkinResult[0].in_time);
  
          // เปรียบเทียบเวลาเช็คเอาท์กับเวลาลงงานที่กำหนด
          let checkoutTime = new Date(); // ได้เวลาปัจจุบัน
          const [scheduleHours, scheduleMinutes] = scheduledEndTime.split(":").map(Number);
          const scheduledEndDateTime = new Date();
          scheduledEndDateTime.setHours(scheduleHours, scheduleMinutes, 0, 0);
  
          if (checkoutTime.getTime() > scheduledEndDateTime.getTime()) {
            checkoutTime = scheduledEndDateTime; // ใช้เวลาลงงานที่กำหนดเป็นเวลาเช็คเอาท์
          }
  
          // แก้ไข SQL query เพื่อ insert ค่าตาม column ในตาราง tbl_checkout พร้อม ID ใหม่
          const sql = `
            INSERT INTO tbl_checkout (id, u_name, out_date, out_time, out_code, out_status) 
            VALUES (?, ?, CURDATE(), ?, ?, '1')
          `;
          db.query(
            sql,
            [newId, username, checkoutTime, code],
            (err, result) => {
              if (err) {
                return callback(err, null);
              }
  
              // Call the callback regardless of update success/failure
              callback(null, result);
            }
          );
        });
      });
    });
  },

  getTodaysCheckoutTime: (username, callback) => {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust '7' to your time zone offset from UTC
    const formattedToday = today.toISOString().slice(0, 10);

    const sql = `SELECT out_time FROM tbl_checkout WHERE u_name = ? AND DATE(out_date) = ?`;
    db.query(sql, [username, formattedToday], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      // Check if a check-in record exists for today
      if (result.length > 0) {
        callback(null, result[0].out_time); // Return the in_time
      } else {
        // No check-in found for today, return the default message
        callback(null, "--:-- (ยังไม่ได้เช็คเอ้าท์)");
      }
    });
  },
};

module.exports = checkoutModel;