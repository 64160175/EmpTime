const db = require('../config/database'); // Assuming you have a database connection setup

const checkinModel = {
  verifyCodeAndUser: (username, code, callback) => {
    const sql = `SELECT * FROM tbl_inout_code WHERE u_name_match = ? AND otp = ?`;
    db.query(sql, [username, code], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      // Check if a matching record is found
      if (result.length > 0) {
        // Delete the used code from tbl_inout_code
        const deleteSql = `DELETE FROM tbl_inout_code WHERE u_name_match = ? AND otp = ?`;
        db.query(deleteSql, [username, code], (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error('Error deleting used code:', deleteErr);
            // Handle the error (e.g., log it), but don't block the check-in
          }
          //  ตรวจสอบว่าการลบสำเร็จหรือไม่
          if (deleteResult.affectedRows > 0) {
            console.log('Used code deleted successfully');
          } else {
            console.log('No matching code found for deletion');
          }
        });

        callback(null, result); // Proceed with check-in
      } else {
        callback(null, []); // No matching code found
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
