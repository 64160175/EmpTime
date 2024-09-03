// user_userRoutes.js

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user_userModel'); 
const { checkPermission } = require('../controllers/permissionController'); 

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


// เพิ่ม route  user_home_checkin 
router.get('/user_home_checkin', checkPermission([2]), (req, res) => {
    res.render('user_home_checkin'); 
  });

// เพิ่ม route  user_home_checkout
router.get('/user_home_checkout', checkPermission([2]), (req, res) => {
    res.render('user_home_checkout'); 
  });

module.exports = router; 
