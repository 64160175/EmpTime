const express = require('express');
const router = express.Router();
const UserModel = require('../models/user_userModel');
const { checkPermission } = require('../controllers/permissionController');
const checkinController = require('../controllers/userCheckinController');
const checkoutController = require('../controllers/userCheckoutController');
const userLeaveController = require('../controllers/userleaveController');
const CalendarModel = require('../models/userscheduleModel');

// หน้า user_home.ejs
router.get('/user_home', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const username = req.session.user.u_name;
    const userData = await UserModel.getUserProfile(userId);

    // ปรับการคำนวณวันที่ให้ตรงกับเขตเวลาของประเทศไทย
    const today = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const hasScheduleToday = await CalendarModel.checkUserSchedule(username, today);

    console.log('Today\'s date:', today);
    console.log('Has schedule today:', hasScheduleToday);

    res.render('user_home', {
      userData: userData,
      hasScheduleToday: hasScheduleToday
    });
  } catch (err) {
    console.error('Error in /user_home route:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/get-checkin-time', checkPermission([2]), checkinController.getCheckinTime);
router.get('/get-checkout-time', checkPermission([2]), checkoutController.getCheckoutTime);


router.get('/user_home_checkin', checkPermission([2]), (req, res) => {
  res.render('user_home_checkin');
});

router.get('/user_home_checkout', checkPermission([2]), (req, res) => {
  res.render('user_home_checkout');
});


// หน้า user_menu.ejs
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


// หน้า user_status.ejs
router.get('/user_status', checkPermission([2]), userLeaveController.getUserStatus);

// error page
router.get('/error_chackin_out_page', checkPermission([2]), (req, res) => {
  res.render('error_chackin_out_page');
});

module.exports = router;