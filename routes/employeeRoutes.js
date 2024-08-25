const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/PermissionController'); 
const employeeController = require('../controllers/employeeController');


router.get('/employee', checkPermission([0, 1]), employeeController.showEmployeePage);
router.get('/employee/profile-picture/:id', checkPermission([0, 1]), employeeController.getEmployeeProfilePicture);

router.get('/employee_record/:id', employeeController.showEmployeeRecord);
router.delete('/employee/delete/:id', employeeController.deleteEmployee);

router.post('/employee/add', checkPermission([0, 1]), employeeController.addEmployee); 

module.exports = router;
