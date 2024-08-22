
const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/PermissionController'); 


// Admin & Shop Owner Routes
router.get('/dashboard_month', checkPermission([0, 1]), (req, res) => {
  res.render('dashboard_month');
});

router.get('/dashboard_day', checkPermission([0, 1]), (req, res) => {
  res.render('dashboard_day');
});

router.get('/employee', checkPermission([0, 1]), (req, res) => {
  res.render('employee');
});

router.get('/employee_record_addemp', checkPermission([0, 1]), (req, res) => {
  res.render('employee_record_addemp');
});

router.get('/employee_record', checkPermission([0, 1]), (req, res) => {
  res.render('employee_record');
});

router.get('/recipt', checkPermission([0, 1]), (req, res) => {
  res.render('recipt');
});

router.get('/store_setting', checkPermission([0, 1]), (req, res) => {
  res.render('store_setting');
});

router.get('/gen_code', checkPermission([0, 1]), (req, res) => {
  res.render('gen_code');
});

// User Route
router.get('/user_home', checkPermission([2]), (req, res) => {
  res.render('user_home');
});

module.exports = router;
