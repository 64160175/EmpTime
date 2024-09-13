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
        // Redirect to error page if check-in failed
        res.redirect('/error_chackin_out_page'); 
      }
    });
  },

  getCheckinTime: (req, res) => {
    const username = req.session.user.u_name;

    checkinModel.getTodaysCheckinTime(username, (err, checkinTime) => {
      if (err) {
        console.error('Error fetching check-in time:', err);
        return res.status(500).send('Error fetching check-in time');
      }

      // Format the check-in time or set a default message
      const formattedCheckinTime = checkinTime 
        ? checkinTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:-- (ยังไม่ได้เช็คอิน)';

      res.json({ checkinTime: formattedCheckinTime }); // Send the time as JSON
    });
  }
};

module.exports = checkinController;
