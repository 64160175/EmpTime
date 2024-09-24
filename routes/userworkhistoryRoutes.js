const express = require('express');
const router = express.Router();
const userWorkhistoryController = require('../controllers/userWorkhistoryController');
const { checkPermission } = require('../controllers/permissionController');

router.get('/user_workhistory', checkPermission([2]), userWorkhistoryController.getWorkHistory);

module.exports = router;
