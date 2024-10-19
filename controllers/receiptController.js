const receiptModel = require('../models/receiptModel');
const db = require('../config/database');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const receiptController = {
  getUsersForReceipt: (req, res) => {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedYear = year || currentDate.getFullYear().toString();
    const selectedMonth = month || String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonthKey = `${selectedYear}-${selectedMonth}`;

    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        console.error('Error fetching users for receipt:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Fetch s_status and s_pic for all users
      const userNames = users.map(user => user.u_name);
      const slipStatusQuery = `
        SELECT u_name, s_status, s_pic
        FROM tbl_slip
        WHERE u_name IN (?)
        AND DATE_FORMAT(day_slip, '%Y-%m') = ?
      `;

      db.query(slipStatusQuery, [userNames, currentMonthKey], (slipErr, slipResults) => {
        if (slipErr) {
          console.error('Error fetching slip status:', slipErr);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Create a map of u_name to slip data
        const slipDataMap = slipResults.reduce((acc, row) => {
          acc[row.u_name] = { s_status: row.s_status, s_pic: row.s_pic };
          return acc;
        }, {});

        const usersWithCurrentMonthData = users.map(user => {
          // Find current month's data
          const currentMonthData = user.monthly_hours.find(month => month.month === currentMonthKey);

          // Add current month's hours and salary to user object
          user.current_month_hours = currentMonthData ? currentMonthData.hours : 0;
          user.current_month_salary = currentMonthData ? currentMonthData.salary : 0;

          // Add s_status and s_pic to user object
          const slipData = slipDataMap[user.u_name] || {};
          user.s_status = slipData.s_status || null;

          // Process profile picture
          if (user.u_profile) {
            if (Buffer.isBuffer(user.u_profile)) {
              user.profile_pic = `data:image/jpeg;base64,${user.u_profile.toString('base64')}`;
            } else if (typeof user.u_profile === 'string') {
              user.profile_pic = user.u_profile;
            }
          } else {
            user.profile_pic = '/image/profile.jpg'; // Default image
          }

          // Process slip picture
          if (slipData.s_pic) {
            if (Buffer.isBuffer(slipData.s_pic)) {
              user.s_pic = `data:image/jpeg;base64,${slipData.s_pic.toString('base64')}`;
            } else if (typeof slipData.s_pic === 'string') {
              user.s_pic = slipData.s_pic;
            }
          } else {
            user.s_pic = null; // No slip picture
          }

          return user;
        });

        res.render('receipt', { 
          users: usersWithCurrentMonthData,
          currentMonth: currentMonthKey,
          selectedYear,
          selectedMonth
        });
      });
    });
  },

  uploadSlip: [
    upload.single('slip'),
    (req, res) => {
      const { u_name, current_month_hours, current_month_salary, selectedMonth, selectedYear } = req.body;
      const s_pic = req.file ? req.file.buffer : null;

      const slipData = {
        u_name,
        hr_month: current_month_hours,
        money_month: current_month_salary,
        s_pic,
        selectedMonth,
        selectedYear
      };

      receiptModel.uploadSlip(slipData, (err, result) => {
        if (err) {
          console.error('Error saving slip:', err);
          res.status(500).send('Error uploading slip: ' + err.message);
        } else {
          res.redirect('/receipt?message=Upload successful');
        }
      });
    }
  ],

  updateSlipStatus: (req, res) => {
    const { u_name, month, year, status } = req.body;
    receiptModel.updateSlipStatus(u_name, month, year, status, (err, result) => {
      if (err) {
        console.error('Error updating slip status:', err);
        res.status(500).json({ error: 'Error updating slip status' });
      } else {
        res.json({ message: 'Status updated successfully' });
      }
    });
  }
};

module.exports = receiptController;