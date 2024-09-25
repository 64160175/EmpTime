const db = require('../config/database');

const CalendarModel = {

  getAllSchedules: (username, callback) => { 
    const sql = 'SELECT * FROM tbl_schedule WHERE u_name = ?'; 
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Error fetching schedules:", err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  addSchedule: (scheduleData, callback) => {
    const { u_name, s_date, s_time_in, s_time_out } = scheduleData; 

    // Get the next available ID from the database
    db.query('SELECT MAX(id) AS maxId FROM tbl_schedule', (err, result) => {
      if (err) {
        return callback(err, null);
      }
      const newId = result[0].maxId + 1;

      const sql = 'INSERT INTO tbl_schedule (id, u_name, s_date, s_time_in, s_time_out) VALUES (?, ?, ?, ?, ?)'; 
      const values = [newId, u_name, s_date, s_time_in, s_time_out];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error adding schedule:", err);
          callback(err, null);
        } else {
          callback(null, result.insertId);
        }
      });
    });
  },

};

module.exports = CalendarModel;
