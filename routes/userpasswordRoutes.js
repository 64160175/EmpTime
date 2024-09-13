const express = require('express');
const router = express.Router();
const userPasswordController = require('../controllers/userpasswordController');
const { checkPermission } = require('../controllers/permissionController');

router.get('/user_password', checkPermission([2]), userPasswordController.showChangePasswordPage);
router.post('/user_password', checkPermission([2]), userPasswordController.updatePassword);

module.exports = router;
