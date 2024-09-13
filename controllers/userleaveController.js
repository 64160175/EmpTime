const UserLeaveModel = require('../models/userLeaveModel.js');

const userLeaveController = {
  // แสดงหน้า user_leave.ejs
  showLeavePage: (req, res) => {
    const userId = req.session.user.id;

    // ดึงข้อมูลประเภทการลา
    UserLeaveModel.getLeaveTypes((err, leaveTypes) => {
      if (err) {
        console.error('Error fetching leave types:', err);
        return res.status(500).send('Error fetching leave types');
      }

      // ดึงประวัติการลาของพนักงาน
      UserLeaveModel.getLeaveHistory(userId, (err, leaveHistory) => {
        if (err) {
          console.error('Error fetching leave history:', err);
          return res.status(500).send('Error fetching leave history');
        }

        res.render('user_leave', { leaveTypes, leaveHistory });
      });
    });
  },

  //  จัดการคำร้องขอลา
  submitLeaveRequest: (req, res) => {
    const userId = req.session.user.id;
    const leaveData = req.body;

    UserLeaveModel.submitLeaveRequest(userId, leaveData, (err, requestId) => {
      if (err) {
        console.error('Error submitting leave request:', err);
        return res.status(500).send('Error submitting leave request');
      }

      console.log('Leave request submitted successfully. Request ID:', requestId);
      res.redirect('/user_leave'); // Redirect back to the leave page
    });
  },
};

module.exports = userLeaveController;
