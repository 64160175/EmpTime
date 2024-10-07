const receiptModel = require('../models/receiptModel');

const receiptController = {
  getUsersForReceipt: (req, res) => {
    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const userPromises = users.map(user => {
        return new Promise((resolve, reject) => {
          receiptModel.getUserProfilePicture(user.id, (err, profilePic) => {
            if (err) {
              reject(err);
            } else {
              user.profile_pic = profilePic || '/image/profile.jpg'; // ใช้รูปเริ่มต้นถ้าไม่มีรูปโปรไฟล์
              resolve(user);
            }
          });
        });
      });

      Promise.all(userPromises)
        .then(usersWithProfilePics => {
          res.render('receipt', { users: usersWithProfilePics });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
  }
};

module.exports = receiptController;