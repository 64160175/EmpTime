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
        console.error('Error updating request status:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the request status' });
      }
      res.json({ success: true, message: 'Request status updated successfully' });
    });
  }
};

module.exports = RequestController;