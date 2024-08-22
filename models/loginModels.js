const mysql = require('mysql'); 
let connection; // Store the database connection


// ------------------------- Function ------------------------- //

// Function to initialize the model with the database connection
exports.initialize = (conn) => {
  connection = conn;
};

// Function to perform the login logic
exports.login = (username, password, callback) => {
  // Basic input validation (add more as needed)
  if (!username || !password) {
    return callback(new Error('Username and password are required'), null);
  }

  // SQL query to find the user (assuming you're hashing passwords)
  // Added "AND u_status = 1" to check for active users
  const sql = 'SELECT * FROM tbl_user WHERE u_name = ? AND u_pass = SHA1(?) AND u_status = 1'; 

  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return callback(err, null); 
    }

    if (results.length === 1) {
      // User found and u_status is 1 (active)
      return callback(null, results[0]); // Return the user object
    } else {
      // User not found or u_status is not 1 (inactive)
      return callback(new Error('Invalid username or password'), null); 
    }
  });
};




