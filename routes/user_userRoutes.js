// user_userRoutes.js

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user_userModel'); 
const { checkPermission } = require('../controllers/permissionController'); 
const checkinController = require('../controllers/userCheckinController');
const checkoutController = require('../controllers/userCheckoutController');



router.get('/user_home', checkPermission([2]), async (req, res) => {
    try {
      const userId = req.session.user.id;
      const userData = await UserModel.getUserProfile(userId); 
      res.render('user_home', { userData: userData }); // Only userData is passed here
    } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/user_menu', checkPermission([2]), async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userData = await UserModel.getUserProfile(userId);
    res.render('user_menu', { userData: userData }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/get-checkin-time', checkPermission([2]), checkinController.getCheckinTime);
router.get('/get-checkout-time', checkPermission([2]), checkoutController.getCheckoutTime);

// เพิ่ม route  user_home_checkin 
router.get('/user_home_checkin', checkPermission([2]), (req, res) => {
    res.render('user_home_checkin'); 
  });

// เพิ่ม route  user_home_checkout
router.get('/user_home_checkout', checkPermission([2]), (req, res) => {
    res.render('user_home_checkout'); 
  });

// เพิ่ม route สำหรับ error page
router.get('/error_chackin_out_page', checkPermission([2]), (req, res) => {
  res.render('error_chackin_out_page'); 
});


module.exports = router; 
