const db = require('../config/database');

const dashboardmonthModel = {
  getMonthlySchedule: (year, month, callback) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT 
        s.id,
        s.u_name,
        u.f_name,
        u.l_name,
        s.s_date,
        s.s_time_in,
        s.s_time_out,
        s.date_his
      FROM 
        tbl_schedule s
      LEFT JOIN
        tbl_user u ON s.u_name = u.u_name
      WHERE 
        s.s_date BETWEEN ? AND ?
      ORDER BY 
        s.s_date ASC, s.s_time_in ASC
    `;

    db.query(query, [startDate, endDate], (error, results) => {
      if (error) {
        console.error('Error fetching monthly schedule:', error);
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
        COUNT(DISTINCT s.u_name) as totalEmployees,
        COUNT(DISTINCT s.s_date) as totalWorkDays,
        SUM(TIME_TO_SEC(TIMEDIFF(s.s_time_out, s.s_time_in)) / 3600) as totalHours
      FROM 
        tbl_schedule s
      WHERE 
        s.s_date BETWEEN ? AND ?
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
        s.u_name,
        u.f_name,
        u.l_name,
        COUNT(DISTINCT s.s_date) as workDays,
        SUM(TIME_TO_SEC(TIMEDIFF(s.s_time_out, s.s_time_in)) / 3600) as totalHours
      FROM 
        tbl_schedule s
      LEFT JOIN
        tbl_user u ON s.u_name = u.u_name
      WHERE 
        s.s_date BETWEEN ? AND ?
      GROUP BY 
        s.u_name
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