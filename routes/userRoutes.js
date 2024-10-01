
const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/permissionController'); 
const employeeController = require('../controllers/employeeController');
const dashboardController = require('../controllers/dashboardController');

// ------------------- Admin & Shop Owner Routes ------------------- //

// u_type_name_id =0 => Admin
// u_type_name_id =1 => Shop Owner
// u_type_name_id =2 => User


router.get('/dashboard_month', checkPermission([0, 1]), (req, res) => {
  res.render('dashboard_month');
});

router.get('/dashboard_day', dashboardController.getDashboardDay);




router.get('/employee_record_addemp', checkPermission([0, 1]), (req, res) => {
  res.render('employee_record_addemp');
});

router.get('/employee_record', checkPermission([0, 1]), (req, res) => {
  res.render('employee_record');
});

router.get('/recipt', checkPermission([0, 1]), (req, res) => {
  res.render('recipt');
});




module.exports = router;
