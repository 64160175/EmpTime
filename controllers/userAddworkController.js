// userAddworkController.js
const UserWorkModel = require('../models/userAddworkModel'); // Adjust path if needed

const userAddworkController = {
  showAddWorkForm: (req, res) => {
    res.render('user_addwork'); // Assuming you have a view file named 'user_addwork.ejs'
  },

  submitWorkData: (req, res) => {
    const username = req.session.user.u_name;
    const { workDate, startTime, endTime } = req.body;

    // Basic input validation (You should add more robust validation)
    if (!workDate || !startTime || !endTime) {
      return res.status(400).send('Please fill in all required fields.');
    }

    UserWorkModel.addWorkSchedule(username, workDate, startTime, endTime, (err, result) => {
      if (err) {
        console.error('Error adding work schedule:', err);
        return res.status(500).send('Error saving work schedule.');
      }

      console.log('Work schedule added successfully:', result);
      res.redirect('/user_work'); // Redirect to the work schedule page or another appropriate page
    });
  },
};

module.exports = userAddworkController;
