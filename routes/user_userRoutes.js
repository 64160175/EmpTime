// user_userRoutes.js

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user_userModel'); 
const { checkPermission } = require('../controllers/PermissionController'); 

router.get('/user_home', checkPermission([2]), async (req, res) => {
    try {
      const userId = req.session.user.id;
      const userData = await UserModel.getUserProfile(userId); 
      res.render('user_home', { userData: userData }); // Pass userData to the view
    } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router; 
