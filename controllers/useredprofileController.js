const UserEditProfile = require('../models/useredprofileModel'); 
const multer = require('multer');

// ตั้งค่า Multer สำหรับจัดการไฟล์อัปโหลด
const storage = multer.memoryStorage(); 

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // กำหนดขนาดไฟล์สูงสุด (เช่น 5MB)
  }
}).single('profilePicture'); // 'profilePicture' ต้องตรงกับชื่อ input ในฟอร์ม

const userEditProfileController = {
  getEditProfile: (req, res) => {
    const userId = req.session.user.id;

    UserEditProfile.getUserData(userId, (err, user) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.redirect('/error_page'); // หรือจัดการข้อผิดพลาดที่เหมาะสม
      }

      res.render('user_editprofile', { user: user });
    });
  },

  postEditProfile: (req, res) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // เกิดข้อผิดพลาด Multer (เช่น ขนาดไฟล์เกิน)
        console.error('Error uploading file (Multer):', err);
        return res.redirect('/user_editprofile'); 
      } else if (err) {
        // เกิดข้อผิดพลาดอื่นๆ
        console.error('Error uploading file:', err);
        return res.redirect('/user_editprofile'); 
      }

      const userId = req.session.user.id;
      const userData = req.body;
      const profilePicture = req.file ? req.file.buffer : null; 

      UserEditProfile.updateUserData(userId, userData, profilePicture, (err, result) => {
        if (err) {
          console.error('Error updating user data:', err);
          return res.redirect('/user_editprofile'); 
        }

        // console.log('User data updated successfully:', result);

        req.session.user = {
          ...req.session.user,
          f_name: userData.firstName,
          l_name: userData.lastName,
        };

        res.render('user_editprofile', { 
          user: req.session.user, 
          message: 'Profile updated successfully!' 
        });
      });
    });
  },
};

module.exports = userEditProfileController;
