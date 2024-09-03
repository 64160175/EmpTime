const UserSchedule = require('../models/userscheduleModels'); // กำหนด path ไปยังไฟล์ userscheduleModels.js

const userscheduleController = {
  getUserSchedule: (req, res) => {
    const userId = req.session.user.id; // สมมติว่าคุณเก็บข้อมูล user ใน session
    UserSchedule.getUserSchedule(userId, (err, schedule) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.render('user_schedule', { schedule }); // ส่งข้อมูล schedule ไปยัง view
      }
    });
  },

  // เพิ่มฟังก์ชันอื่นๆ เช่น createUserSchedule, updateUserSchedule, deleteUserSchedule ตามต้องการ
};

module.exports = userscheduleController;
