const InoutCode = require('../models/inoutCodeModel'); // Adjust path if needed

exports.generateCode = (req, res) => {
  const username = req.body.username;

  // Input validation: Don't proceed if username is empty or not provided
  if (!username) {
    return res.status(400).send('Username is required'); 
  }

  InoutCode.generateAndSaveOTP(username, (err, otp) => {
    if (err) {
      console.error('Error generating code:', err); 
      let errorMessage = 'Error generating code';
      if (err.message === 'Username does not exist') {
        errorMessage = 'Username does not exist';
      } else if (err.message.includes('ER_BAD_FIELD_ERROR')) {
        errorMessage = 'Database error. Please check your table and column names.';
      }

      return res.render('gen_code', { 
        error: errorMessage, 
        username: username 
      });
    }

    res.render('gen_code', { 
      otp: otp,
      username: username,
      success: 'Code generated successfully!' 
    });
  });
};
