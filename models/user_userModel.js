const db = require('../config/database'); 

const UserModel = {
  getUserProfile: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          u.f_name, 
          u.l_name, 
          COALESCE(u.u_profile, dp.u_profile) AS profile_pic 
        FROM 
          tbl_user u
        LEFT JOIN 
          tbl_default_pic dp ON 1=1
        WHERE 
          u.id = ? 
      `;
      db.query(sql, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Convert the binary data to base64
          if (result[0] && result[0].profile_pic) {
            result[0].profile_pic = `data:image/jpeg;base64,${result[0].profile_pic.toString('base64')}`;
          }
          resolve(result[0]); 
        }
      });
    });
  },
};

module.exports = UserModel;
