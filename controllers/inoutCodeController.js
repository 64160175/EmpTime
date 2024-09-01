const InoutCode = require('../models/inoutCodeModel'); // Adjust path if needed

exports.generateCode = (req, res) => {
  const username = req.body.username;

  InoutCode.generateAndSaveOTP(username, (err, otp) => {
    if (err) {
      // Handle error (e.g., send an error response)
      return res.status(500).send('Error generating code');
    }

    // Pass the generated OTP to the view or handle it as needed
    res.render('gen_code', { 
      otp: otp,
      username: username,
      // ... other data for the view
    });
  });
};
