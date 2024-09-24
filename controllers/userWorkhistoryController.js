// userWorkhistoryController.js
const UserWorkhistoryModel = require('../models/userWorkhistoryModel');

const userWorkhistoryController = {
  getWorkHistory: async (req, res) => {
    try {
      const userId = req.session.user.id; 

      // ดึงข้อมูลประวัติการทำงาน
      const workHistoryData = await UserWorkhistoryModel.getWorkHistory(userId);

      // Assuming you have userData available in your controller
      const userData = { 
        u_name: req.session.user.u_name, // Get the u_name from the session
        // ... other user data you need in the view
      };

      // ส่งข้อมูลไปยัง view 
      res.render('user_workhistory', { workHistoryData: workHistoryData, userData: userData }); 
    } catch (error) {
      console.error('Error fetching or rendering work history:', error);
      res.redirect('/error_page'); 
    }
  },
};

module.exports = userWorkhistoryController;
