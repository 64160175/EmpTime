const db = require('../config/database');

const getDashboardMonth = async (req, res) => {
  try {
    const today = new Date();
    const year = req.query.year ? parseInt(req.query.year) : today.getFullYear();
    const month = req.query.month ? parseInt(req.query.month) : today.getMonth() + 1;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Query to get all schedules for the month
    const query = `
      SELECT s.s_date, s.s_time_in, s.s_time_out, u.f_name
      FROM tbl_schedule s
      JOIN tbl_user u ON s.u_name = u.u_name
      WHERE YEAR(s.s_date) = ? AND MONTH(s.s_date) = ?
    `;
    
    db.query(query, [year, month], (error, schedules) => {
      if (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).send('Internal Server Error');
      }

      // Create calendar array
      let calendar = [];
      let currentWeek = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        currentWeek.push({ date: null, schedules: [] });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        let date = new Date(year, month - 1, day);
        let daySchedules = schedules.filter(s => new Date(s.s_date).getDate() === day);
        
        currentWeek.push({
          date: day,
          schedules: daySchedules
        });

        if (currentWeek.length === 7) {
          calendar.push(currentWeek);
          currentWeek = [];
        }
      }

      // Add empty cells for remaining days in the last week
      while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push({ date: null, schedules: [] });
      }

      if (currentWeek.length > 0) {
        calendar.push(currentWeek);
      }

      const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];

      // Calculate previous and next month/year
      let prevMonth = month - 1;
      let prevYear = year;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear--;
      }

      let nextMonth = month + 1;
      let nextYear = year;
      if (nextMonth === 13) {
        nextMonth = 1;
        nextYear++;
      }

      res.render('dashboard_month', {
        calendar,
        year,
        month,
        monthName: monthNames[month - 1],
        prevMonth,
        prevYear,
        nextMonth,
        nextYear
      });
    });
  } catch (error) {
    console.error('Error in getDashboardMonth:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getDashboardMonth
};