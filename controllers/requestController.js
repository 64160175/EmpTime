const UserLeaveModel = require('../models/userLeaveModel');

const RequestController = {
  getRequests: (req, res) => {
    UserLeaveModel.getPendingLeaveRequests((err, requests) => {
      if (err) {
        console.error('Error fetching leave requests:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('request', { requests });
    });
  },

  updateRequestStatus: (req, res) => {
    const { id, status } = req.body;
    UserLeaveModel.updateLeaveRequestStatus(id, status, (err, result) => {
      if (err) {
        console.error('Error updating leave request status:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.json({ success: true });
    });
  }
};

module.exports = RequestController;