const userreceiptModel = require('../models/userreceiptModel');

const userReceiptController = {
  getUserReceipts: (req, res) => {
    if (!req.session.user || !req.session.user.u_name) {
      return res.redirect('/login?redirect=/user_receipt');
    }

    userreceiptModel.getAllUserReceipts(req.session.user.u_name, (err, receipts) => {
      if (err) {
        console.error('Error fetching user receipts:', err);
        return res.status(500).render('error', { message: 'Internal Server Error' });
      }

      // Process receipts to ensure day_slip is in the correct format
      const processedReceipts = receipts.map(receipt => {
        if (receipt.day_slip) {
          // Ensure day_slip is a JavaScript Date object
          receipt.day_slip = new Date(receipt.day_slip);
        }
        return receipt;
      });

      const hourlyRate = req.session.user.hourlyRate || 'N/A';

      res.render('user_receipt', {
        receipts: processedReceipts,
        user: req.session.user,
        hourlyRate: hourlyRate
      });
    });
  }
};

module.exports = userReceiptController;