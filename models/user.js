const mysql = require('mysql');

// Database Configuration (You'll need to adjust this)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mysqlproject1'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

// Function to check if a user exists
exports.findUser = (username, password, callback) => {
  connection.query('SELECT * FROM users WHERE username = ? AND password = SHA1(?)', [username, password], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};
