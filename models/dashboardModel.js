const db = require('../config/database'); 

const dashboardModel = {
  getTodayCheckInOut: (callback) => { // Add callback parameter
    try {
      const today = new Date().toISOString().slice(0, 10); 
      db.query(`
        SELECT 
          ci.u_name, 
          u.f_name, 
          u.l_name, 
          ci.in_status, 
          ci.in_time, 
          co.out_time 
        FROM 
          tbl_checkin ci
        LEFT JOIN 
          tbl_user u ON ci.u_name = u.u_name
        LEFT JOIN 
          tbl_checkout co ON ci.u_name = co.u_name AND DATE(co.out_date) = ?
        WHERE 
          DATE(ci.in_date) = ?
      `, [today, today], (error, results) => { // Callback to handle results
        if (error) {
          console.error('Error fetching check-in/out data:', error);
          callback(error, null); // Pass error to callback
        } else {
          callback(null, results); // Pass results to callback
        }
      });
    } catch (error) { 
      console.error('Error fetching check-in/out data:', error);
      callback(error, null); // Pass error to callback
    } 
  }
};

module.exports = dashboardModel;
