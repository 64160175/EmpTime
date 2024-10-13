const express = require('express');
const router = express.Router();
const { checkPermission } = require('../controllers/permissionController');
const userscheduleController = require('../controllers/userscheduleController'); 


const { saveSchedule } = require('../controllers/userscheduleController'); 

router.get('/user_schedule', checkPermission([2]), userscheduleController.showSchedulePage);
router.post('/save-schedule', checkPermission([2]), saveSchedule);

module.exports = router;
