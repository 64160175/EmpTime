const express = require('express');
const router = express.Router();
const settingController = require('../controllers/storeSettingController'); 


// Route for displaying the store settings page
router.get('/store_setting', settingController.getSettings);

// Route for handling the saving of store settings
router.post('/save_shop_settings', settingController.saveShopSettings);

module.exports = router;
