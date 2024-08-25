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
        callback(error, null);
      } else {
        callback(null, results[0] ? results[0].u_profile : null); // Return the image data or null
      }
    });
  },


  getEmployeeById: (employeeId, callback) => {
    const query = 'SELECT * FROM tbl_user WHERE id = ?';
    db.query(query, [employeeId], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results[0]); // Assuming you want the first result
      }
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

  addEmployee: async (data, callback) => {
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
            u_pass
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          let values = [
            newId, // Use the calculated new ID
            data.firstName,
            data.lastName || null,
            data.nickname,
            data.phoneNumber,
            data.position,
            data.bank,
            data.accountNumber,
            1,
            data.username,
            hashedPassword
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



};

module.exports = Employee;
