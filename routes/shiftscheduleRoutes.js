const express = require('express');
const router = express.Router();
const shiftScheduleController = require('../controllers/shiftscheduleController');

// ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้ว
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// เพิ่ม route สำหรับหน้าตารางลงงานพนักงาน
router.get('/shift_schedule', isLoggedIn, shiftScheduleController.getShiftSchedule);

module.exports = router;