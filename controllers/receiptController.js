const receiptModel = require('../models/receiptModel');
const db = require('../config/database');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const receiptController = {
  getUsersForReceipt: (req, res) => {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedYear = year || currentDate.getFullYear();
    const selectedMonth = month || String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonthKey = `${selectedYear}-${selectedMonth}`;

    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        console.error('Error fetching users for receipt:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Fetch s_status for all users
      const userNames = users.map(user => user.u_name);
      const slipStatusQuery = `
        SELECT u_name, s_status
        FROM tbl_slip
        WHERE u_name IN (?)
        AND DATE_FORMAT(day_slip, '%Y-%m') = ?
      `;

      db.query(slipStatusQuery, [userNames, currentMonthKey], (slipErr, slipResults) => {
        if (slipErr) {
          console.error('Error fetching slip status:', slipErr);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Create a map of u_name to s_status
        const slipStatusMap = slipResults.reduce((acc, row) => {
          acc[row.u_name] = row.s_status;
          return acc;
        }, {});

        const usersWithCurrentMonthData = users.map(user => {
          // Find current month's data
          const currentMonthData = user.monthly_hours.find(month => month.month === currentMonthKey);

          // Add current month's hours and salary to user object
          user.current_month_hours = currentMonthData ? currentMonthData.hours : 0;
          user.current_month_salary = currentMonthData ? currentMonthData.salary : 0;

          // Add s_status to user object
          user.s_status = slipStatusMap[user.u_name] || null;

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
      const { u_name, current_month_hours, current_month_salary } = req.body;
      const s_pic = req.file ? req.file.buffer : null;

      const sql = `INSERT INTO tbl_slip (u_name, s_pic, hr_month, money_month, s_status, day_slip) VALUES (?, ?, ?, ?, 1, NOW())`;
      
      db.query(sql, [u_name, s_pic, current_month_hours, current_month_salary], (err, result) => {
        if (err) {
          console.error('Error inserting slip data:', err);
          res.status(500).send('Error uploading slip');
        } else {
          res.redirect('/receipt?message=Upload successful');
        }
      });
    }
  ]
};

module.exports = receiptController;