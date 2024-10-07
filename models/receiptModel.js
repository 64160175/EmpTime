const db = require('../config/database');

const receiptModel = {
  getUsersForReceipt: (callback) => {
    const query = 'SELECT id, f_name, l_name FROM tbl_user WHERE u_type_name_id = 2';
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  getUserProfilePicture: (userId, callback) => {
    const query = 'SELECT u_profile FROM tbl_user WHERE id = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length > 0 && results[0].u_profile) {
        // พบรูปโปรไฟล์ใน tbl_user
        return callback(null, results[0].u_profile);
      } else {
        // ไม่พบรูปโปรไฟล์ใน tbl_user, ดึงจาก tbl_default_pic
        const defaultQuery = 'SELECT u_profile FROM tbl_default_pic LIMIT 1';
        db.query(defaultQuery, (defaultError, defaultResults) => {
          if (defaultError) {
            return callback(defaultError, null);
          }

          if (defaultResults.length > 0) {
            // ส่งกลับรูปโปรไฟล์ default
            return callback(null, defaultResults[0].u_profile);
          } else {
            // ไม่พบรูปโปรไฟล์ default เช่นกัน
            return callback(null, null); // หรือส่งกลับ path ของรูปภาพ placeholder
          }
        });
      }
    });
  },
};

module.exports = receiptModel;