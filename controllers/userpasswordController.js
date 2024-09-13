const UserPasswordModel = require('../models/userpasswordModels');

const userPasswordController = {
  showChangePasswordPage: (req, res) => {
    res.render('user_password', { error: null, success: null }); 
  },

  updatePassword: (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user.id; 

    try {
      UserPasswordModel.updatePassword(userId, currentPassword, newPassword, (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          res.render('user_password', { error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง', success: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
        } else {
          res.render('user_password', { error: null, success: 'เปลี่ยนรหัสผ่านสำเร็จ' });  
        }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).render('error_page', { error: 'เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน' });
    }
  },
};

module.exports = userPasswordController;
