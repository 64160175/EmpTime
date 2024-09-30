const express = require('express');
const router = express.Router();
const userWorkController = require('../controllers/userWorkController'); // Adjust the path if needed
const { checkPermission } = require('../controllers/permissionController');

router.get('/user_work', checkPermission([2]), userWorkController.getUserWorkHistory);

module.exports = router;
