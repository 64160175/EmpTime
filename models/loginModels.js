const mysql = require('mysql'); 
const bcrypt = require('bcrypt');
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
  const sql = 'SELECT * FROM tbl_user WHERE u_name = ? AND u_status = 1';  
  

  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return callback(err, null); 
    }

    if (results.length === 1) {
      const user = results[0];

      // Use bcrypt.compare() to compare passwords
      bcrypt.compare(password, user.u_pass, (err, match) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return callback(new Error('Error during login'), null);
        }

        if (match) {
          // Passwords match, login successful
          return callback(null, user); 
        } else {
          // Passwords don't match
          return callback(new Error('Invalid username or password'), null); 
        }
      });

    } else {
      return callback(new Error('Invalid username or password'), null); 
    }
  });
};




