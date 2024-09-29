const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getDashboardDay: (req, res) => {
    try {
      dashboardModel.getTodayCheckInOut((error, checkInOutData) => { 
        if (error) {
          console.error('Error fetching check-in/out data:', error);
          res.status(500).send('Internal Server Error'); // Send error response to client
        } else {
          res.render('dashboard_day', { checkInOutData });
        }
      });
    } catch (error) {
      console.error('Error rendering dashboard_day:', error);
      res.status(500).send('Internal Server Error'); // Send error response to client
    }
  }
};

module.exports = dashboardController;
