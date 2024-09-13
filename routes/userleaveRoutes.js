const express = require('express');
const router = express.Router();
const userLeaveController = require('../controllers/userleaveController');
const { checkPermission } = require('../controllers/permissionController');

// แสดงหน้า user_leave.ejs
router.get('/user_leave', checkPermission([2]), userLeaveController.showLeavePage);

// รับคำร้องขอลา
router.post('/user_leave', checkPermission([2]), userLeaveController.submitLeaveRequest);

module.exports = router;
