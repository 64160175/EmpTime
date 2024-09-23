const CalendarModel = require('../models/userscheuleModel');

const CalendarController = {
  getCalendar: (req, res) => {
    res.render('user_schedule'); // Render the calendar view
  },

  getEvents: (req, res) => {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    CalendarModel.getEventsForMonth(year, month, (err, events) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch events' });
      }
      res.json(events);
    });
  }
};

module.exports = CalendarController;