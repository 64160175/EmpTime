const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/PermissionController'); 
const employeeController = require('../controllers/employeeController');

router.get('/employee', checkPermission([0, 1]), employeeController.showEmployeePage);

module.exports = router;
