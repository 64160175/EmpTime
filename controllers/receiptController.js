const receiptModel = require('../models/receiptModel');

const receiptController = {
  getUsersForReceipt: (req, res) => {
    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const usersWithProfilePics = users.map(user => {
        // จัดการรูปโปรไฟล์
        if (user.u_profile) {
          if (Buffer.isBuffer(user.u_profile)) {
            user.profile_pic = `data:image/jpeg;base64,${user.u_profile.toString('base64')}`;
          } else if (typeof user.u_profile === 'string') {
            user.profile_pic = user.u_profile;
          }
        } else {
          user.profile_pic = '/image/profile.jpg';
        }

        // จัดการข้อมูลเงินเดือน
        user.monthly_salary = user.monthly_hours.map(month => ({
          ...month,
          salary: Math.round(month.hours * user.rate_hr * 100) / 100
        }));

        // คำนวณเงินเดือนรวม
        user.total_salary = Math.round(user.total_hours * user.rate_hr * 100) / 100;

        // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่ายขึ้น
        user.salary_data = user.salary_data.map(day => ({
          ...day,
          formatted_date: new Date(day.work_date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));

        return user;
      });

      // เรียงลำดับผู้ใช้ตามชื่อ
      usersWithProfilePics.sort((a, b) => a.f_name.localeCompare(b.f_name));

      res.render('receipt', { 
        users: usersWithProfilePics,
        formatNumber: (num) => num.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})
      });
    });
  },
};

module.exports = receiptController;