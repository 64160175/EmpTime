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
        (SELECT rate_hr FROM tbl_setting ORDER BY id DESC LIMIT 1) AS latest_rate_hr
      FROM tbl_user u
      LEFT JOIN tbl_default_pic d ON 1=1
      LEFT JOIN tbl_day_salary ds ON u.u_name = ds.u_name
      WHERE u.u_type_name_id = 2 AND u.u_status = 1
      ORDER BY u.u_name, ds.work_date
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error in database query:', error);
        return callback(error, null);
      }

      let latestRateHr = null;

      // Group results by user
      const groupedResults = results.reduce((acc, row) => {
        if (latestRateHr === null) {
          latestRateHr = parseFloat(row.latest_rate_hr);
        }

        if (!acc[row.u_name]) {
          acc[row.u_name] = {
            id: row.id,
            f_name: row.f_name,
            l_name: row.l_name,
            u_name: row.u_name,
            u_namebank: row.u_namebank,
            u_idbook: row.u_idbook,
            u_profile: row.u_profile,
            rate_hr: latestRateHr,
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
      });

      callback(null, Object.values(groupedResults));
    });
  },

  uploadSlip: (slipData, callback) => {
    // ตรวจสอบข้อมูลก่อนที่จะทำการ insert
    if (!slipData.u_name || !slipData.hr_month || !slipData.money_month || !slipData.selectedMonth || !slipData.selectedYear) {
      return callback(new Error('Missing required fields'), null);
    }
  
    // สร้างวันที่แรกของเดือนจากข้อมูลที่ได้รับ
    const day_slip = new Date(slipData.selectedYear, parseInt(slipData.selectedMonth) - 1, 1);
  
    const query = `
      INSERT INTO tbl_slip 
      (u_name, hr_month, money_month, s_pic, day_slip, s_status, stamp_day) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      slipData.u_name,
      slipData.hr_month,
      slipData.money_month,
      slipData.s_pic || null,  // ถ้าไม่มีรูปภาพให้เป็น null
      day_slip,
      slipData.s_status || 1,  // ใช้ค่าเริ่มต้นเป็น 1 ถ้าไม่มีการกำหนด
    ];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error uploading slip:", err);
        console.error("Query:", query);
        console.error("Values:", values.map(v => v === slipData.s_pic ? 'BLOB_DATA' : v));
        
        // ตรวจสอบข้อผิดพลาดเฉพาะ
        if (err.code === 'ER_DUP_ENTRY') {
          return callback(new Error('Duplicate entry. This slip may already exist.'), null);
        } else if (err.code === 'ER_DATA_TOO_LONG') {
          return callback(new Error('File size is too large.'), null);
        }
        
        callback(new Error(`Database error: ${err.message}`), null);
      } else {
        console.log("Slip uploaded successfully:", result);
        callback(null, result);
      }
    });
  },
  
  updateSlipStatus: (u_name, month, year, status, callback) => {
    const query = `
      UPDATE tbl_slip 
      SET s_status = ?
      WHERE u_name = ? AND YEAR(day_slip) = ? AND MONTH(day_slip) = ?
    `;
    const values = [status, u_name, year, month];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating slip status:", err);
        callback(new Error(`Database error: ${err.message}`), null);
      } else {
        console.log("Slip status updated successfully:", result);
        callback(null, result);
      }
    });
  },

  getSlipStatus: (u_name, month, year, callback) => {
    const query = `
      SELECT s_status
      FROM tbl_slip
      WHERE u_name = ? AND YEAR(day_slip) = ? AND MONTH(day_slip) = ?
      LIMIT 1
    `;
    const values = [u_name, year, month];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error fetching slip status:", err);
        callback(new Error(`Database error: ${err.message}`), null);
      } else {
        const status = result.length > 0 ? result[0].s_status : null;
        console.log("Slip status fetched successfully:", status);
        callback(null, status);
      }
    });
  }
};

module.exports = receiptModel;