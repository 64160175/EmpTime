const receiptModel = require('../models/receiptModel');

const receiptController = {
  getUsersForReceipt: (req, res) => {
    receiptModel.getUsersForReceipt((err, users) => {
      if (err) {
        console.error('Error fetching users for receipt:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentMonthKey = `${currentYear}-${currentMonth}`;

      const usersWithCurrentMonthData = users.map(user => {
        // Find current month's data
        const currentMonthData = user.monthly_hours.find(month => month.month === currentMonthKey);

        // Add current month's hours and salary to user object
        user.current_month_hours = currentMonthData ? currentMonthData.hours : 0;
        user.current_month_salary = currentMonthData ? currentMonthData.salary : 0;

        // Process profile picture
        if (user.u_profile) {
          if (Buffer.isBuffer(user.u_profile)) {
            // If it's a Buffer, convert to Base64
            user.profile_pic = `data:image/jpeg;base64,${user.u_profile.toString('base64')}`;
          } else if (typeof user.u_profile === 'string') {
            // If it's a string (path), use it directly
            user.profile_pic = user.u_profile;
          }
        } else {
          user.profile_pic = '/image/profile.jpg'; // Default image
        }

        return user;
      });

      res.render('receipt', { 
        users: usersWithCurrentMonthData,
        currentMonth: `${currentYear}-${currentMonth}`
      });
    });
  },

  // You can add more methods here for handling other receipt-related operations
  // For example:
  // generatePDF: (req, res) => { ... },
  // sendReceiptByEmail: (req, res) => { ... },
};

module.exports = receiptController;