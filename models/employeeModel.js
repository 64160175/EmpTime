const db = require('../config/database');
 // Adjust path if needed

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



};

module.exports = Employee;
