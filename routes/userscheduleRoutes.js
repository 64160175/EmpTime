const express = require('express');
const router = express.Router();
const userscheduleController = require('../controllers/userscheduleController'); // กำหนด path ไปยังไฟล์ userscheduleController.js

// Assuming:
// 0: Admin
// 1: Owner
// 2: Employee 
router.put('/user_schedule/:id', checkPermission([2]), userscheduleController.updateUserSchedule); 
router.get('/user_schedule', checkPermission([0, 1]), userscheduleController.getUserSchedule);


module.exports = router;
