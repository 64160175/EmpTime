const db = require('../config/database');

const receiptModel = {
  getUsersForReceipt: (callback) => {
    const query = `
      SELECT DISTINCT
        u.id, 
        u.f_name, 
        u.l_name, 
        u.u_name,
        u.u_namebank, 
        u.u_idbook,
        COALESCE(u.u_profile, d.u_profile) AS u_profile,
        ds.work_date,
        ds.in_time,
        ds.out_time,
        ds.day_hr,
        s.rate_hr
      FROM tbl_user u
      LEFT JOIN tbl_default_pic d ON 1=1
      LEFT JOIN tbl_day_salary ds ON u.u_name = ds.u_name
      CROSS JOIN tbl_setting s
      WHERE u.u_type_name_id = 2 AND u.u_status = 1
      ORDER BY u.u_name, ds.work_date
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error in database query:', error);
        return callback(error, null);
      }

      // Group results by user
      const groupedResults = results.reduce((acc, row) => {
        if (!acc[row.u_name]) {
          acc[row.u_name] = {
            id: row.id,
            f_name: row.f_name,
            l_name: row.l_name,
            u_name: row.u_name,
            u_namebank: row.u_namebank,
            u_idbook: row.u_idbook,
            u_profile: row.u_profile,
            rate_hr: parseFloat(row.rate_hr),
            salary_data: [],
            monthly_hours: {}
          };
        }
        if (row.work_date) {
          const date = new Date(row.work_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          // Check if this date is already in salary_data
          const existingEntry = acc[row.u_name].salary_data.find(
            entry => entry.work_date === row.work_date.toISOString()
          );

          if (!existingEntry) {
            acc[row.u_name].salary_data.push({
              work_date: row.work_date.toISOString(),
              in_time: row.in_time,
              out_time: row.out_time,
              day_hr: parseFloat(row.day_hr) || 0
            });

            // Add hours to monthly total
            if (!acc[row.u_name].monthly_hours[monthKey]) {
              acc[row.u_name].monthly_hours[monthKey] = 0;
            }
            acc[row.u_name].monthly_hours[monthKey] += parseFloat(row.day_hr) || 0;
          }
        }
        return acc;
      }, {});

      // Convert monthly_hours to array, round to 2 decimal places, and calculate salary
      Object.values(groupedResults).forEach(user => {
        user.monthly_hours = Object.entries(user.monthly_hours).map(([month, hours]) => ({
          month,
          hours: Math.round(hours * 100) / 100,
          salary: Math.round(hours * user.rate_hr * 100) / 100
        }));

        // Calculate total hours and total salary
        user.total_hours = user.salary_data.reduce((sum, day) => sum + day.day_hr, 0);
        user.total_hours = Math.round(user.total_hours * 100) / 100;
        user.total_salary = Math.round(user.total_hours * user.rate_hr * 100) / 100;

        // console.log(`User ${user.f_name} total hours: ${user.total_hours}, total salary: ${user.total_salary}`);
        // console.log(`User ${user.f_name} salary data:`, JSON.stringify(user.salary_data, null, 2));
      });

      callback(null, Object.values(groupedResults));
    });
  },
};

module.exports = receiptModel;