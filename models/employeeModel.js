const db = require('../config/database'); // Adjust path if needed

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
  }
};

module.exports = Employee;
