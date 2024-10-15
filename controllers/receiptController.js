const receiptModel = require('../models/receiptModel');

const receiptController = {
  getUsersForReceipt: (req, res) => {
    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const usersWithProfilePics = users.map(user => {
        if (user.u_profile) {
          if (Buffer.isBuffer(user.u_profile)) {
            user.profile_pic = `data:image/jpeg;base64,${user.u_profile.toString('base64')}`;
          } else if (typeof user.u_profile === 'string') {
            user.profile_pic = user.u_profile;
          }
        } else {
          user.profile_pic = '/image/profile.jpg';
        }

        // คำนวณชั่วโมงรวมจาก salary_data
        user.total_hours = user.salary_data.reduce((sum, day) => sum + parseFloat(day.day_hr), 0);
        user.total_hours = Math.round(user.total_hours * 100) / 100; // ปัดเศษทศนิยมให้เหลือ 2 ตำแหน่ง

        //console.log(`User ${user.f_name} total hours: ${user.total_hours}`);
        //console.log(`User ${user.f_name} salary data:`, JSON.stringify(user.salary_data, null, 2));

        return user;
      });

      res.render('receipt', { users: usersWithProfilePics });
    });
  },
};

module.exports = receiptController;