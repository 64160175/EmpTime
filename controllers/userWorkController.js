// userWorkController.js
const UserWorkModel = require('../models/userWorkModel');

const userWorkController = {
  getUserWorkHistory: (req, res) => {
    const username = req.session.user.u_name; 

    UserWorkModel.getWorkScheduleByUname(username, (err, schedule) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching work schedule');
      } else {
        res.render('user_work', { workSchedule: schedule, username: username }); 
      }
    });
  },
};

module.exports = userWorkController;
