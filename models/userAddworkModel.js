// userAddworkModel.js
const db = require('../config/database');

const UserAddworkModel = {
  addWorkSchedule: (scheduleData, callback) => {
    const { u_name, s_date, s_time_in, s_time_out } = scheduleData;

    const sql = `
      INSERT INTO tbl_schedule (u_name, s_date, s_time_in, s_time_out) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [u_name, s_date, s_time_in, s_time_out], (err, result) => {
      if (err) {
        console.error("Error adding work schedule:", err);
        callback(err, null);
      } else {
        callback(null, result.insertId);
      }
    });
  },
};

module.exports = UserAddworkModel;
