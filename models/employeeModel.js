const db = require('../config/database');
const bcrypt = require('bcrypt');


const Employee = {
  getAllEmployees: (callback) => {
    const query = 'SELECT * FROM tbl_user WHERE u_type_name_id = 2 AND u_status = 1'; 
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },


  getEmployeeProfilePicture: (employeeId, callback) => {
    const query = 'SELECT u_profile FROM tbl_user WHERE id = ?';
    db.query(query, [employeeId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length > 0 && results[0].u_profile) {
        // พบรูปโปรไฟล์ใน tbl_user
        return callback(null, results[0].u_profile);
      } else {
        // ไม่พบรูปโปรไฟล์ใน tbl_user, ดึงจาก tbl_default_pic
        const defaultQuery = 'SELECT u_profile FROM tbl_default_pic LIMIT 1';
        db.query(defaultQuery, (defaultError, defaultResults) => {
          if (defaultError) {
            return callback(defaultError, null);
          }

          if (defaultResults.length > 0) {
            // ส่งกลับรูปโปรไฟล์ default
            return callback(null, defaultResults[0].u_profile);
          } else {
            // ไม่พบรูปโปรไฟล์ default เช่นกัน
            return callback(null, null); // หรือส่งกลับ path ของรูปภาพ placeholder
          }
        });
      }
    });
  },


  getEmployeeById: (employeeId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbl_user WHERE id = ?', [employeeId], (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });
  },

  updateEmployeeStatus: (employeeId, newStatus, callback) => {
    const updateQuery = 'UPDATE tbl_user SET u_status = ? WHERE id = ?';
    db.query(updateQuery, [newStatus, employeeId], (updateError, updateResults) => {
      if (updateError) {
        callback(updateError);
      } else {
        callback(null); // Indicate success to the controller
      }
    });
  },


  checkExistingUsername: (username, callback) => {
    const sql = 'SELECT 1 FROM tbl_user WHERE u_name = ?';
    db.query(sql, [username], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.length > 0); // Return true if username exists, otherwise false
    });
  },

  addEmployee: async (data, profilePicture, callback) => {
    try {
      // Check if username already exists
      Employee.checkExistingUsername(data.username, async (err, exists) => {
        if (err) {
          return callback(err, null);
        }
  
        if (exists) {
          return callback(new Error('Username already exists'), null);
        }
  
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
        // Get the last inserted ID + 1 for the new employee
        db.query('SELECT MAX(id) AS maxId FROM tbl_user', (err, result) => {
          if (err) {
            return callback(err, null);
          }
          const newId = result[0].maxId + 1;
  
          let sql = `INSERT INTO tbl_user (
            id,
            f_name, 
            l_name, 
            n_name, 
            tel, 
            u_type_name_id, 
            u_namebank, 
            u_idbook, 
            u_status,
            u_name,
            u_pass,
            u_profile 
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
          let values = [
            newId,
            data.firstName,
            data.lastName || null,
            data.nickname,
            data.phoneNumber,
            data.position,
            data.bank,
            data.accountNumber,
            1,
            data.username,
            hashedPassword,
            profilePicture // เพิ่มข้อมูลรูปภาพใน values
          ];
  
          db.query(sql, values, (err, result) => {
            if (err) {
              return callback(err, null);
            }
            return callback(null, result);
          });
        }); 
      }); 
    } catch (error) {
      return callback(error, null);
    }
  },


  //นับจำนวนคนที่ มา ลา ขาด
  getMonthQuota: (username) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbl_month_quota WHERE u_name = ?', [username], (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });
  }


};

module.exports = Employee;
