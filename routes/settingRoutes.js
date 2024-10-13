const express = require('express');
const router = express.Router();
const settingController = require('../controllers/storeSettingController'); 
const { checkPermission } = require('../controllers/permissionController');

// Route for displaying the store settings page
router.get('/store_setting',checkPermission([0, 1]), settingController.getSettings);
router.post('/store_setting',checkPermission([0, 1]), settingController.saveShopSettings);

// Route for handling the saving of store settings
router.post('/save_shop_settings',checkPermission([0, 1]), settingController.saveShopSettings);

module.exports = router;
