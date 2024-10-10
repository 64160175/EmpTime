// user_userRoutes.js

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user_userModel'); 
const { checkPermission } = require('../controllers/permissionController'); 
const checkinController = require('../controllers/userCheckinController');
const checkoutController = require('../controllers/userCheckoutController');
const userLeaveController = require('../controllers/userleaveController');
const CalendarModel = require('../models/userscheduleModel');



router.get('/user_home', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const username = req.session.user.u_name;
    const userData = await UserModel.getUserProfile(userId);
    
    // ตรวจสอบตารางงานสำหรับวันนี้
    const today = new Date().toISOString().split('T')[0]; // รูปแบบ 'YYYY-MM-DD'
    const hasScheduleToday = await CalendarModel.checkUserSchedule(username, today);

    res.render('user_home', { 
      userData: userData,
      hasScheduleToday: hasScheduleToday
    });
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


// เพิ่ม route สำหรับ user_status
router.get('/user_status', checkPermission([2]), userLeaveController.getUserStatus);

// เพิ่ม route สำหรับ error page
router.get('/error_chackin_out_page', checkPermission([2]), (req, res) => {
  res.render('error_chackin_out_page'); 
});


module.exports = router; 
