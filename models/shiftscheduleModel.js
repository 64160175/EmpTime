const db = require('../config/database');

const shiftscheduleModel = {
  getAllShiftSchedules: (callback) => {
    const sql = `
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
      ORDER BY 
        s.s_date DESC, s.s_time_in ASC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching all shift schedules:", err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  getShiftScheduleById: (id, callback) => {
    const sql = `
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
        s.id = ?
    `;
    
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error fetching shift schedule by id:", err);
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  },

  addShiftSchedule: (scheduleData, callback) => {
    const { u_name, s_date, s_time_in, s_time_out } = scheduleData;
    
    const sql = 'INSERT INTO tbl_schedule (u_name, s_date, s_time_in, s_time_out, date_his) VALUES (?, ?, ?, ?, NOW())';
    const values = [u_name, s_date, s_time_in, s_time_out];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error adding shift schedule:", err);
        callback(err, null);
      } else {
        callback(null, result.insertId);
      }
    });
  },

  updateShiftSchedule: (id, scheduleData, callback) => {
    const { u_name, s_date, s_time_in, s_time_out } = scheduleData;
    
    const sql = 'UPDATE tbl_schedule SET u_name = ?, s_date = ?, s_time_in = ?, s_time_out = ? WHERE id = ?';
    const values = [u_name, s_date, s_time_in, s_time_out, id];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating shift schedule:", err);
        callback(err, null);
      } else {
        callback(null, result.affectedRows);
      }
    });
  },

  deleteShiftSchedule: (id, callback) => {
    const sql = 'DELETE FROM tbl_schedule WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting shift schedule:", err);
        callback(err, null);
      } else {
        callback(null, result.affectedRows);
      }
    });
  }
};

module.exports = shiftscheduleModel;