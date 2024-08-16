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
  const sql = 'SELECT * FROM users WHERE username = ? AND password = SHA1(?)';

  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return callback(err, null); 
    }

    if (results.length === 1) {
      // User found
      return callback(null, results[0]); // Return the user object
    } else {
      // User not found
      return callback(new Error('Invalid username or password'), null);
    }
  });
};
