

const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getDashboardDay: async (req, res) => {
    try {
      // Fetch check-in/out data and check-in count concurrently
      const [checkInOutData, checkCount] = await Promise.all([
        new Promise((resolve, reject) => {
          dashboardModel.getTodayCheckInOut((error, data) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          });
        }),
        dashboardModel.getTodaysBookSchedule()
      ]);

      res.render('dashboard_day', { 
        checkInOutData: checkInOutData,
        check_Count: checkCount  
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error'); 
    }
  }
};

module.exports = dashboardController;


