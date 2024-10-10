
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'empdatabase1' 
});

db.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    
  }
});

module.exports = db;
