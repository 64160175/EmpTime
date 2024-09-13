const db = require('../config/database');
const bcrypt = require('bcrypt'); // สำหรับเข้ารหัสรหัสผ่าน

const UserPasswordModel = {
  updatePassword: (userId, currentPassword, newPassword, callback) => {
    // 1. ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const getUserSql = 'SELECT * FROM tbl_user WHERE id = ?';
    db.query(getUserSql, [userId], (err, userResult) => {
      if (err) {
        return callback(err, null);
      }

      if (userResult.length === 0) {
        return callback(new Error('ไม่พบผู้ใช้'), null);
      }

      const user = userResult[0];

      // 2. ตรวจสอบรหัสผ่านปัจจุบัน
      bcrypt.compare(currentPassword, user.u_pass, (err, isMatch) => {
        if (err) {
          return callback(err, null);
        }

        if (!isMatch) {
          return callback(new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง'), null);
        }

        // 3. เข้ารหัสรหัสผ่านใหม่
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            return callback(err, null);
          }

          // 4. อัปเดตรหัสผ่านในฐานข้อมูล
          const updatePasswordSql = 'UPDATE tbl_user SET u_pass = ? WHERE id = ?';
          db.query(updatePasswordSql, [hash, userId], (err, result) => {
            if (err) {
              return callback(err, null);
            }

            callback(null, result);
          });
        });
      });
    });
  },
};

module.exports = UserPasswordModel;
