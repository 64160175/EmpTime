const db = require('../config/database'); // กำหนด path ไปยังไฟล์ database config

const UserSchedule = {
  getUserSchedule: (userId, callback) => {
    const query = 'SELECT * FROM tbl_user_schedule WHERE user_id = ?'; // เปลี่ยนชื่อตารางและ column ตาม database จริง
    db.query(query, [userId], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // เพิ่มฟังก์ชันอื่นๆ เช่น createUserSchedule, updateUserSchedule, deleteUserSchedule ตามต้องการ
};

module.exports = UserSchedule;
