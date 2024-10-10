const db = require('../config/database');

const receiptModel = {
  getUsersForReceipt: (callback) => {
    const query = `
      SELECT u.id, u.f_name, u.l_name, 
             COALESCE(u.u_profile, d.u_profile) AS u_profile
      FROM tbl_user u
      LEFT JOIN tbl_default_pic d ON 1=1
      WHERE u.u_type_name_id = 2 AND u.u_status = 1
    `;
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // เพิ่มฟังก์ชันอื่นๆ ที่เกี่ยวข้องกับการดึงข้อมูลใบเสร็จที่นี่
};

module.exports = receiptModel;