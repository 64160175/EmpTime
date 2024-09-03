const db = require('../config/database');

const Setting = {
  getLatest: (result) => {
    db.query(
      `SELECT s.*, DATE_FORMAT(s.log_history_time, '%d/%m/%Y %H:%i') as formatted_log_history_time 
       FROM tbl_setting s 
       ORDER BY s.id DESC 
       LIMIT 1`,
      (err, settingResult) => {
        if (err) {
          console.log("error: ", err);
          result(err, null, null);
          return;
        }

        if (settingResult.length === 0) {
          result({ kind: "not_found" }, null, null);
          return;
        }

        db.query(
          "SELECT id, day_close, close_res FROM tbl_week",
          (err, weekResult) => {
            if (err) {
              console.log("error: ", err);
              result(err, null, null);
              return;
            }

            result(null, settingResult[0], weekResult);
          }
        );
      }
    );
  },

  updateSettings: (newSettings, openDays, result) => {
    // Get the next available ID for tbl_setting
    db.query('SELECT MAX(id) AS maxId FROM tbl_setting', (err, res) => {
      if (err) {
        console.error('Error getting max ID from tbl_setting:', err);
        result(err, null);
        return;
      }
  
      const newSettingId = res[0].maxId + 1; // Calculate the new ID
  
      // Insert into tbl_setting with the new ID
      const insertSettingQuery = `
        INSERT INTO tbl_setting (id, n_res, rate_hr, leave_part, late_part, absent_part, open_time, close_time, log_history_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
  
      db.query(insertSettingQuery, 
        [newSettingId, newSettings.storeName, newSettings.hourlyWage, newSettings.leaveDays, 
         newSettings.lateDays, newSettings.absentDays, newSettings.openTime, 
         newSettings.closeTime], 
        (err, settingResult) => {
          if (err) {
            console.error('Error inserting into tbl_setting:', err);
            result(err, null);
            return;
          }
  
          // Update tbl_week (same as before)
          const updateWeekQuery = `
            UPDATE tbl_week 
            SET close_res = ? 
            WHERE id = ?
          `;
  
          const updatePromises = openDays.map((day, index) => {
            const isOpen = day ? 1 : 0; 
            return new Promise((resolve, reject) => {
              db.query(updateWeekQuery, [isOpen, index + 1], (err, weekResult) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(weekResult);
                }
              });
            });
          });
  
          Promise.all(updatePromises)
            .then(() => {
              console.log('Settings and week data updated successfully');
              result(null, { settingResult, newSettingId }); 
            })
            .catch(err => {
              console.error('Error updating tbl_week:', err);
              result(err, null);
            });
        }
      );
    });
  },
  
};

module.exports = Setting;
