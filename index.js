const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const ejs = require('ejs');

// Database Configuration
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

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', (req, res) => {
    console.log('Rendering login page:', 'login'); // Log the file path
    res.render('login', { message: '' });
  });
  

// Handle form submissions
// ... (rest of your code)

app.post('/login_user', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check if the user exists
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (results.length > 0) {
      // User found - Success!
      console.log('success'); // Log "success" if user is found
      // Redirect to the index page
      res.redirect('/dashboard_month'); 
    } else {
      // User not found - Fail
      console.log('Error'); 
      
      
    }
  });
});

/////////////////////////////////////////////////


app.get('/dashboard_month', (req, res) => {
  console.log('Rendering /dashboard_month page:', 'dashboard_month'); // Log the file path
  res.render('dashboard_month');
});




// Start the server{
app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('/http://localhost:3000/login'); // Log the file path
});
