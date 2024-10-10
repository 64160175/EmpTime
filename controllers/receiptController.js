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
            // ถ้าเป็น Buffer ให้แปลงเป็น Base64
            user.profile_pic = `data:image/jpeg;base64,${user.u_profile.toString('base64')}`;
          } else if (typeof user.u_profile === 'string') {
            // ถ้าเป็น string (path) ให้ใช้โดยตรง
            user.profile_pic = user.u_profile;
          }
        } else {
          user.profile_pic = '/image/profile.jpg'; // รูปเริ่มต้น
        }
        return user;
      });

      res.render('receipt', { users: usersWithProfilePics });
    });
  },
};

module.exports = receiptController;