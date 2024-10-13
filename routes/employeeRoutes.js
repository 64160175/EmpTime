const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/permissionController');
const employeeController = require('../controllers/employeeController');

router.get('/employee', checkPermission([0, 1]), employeeController.showEmployeePage);
router.get('/employee/profile-picture/:id', checkPermission([0, 1]), employeeController.getEmployeeProfilePicture);

router.get('/employee_record/:id', checkPermission([0, 1]), employeeController.showEmployeeRecord);
router.delete('/employee/delete/:id', checkPermission([0, 1]), employeeController.deleteEmployee);

router.post('/employee/add', checkPermission([0, 1]), employeeController.addEmployee);

module.exports = router;