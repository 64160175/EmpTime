const checkoutModel = require('../models/userCheckoutModel'); 

const checkoutController = { 
  userHomeCheckout: (req, res) => { 
    const username = req.session.user.u_name;
    const code = req.body.checkoutCode; 

    console.log("Username:", username); // ตรวจสอบ username
    console.log("Checkout Code:", code); // ตรวจสอบ code

    checkoutModel.verifyCodeAndUser(username, code, (err, result) => { 
      if (err) {
        console.error('Error verifying code:', err);
        return res.status(500).send('Error during checkout'); 
      }

      console.log("Verification Result:", result); // ตรวจสอบผลลัพธ์การตรวจสอบ

      if (result.length > 0) {
        checkoutModel.recordCheckout(username, code, (err, result) => { 
          if (err) {
            console.error('Error recording checkout:', err); 
            return res.status(500).send('Error during checkout: ' + err.message); // แสดง error message ให้ละเอียดขึ้น
          }
          console.log('Checkout successful!'); 
          res.redirect('/user_home'); 
        });
      } else {
        console.log('Invalid code or username');
        res.redirect('/error_chackin_out_page'); 
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
