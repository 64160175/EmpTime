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
      const newId = (result[0].maxId || 0) + 1;
  
      
      const todayDate = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
      
      const scheduleQuery = `
        SELECT s_date, s_time_in 
        FROM tbl_schedule 
        WHERE u_name = ? AND s_date = ? 
        ORDER BY s_time_in ASC 
        LIMIT 1
      `;
  
      db.query(scheduleQuery, [username, todayDate], (err, scheduleResult) => {
        if (err) {
          return callback(err, null);
        }
  
        let inStatus = '1'; // Default: มาตรงเวลา
        let scheduledTimeIn = null;
  
        if (scheduleResult.length === 0) {
          // ไม่พบตารางงานสำหรับวันนี้
          inStatus = '3'; // สถานะพิเศษ: ไม่มีตารางงาน
          console.log(`ไม่พบตารางงานสำหรับผู้ใช้ ${username} ในวันที่ ${todayDate}`);
        } else {
          scheduledTimeIn = scheduleResult[0].s_time_in;
          const [hours, minutes] = scheduledTimeIn.split(':').map(Number);
          const scheduledDateTime = new Date(todayDate);
          scheduledDateTime.setHours(hours, minutes, 0, 0);
  
          const currentTime = new Date();
          if (currentTime > scheduledDateTime) {
            inStatus = '2'; // มาสาย
            
            // อัปเดต q_late_part ในตาราง tbl_month_quota
            const updateQuotaSQL = `
              UPDATE tbl_month_quota
              SET q_late_part = q_late_part - 1
              WHERE u_name = ?
            `;
            
            db.query(updateQuotaSQL, [username], (quotaErr, quotaResult) => {
              if (quotaErr) {
                console.error('Error updating q_late_part:', quotaErr);
                // ไม่ต้อง return callback ที่นี่ เพราะเราต้องการให้การบันทึกการเช็คอินดำเนินต่อไป
              } else if (quotaResult.affectedRows === 0) {
                console.warn(`No quota record found for user ${username} for today's date`);
              } else {
                console.log(`Updated q_late_part for user ${username}`);
              }
            });
          }
        }
  
        // บันทึกการเช็คอิน
        const sql = `INSERT INTO tbl_checkin (id, u_name, in_date, in_time, in_code, in_status) VALUES (?, ?, CURDATE(), CURTIME(), ?, ?)`;
        db.query(sql, [newId, username, code, inStatus], (err, insertResult) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, { 
            message: 'บันทึกการเช็คอินสำเร็จ',
            inStatus: inStatus,
            scheduledTimeIn: scheduledTimeIn
          });
        });
      });
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
