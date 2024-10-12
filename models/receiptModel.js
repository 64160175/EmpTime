const db = require('../config/database');

const receiptModel = {
  getUsersForReceipt: (callback) => {
    const query = `
      SELECT 
        u.id, 
        u.f_name, 
        u.l_name, 
        u.u_name,
        u.u_namebank, 
        u.u_idbook,
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
};

module.exports = receiptModel;