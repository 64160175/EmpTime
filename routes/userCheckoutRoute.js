const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/permissionController');
const userCheckoutController = require('../controllers/userCheckoutController');

router.post('/user_home_checkout', checkPermission([2]), userCheckoutController.userHomeCheckout);

module.exports = router;