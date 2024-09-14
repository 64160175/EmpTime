const express = require('express');
const router = express.Router();
const userCheckoutController = require('../controllers/userCheckoutController'); 
const { checkPermission } = require('../controllers/permissionController');

router.post('/user_home_checkout', checkPermission([2]), userCheckoutController.userHomeCheckout);

module.exports = router;
