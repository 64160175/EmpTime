const db = require('../config/database');

const UserEditProfile = {
  getUserData: (userId, callback) => {
    const sql = 'SELECT u_profile, f_name, tel FROM tbl_user WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.length === 0) {
        return callback(new Error('User not found'), null);
      }
      callback(null, result[0]);
    });
  },

  updateUserData: (userId, userData, profilePicture, callback) => {
    let sql, values;

    if (profilePicture) {
      sql = `
        UPDATE tbl_user 
        SET f_name = ?, l_name = ?, n_name = ?, tel = ?, u_profile = ? 
        WHERE id = ?
      `;
      values = [
        userData.firstName,
        userData.lastName,
        userData.nickName,
        userData.phoneNumber,
        profilePicture,
        userId,
      ];
    } else {
      sql = `
        UPDATE tbl_user 
        SET f_name = ?, l_name = ?, n_name = ?, tel = ? 
        WHERE id = ?
      `;
      values = [
        userData.firstName,
        userData.lastName,
        userData.nickName,
        userData.phoneNumber,
        userId,
      ];
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },
};

module.exports = UserEditProfile;