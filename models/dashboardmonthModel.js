const db = require('../config/database');
const dashboardmonthModel = {
  getMonthlyCheckinCheckout: (year, month, callback) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT 
        ci.id as checkin_id,
        ci.u_name,
        u.f_name,
        u.l_name,
        ci.in_date,
        ci.in_time,
        ci.in_status,
        co.out_date,
        co.out_time,
        co.out_status
      FROM 
        tbl_checkin ci
      LEFT JOIN
        tbl_checkout co ON ci.u_name = co.u_name AND DATE(ci.in_date) = DATE(co.out_date)
      LEFT JOIN
        tbl_user u ON ci.u_name = u.u_name
      WHERE 
        ci.in_date BETWEEN ? AND ?
      ORDER BY 
        ci.in_date ASC, ci.in_time ASC
    `;

    db.query(query, [startDate, endDate], (error, results) => {
      if (error) {
        console.error('Error fetching monthly check-in/check-out data:', error);
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  getMonthlyStats: (year, month, callback) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT 
        COUNT(DISTINCT ci.u_name) as totalEmployees,
        COUNT(DISTINCT ci.in_date) as totalWorkDays,
        SUM(TIME_TO_SEC(TIMEDIFF(co.out_time, ci.in_time)) / 3600) as totalHours
      FROM 
        tbl_checkin ci
      LEFT JOIN
        tbl_checkout co ON ci.u_name = co.u_name AND DATE(ci.in_date) = DATE(co.out_date)
      WHERE 
        ci.in_date BETWEEN ? AND ?
    `;

    db.query(query, [startDate, endDate], (error, results) => {
      if (error) {
        console.error('Error fetching monthly stats:', error);
        callback(error, null);
      } else {
        callback(null, results[0]);
      }
    });
  },

  getTopEmployees: (year, month, limit, callback) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT 
        ci.u_name,
        u.f_name,
        u.l_name,
        COUNT(DISTINCT ci.in_date) as workDays,
        SUM(TIME_TO_SEC(TIMEDIFF(co.out_time, ci.in_time)) / 3600) as totalHours
      FROM 
        tbl_checkin ci
      LEFT JOIN
        tbl_checkout co ON ci.u_name = co.u_name AND DATE(ci.in_date) = DATE(co.out_date)
      LEFT JOIN
        tbl_user u ON ci.u_name = u.u_name
      WHERE 
        ci.in_date BETWEEN ? AND ?
      GROUP BY 
        ci.u_name
      ORDER BY 
        totalHours DESC
      LIMIT ?
    `;

    db.query(query, [startDate, endDate, limit], (error, results) => {
      if (error) {
        console.error('Error fetching top employees:', error);
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  }
};

module.exports = dashboardmonthModel;