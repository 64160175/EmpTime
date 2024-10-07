const express = require('express');
const router = express.Router();
const UserLeaveController = require('../controllers/userLeaveController');
const { checkPermission } = require('../controllers/permissionController');

router.get('/user_leave', checkPermission([2]), UserLeaveController.showLeavePage);
router.post('/user_leave', checkPermission([2]), UserLeaveController.submitLeaveRequest);

module.exports = router;