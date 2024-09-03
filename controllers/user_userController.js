// user_userController.js
const UserModel = require('../models/user_userModel'); 

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
      const userData = await UserModel.getUserProfile(userId); 
      res.render('user_home', { userData: userData }); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = UserController;
