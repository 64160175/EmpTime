const db = require('../config/database'); // Adjust path if needed

const InoutCode = {
  generateAndSaveOTP: (username, result) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    const insertQuery = `
      INSERT INTO tbl_inout_code (u_name_match, otp) 
      VALUES (?, ?)
    `;

    db.query(insertQuery, [username, otp], (err, res) => {
      if (err) {
        console.error('Error inserting data into tbl_inout_code:', err);
        result(err, null);
        return;
      }
      console.log('OTP generated and saved successfully:', otp);
      result(null, otp);
    });
  },
};

module.exports = InoutCode;
