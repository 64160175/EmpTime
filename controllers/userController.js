const User = require('../models/userModels'); // กำหนด path ไปยังไฟล์ userModels.js


const userController = {
  getAllUsers: (req, res) => {
    User.getAllUsers((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.render('userView', { users }); // ส่งข้อมูล users ไปยัง view
      }
    });
  },

  // เพิ่มฟังก์ชันอื่นๆ เช่น getUserById, createUser, updateUser, deleteUser ตามต้องการ
};

module.exports = userController;




