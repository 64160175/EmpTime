const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getDashboardDay: function(req, res) {
    dashboardModel.getTodayCheckInOut((err, checkInOutData) => {
      if (err) {
        console.error('Error fetching check-in/out data:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      dashboardModel.getOnTimeAndLateCount((err, countData) => {
        if (err) {
          console.error('Error fetching on-time and late counts:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const check_Count = checkInOutData.length;
        const onTimeCount = countData.on_time_count;
        const lateCount = countData.late_count;

        res.render('dashboard_day', {
          checkInOutData: checkInOutData,
          check_Count: check_Count,
          onTimeCount: onTimeCount,
          lateCount: lateCount
        });
      });
    });
  }
};

module.exports = dashboardController;