const userreceiptModel = require('../models/userreceiptModel');
const UserModel = require('../models/user_userModel');

const userReceiptController = {
  getUserReceipts: async (req, res) => {
    if (!req.session.user || !req.session.user.u_name) {
      return res.redirect('/login?redirect=/user_receipt');
    }

    try {
      const [receipts, userData, hourlyRate] = await Promise.all([
        new Promise((resolve, reject) => {
          userreceiptModel.getAllUserReceipts(req.session.user.u_name, (err, receipts) => {
            if (err) reject(err);
            else resolve(receipts);
          });
        }),
        UserModel.getUserProfile(req.session.user.id),
        new Promise((resolve, reject) => {
          userreceiptModel.getHourlyRate((err, rate) => {
            if (err) reject(err);
            else resolve(rate);
          });
        })
      ]);

      // Process receipts to ensure day_slip is in the correct format
      const processedReceipts = receipts.map(receipt => {
        if (receipt.day_slip) {
          receipt.day_slip = new Date(receipt.day_slip);
        }
        return receipt;
      });

      res.render('user_receipt', {
        receipts: processedReceipts,
        user: req.session.user,
        hourlyRate: hourlyRate || 'N/A'
      });
    } catch (err) {
      console.error('Error fetching user receipts or user data:', err);
      return res.status(500).render('error', { message: 'Internal Server Error' });
    }
  },

  getReceiptDetails: async (req, res) => {
    const receiptId = req.params.id;
    if (!req.session.user || !req.session.user.u_name) {
      return res.redirect('/login?redirect=/user_receipt/' + receiptId);
    }

    try {
      const receipt = await new Promise((resolve, reject) => {
        userreceiptModel.getReceiptById(receiptId, req.session.user.u_name, (err, receipt) => {
          if (err) reject(err);
          else resolve(receipt);
        });
      });

      if (!receipt) {
        return res.status(404).render('error', { message: 'Receipt not found' });
      }

      res.render('receipt_details', { receipt, user: req.session.user });
    } catch (err) {
      console.error('Error fetching receipt details:', err);
      return res.status(500).render('error', { message: 'Internal Server Error' });
    }
  },

  downloadReceipt: async (req, res) => {
    const receiptId = req.params.id;
    if (!req.session.user || !req.session.user.u_name) {
      return res.redirect('/login?redirect=/user_receipt/download/' + receiptId);
    }

    try {
      const receipt = await new Promise((resolve, reject) => {
        userreceiptModel.getReceiptById(receiptId, req.session.user.u_name, (err, receipt) => {
          if (err) reject(err);
          else resolve(receipt);
        });
      });

      if (!receipt) {
        return res.status(404).render('error', { message: 'Receipt not found' });
      }

      // ในที่นี้เราจะส่งข้อความกลับแทน
      res.send(`Download functionality for receipt ${receiptId} is not implemented yet.`);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      return res.status(500).render('error', { message: 'Internal Server Error' });
    }
  }
};

module.exports = userReceiptController;