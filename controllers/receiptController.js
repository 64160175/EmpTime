const receiptModel = require('../models/receiptModel');

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

      const usersWithCurrentMonthData = users.map(user => {
        // Find current month's data
        const currentMonthData = user.monthly_hours.find(month => month.month === currentMonthKey);

        // Add current month's hours and salary to user object
        user.current_month_hours = currentMonthData ? currentMonthData.hours : 0;
        user.current_month_salary = currentMonthData ? currentMonthData.salary : 0;

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
  },
};

module.exports = receiptController;