const express = require('express');
const router = express.Router();
const userAddWorkController = require('../controllers/userAddworkController'); 
const { checkPermission } = require('../controllers/permissionController');

router.get('/user_addwork', checkPermission([2]), userAddWorkController.showAddWorkForm); 
router.post('/user_addwork', checkPermission([2]), userAddWorkController.submitWorkData); 

module.exports = router;
