const db = require('../config/database');

const InoutCode = {
  generateAndSaveOTP: (username, result) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // First, check if a record with the given username exists in tbl_inout_code
    const selectQuery = `
      SELECT id 
      FROM tbl_inout_code 
      WHERE u_name_match = ?
    `;

    db.query(selectQuery, [username], (err, res) => {
      if (err) {
        console.error('Error checking for existing username in tbl_inout_code:', err);
        return result(err, null);
      }

      if (res.length > 0) {
        // Username exists in tbl_inout_code, update the OTP
        const updateQuery = `
          UPDATE tbl_inout_code 
          SET otp = ? 
          WHERE u_name_match = ?
        `;
        db.query(updateQuery, [otp, username], (err, res) => {
          if (err) {
            console.error('Error updating OTP:', err);
            return result(err, null);
          }
          console.log('OTP updated successfully:', otp);
          return result(null, otp);
        });

      } else {
        // Username doesn't exist in tbl_inout_code, check tbl_user and get the next ID
        const getUserAndNextIdQuery = `
          SELECT u_name, (SELECT MAX(id) + 1 FROM tbl_inout_code) AS nextId 
          FROM tbl_user 
          WHERE u_name = ?
        `;

        db.query(getUserAndNextIdQuery, [username], (err, userRes) => {
          if (err) {
            console.error('Error checking for username in tbl_user:', err);
            return result(err, null);
          }

          if (userRes.length > 0) {
            const nextId = userRes[0].nextId || 1; // If table is empty, start with ID 1

            // Username exists in tbl_user, insert a new record in tbl_inout_code with the next ID
            const insertQuery = `
              INSERT INTO tbl_inout_code (id, u_name_match, otp) 
              VALUES (?, ?, ?)
            `;
            db.query(insertQuery, [nextId, username, otp], (err, res) => {
              if (err) {
                console.error('Error inserting OTP:', err);
                return result(err, null);
              }
              console.log('OTP inserted successfully:', otp);
              return result(null, otp);
            });
          } else {
            // Username doesn't exist in either table
            return result(new Error('Username does not exist in the system'), null);
          }
        });
      }
    });
  },
};

module.exports = InoutCode;

