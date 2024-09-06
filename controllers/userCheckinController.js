const checkinModel = require('../models/userCheckinModel');

const checkinController = {
  userHomeCheckin: (req, res) => {
    const username = req.session.user.u_name; 
    const code = req.body.checkinCode; 


    checkinModel.verifyCodeAndUser(username, code, (err, result) => {
      if (err) {
        console.error('Error verifying code:', err);
        return res.status(500).send('Error during check-in'); 
      }

      if (result.length > 0) { 
        checkinModel.recordCheckin(username, code, (err, result) => {
          if (err) {
            console.error('Error recording check-in:', err);
            return res.status(500).send('Error during check-in');
          }
          console.log('Check-in successful!');
          res.redirect('/user_home'); // Redirect to a success page
        });
      } else {
        console.log('Invalid code or username');
        res.status(400).send('Invalid check-in code'); 
      }
    });
  }
};

module.exports = checkinController;
