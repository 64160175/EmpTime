const checkoutModel = require('../models/userCheckoutModel');

const checkoutController = {
  userHomeCheckout: (req, res) => {
    const username = req.session.user.u_name;
    const code = req.body.checkoutCode;
  
    checkoutModel.verifyCodeAndUser(username, code, (err, result) => {
      if (err) {
        console.error('Error verifying code:', err);
        return res.status(500).send('Error during check-out');
      }
  
      if (result.length > 0) {
        checkoutModel.recordCheckout(username, code, (err, result) => {
          if (err) {
            console.error('Error recording check-out:', err);
            return res.status(500).send('Error during check-out');
          }
          console.log('Check-out successful!');
          if (req.flash) {
            req.flash('success', 'เช็คเอาท์สำเร็จ');
          }
          res.redirect('/user_home');
        });
      } else {
        console.log('Invalid code or username');
        if (req.flash) {
          req.flash('error', 'รหัสไม่ถูกต้องหรือชื่อผู้ใช้ไม่ถูกต้อง');
        }
        res.redirect('/error_checkin_out_page');
      }
    });
  },

  getCheckoutTime: (req, res) => {
    const username = req.session.user.u_name;
  
    checkoutModel.getTodaysCheckoutTime(username, (err, checkoutTime) => {
      if (err) {
        console.error('Error fetching check-out time:', err);
        return res.status(500).send('Error fetching check-out time');
      }
  
      const formattedCheckoutTime = checkoutTime instanceof Date
        ? checkoutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : checkoutTime;

      res.json({ checkoutTime: formattedCheckoutTime });
    });
  }
};

module.exports = checkoutController;