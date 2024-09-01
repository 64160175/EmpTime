const db = require('../config/database');

const Setting = {
  getLatest: (result) => {
    db.query(
      `SELECT s.*, DATE_FORMAT(s.log_history_time, '%d/%m/%Y %H:%i') as formatted_log_history_time 
      FROM tbl_setting s 
      ORDER BY s.id DESC 
      LIMIT 1`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log("setting: ", res[0]);
          result(null, res[0]);
          return;
        }

        // not found setting
        result({ kind: "not_found" }, null);
      }
    );
  },

  getClosedDays: (result) => {
    db.query(
      "SELECT day_close FROM tbl_week WHERE close_res = 0",
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log("closed days: ", res);
          const closedDayNames = res.map(day => day.day_close); // Extract day names
          result(null, closedDayNames); 
          return;
        }

        // no closed days found
        result({ kind: "not_found" }, null);
      }
    );
  },




  
};

module.exports = Setting;
