const checkoutModel = require('../models/userCheckoutModel'); 

const checkoutController = { 
  userHomeCheckout: (req, res) => { 
    const username = req.session.user.u_name;
    const code = req.body.checkoutCode; 

    checkoutModel.verifyCodeAndUser(username, code, (err, result) => { 
      if (err) {
        console.error('Error verifying code:', err);
        return res.status(500).send('Error during checkout'); 
      }

      if (result.length > 0) {
        checkoutModel.recordCheckout(username, code, (err, result) => { 
          if (err) {
            console.error('Error recording checkout:', err); 
            return res.status(500).send('Error during checkout'); 
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

  
};

module.exports = checkoutController; 
