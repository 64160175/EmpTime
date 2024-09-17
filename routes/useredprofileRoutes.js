const express = require('express');
const router = express.Router();
const useredprofileController = require('../controllers/useredprofileController');
const { checkPermission } = require('../controllers/permissionController');

// ใช้ useredprofileController.getEditProfile สำหรับ GET request
router.get('/user_editprofile', checkPermission([2]), useredprofileController.getEditProfile);

// ใช้ useredprofileController.postEditProfile สำหรับ POST request
router.post('/user_editprofile', checkPermission([2]), useredprofileController.postEditProfile);

module.exports = router;
