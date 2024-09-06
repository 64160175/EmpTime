const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/userCheckinController'); 
const { checkPermission } = require('../controllers/permissionController');

router.post('/user_home_checkin', checkPermission([2]), checkinController.userHomeCheckin);

module.exports = router; 
