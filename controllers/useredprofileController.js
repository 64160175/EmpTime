const UserEditProfile = require('../models/userEditProfileModel'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('profilePicture');

const userEditProfileController = {
  getEditProfile: (req, res) => {
    const userId = req.session.user.id;

    UserEditProfile.getUserData(userId, (err, user) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.redirect('/error_page'); 
      }
      res.render('user_editprofile', { user: user });
    });
  },

  postEditProfile: (req, res) => {
    upload(req, res, (err) => {
      if (err) {
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

        console.log('User data updated successfully:', result);

        // Update session data 
        req.session.user = {
          ...req.session.user,
          ...userData,
        };

        res.render('user_editprofile', { user: req.session.user, message: 'Profile updated successfully!' });
      });
    });
  },
};

module.exports = userEditProfileController;
