const express = require('express');
const router = express.Router();
const userscheduleController = require('../controllers/userscheduleController'); // กำหนด path ไปยังไฟล์ userscheduleController.js

router.get('/user_schedule', userscheduleController.getUserSchedule);

// เพิ่มฟังก์ชันอื่นๆ เช่น createUserSchedule, updateUserSchedule, deleteUserSchedule ตามต้องการ

module.exports = router;
