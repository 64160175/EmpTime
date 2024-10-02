const db = require("../config/database");

const dashboardModel = {
  getTodayCheckInOut: (callback) => {
    try {
      const today = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      console.log(today);
      db.query(
        `
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
          tbl_checkout co ON ci.u_name = co.u_name AND DATE(ci.in_date) = DATE(co.out_date)
        WHERE 
          DATE(ci.in_date) = ?
      `,
        [today],
        (error, results) => {
          if (error) {
            console.error("Error fetching check-in/out data:", error);
            callback(error, null);
          } else {
            callback(null, results);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching check-in/out data:", error);
      callback(error, null);
    }
  },

  getTodaysBookSchedule: () => {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().slice(0, 10);
      db.query(
        "SELECT COUNT(DISTINCT id) AS checkCount FROM tbl_schedule WHERE DATE(s_date) = ?",
        [today],
        (error, results) => {
          if (error) {
            console.error("Error fetching today's book schedule:", error);
            reject(error);
          } else {
            const checkCount = results[0].checkCount || 0;
            console.log("checkCount:", checkCount);
            resolve(checkCount);
          }
        }
      );
    });
  },

  
  
};

module.exports = dashboardModel;
