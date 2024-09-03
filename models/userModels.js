const db = require('../config/database'); // กำหนด path ไปยังไฟล์ database config

const User = {
  getAllUsers: (callback) => {
    const query = 'SELECT * FROM tbl_user'; // เปลี่ยนชื่อตารางตาม database จริง
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

};

module.exports = User;
