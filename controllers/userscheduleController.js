const CalendarModel = require('../models/userscheduleModel');

const userscheduleController = {
  showSchedulePage: (req, res) => {
    const username = req.session.user.u_name; // Get username from session
    res.render('user_schedule', { username: username }); // Pass username to the view
  },

  saveSchedule: async (req, res) => {
    try {
      const username = req.session.user.u_name; // Get username from session
      const { investmentDate, startHour, startMinute, endHour, endMinute } = req.body;

      const scheduleData = {
        u_name: username, // Use u_name instead of user_id
        s_date: investmentDate,
        s_time_in: `${startHour}:${startMinute}`,
        s_time_out: `${endHour}:${endMinute}`,
      };

/*      CalendarModel.addSchedule(scheduleData, (err, insertId) => {
        if (err) {
          console.error('Error adding schedule:', err);
          return res.redirect('/user_schedule?error=เกิดข้อผิดพลาด');
        }
        console.log('New schedule added with ID:', insertId);
        res.redirect('/user_schedule?success=บันทึกสำเร็จ');
      }); */
    } catch (error) {
      console.error('Error saving schedule:', error);
      res.redirect('/user_schedule?error=เกิดข้อผิดพลาด');
    }
  },
};

module.exports = userscheduleController;