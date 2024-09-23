const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/userscheduleController');

router.get('/user_schedule', CalendarController.getCalendar);
router.get('/getEvents', CalendarController.getEvents);

module.exports = router;