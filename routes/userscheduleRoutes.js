const express = require('express');
const router = express.Router();
const userscheduleController = require('../controllers/userscheduleController'); // กำหนด path ไปยังไฟล์ userscheduleController.js

router.get('/user_schedule', userscheduleController.getUserSchedule);
// เพิ่ม route อื่นๆ เช่น /user_schedule/create, /user_schedule/update/:id, /user_schedule/delete/:id ตามต้องการ

module.exports = router;
