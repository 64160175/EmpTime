// user_userController.js
const UserModel = require('../models/user_userModel'); 
const ScheduleModel = require('../models/userscheduleModel');

const UserController = {
  getUserProfile: async (userId) => { 
    try {
      const userData = await UserModel.getUserProfile(userId);
      return userData; 
    } catch (err) {
      console.error(err);
      throw err; 
    }
  },

  getUserHome: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const username = req.session.user.u_name;
      const userData = await UserModel.getUserProfile(userId);
      
      // ตรวจสอบตารางงานสำหรับวันนี้
      const today = new Date().toISOString().split('T')[0]; // รูปแบบ 'YYYY-MM-DD'
      const hasScheduleToday = await ScheduleModel.checkUserSchedule(username, today);

      res.render('user_home', { 
        userData: userData,
        hasScheduleToday: hasScheduleToday
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = UserController;
