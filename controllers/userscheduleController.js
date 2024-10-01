const CalendarModel = require('../models/userscheduleModel');

const userscheduleController = {
  showSchedulePage: (req, res) => {
    const username = req.session.user.u_name; 

    // Fetch existing schedules for the user
    CalendarModel.getAllSchedules(username, (err, schedules) => {
      if (err) {
        console.error('Error fetching schedules:', err);
        return res.redirect('/error_page'); // Redirect to a general error page
      }

      res.render('user_schedule', { 
        username: username, 
        schedules: schedules,
        error: req.query.error, // Pass any error messages from redirect
        success: req.query.success // Pass any success messages from redirect
      });
    });
  },

  saveSchedule: async (req, res) => {
    try {
      const username = req.session.user.u_name;
      const { investmentDate, startHour, startMinute, endHour, endMinute } = req.body;

      // Basic input validation (You should expand this)
      if (!investmentDate || !startHour || !startMinute || !endHour || !endMinute) {
        return res.redirect('/user_schedule?error=กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      const scheduleData = {
        u_name: username, 
        s_date: investmentDate,
        s_time_in: `${startHour}:${startMinute}`,
        s_time_out: `${endHour}:${endMinute}`,
      };

      CalendarModel.addSchedule(scheduleData, (err, insertId) => {
        if (err) {
          console.error('Error adding schedule:', err);
          return res.redirect('/user_schedule?error=เกิดข้อผิดพลาดในการบันทึก');
        }
        console.log('New schedule added with ID:', insertId);
        res.redirect('/user_work');
      });

    } catch (error) {
      console.error('Error saving schedule:', error);
      res.redirect('/user_schedule?error=เกิดข้อผิดพลาดในการบันทึก');
    }
  },
};

module.exports = userscheduleController;
