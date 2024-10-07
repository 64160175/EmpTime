const UserLeaveModel = require('../models/userLeaveModel');

const UserLeaveController = {
  showLeavePage: (req, res) => {
    const username = req.session.user.u_name; // Make sure this matches your session structure
    UserLeaveModel.getRemainingLeaveDays(username, (err, remainingDays) => {
      if (err) {
        console.error('Error fetching remaining leave days:', err);
        return res.status(500).send('Error fetching leave data');
      }
      res.render('user_leave', { remainingDays });
    });
  },

  submitLeaveRequest: (req, res) => {
    const { startDate, endDate, reason } = req.body;
    const username = req.session.user.u_name; // Make sure this matches your session structure

    if (!username) {
      console.error('Username is missing from the session');
      return res.status(400).send('User information is missing');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysUsed = (end - start) / (1000 * 60 * 60 * 24) + 1;

    const leaveData = {
      username,
      startDate,
      endDate,
      reason,
      daysUsed
    };

    UserLeaveModel.submitLeaveRequest(leaveData, (err, requestId) => {
      if (err) {
        console.error('Error submitting leave request:', err);
        return res.status(500).send('Error submitting leave request');
      }
      res.redirect('/user_menu');
    });
  }
};

module.exports = UserLeaveController;