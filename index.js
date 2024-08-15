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


// ------------------------- Login ------------------------- //
app.get('/login' , require('./routes/login'));
//app.get('/logout' , require('./routes/login'));
app.post('/loginUser' , require('./routes/login'))


// ------------------------- Login เก่า ------------------------- //
/*
app.get('/login', (req, res) => {
    console.log('Rendering login page:', 'login'); // Log the file path
    res.render('login', { message: '' });
  });
  

  app.post('/login_user', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Query the database to check if the user exists
    connection.query('SELECT * FROM users WHERE username = ? AND password = SHA1(?)', [username, password], (err, results) => {
      if (results.length > 0) {
        // User found - Success!
        console.log('success'); // Log "success" if user is found
        // Redirect to the index page
        res.redirect('/dashboard_month'); 
      } else {
        // User not found - Fail
        res.redirect('/error_page'); 
        console.log('Error'); 
      }
    });

    
  });
  */

/////////////////////////////////////////////////

app.get('/error_page', (req, res) => {
  console.log('Rendering /error_page:', 'error_page'); // Log the file path
  res.render('error_page');
});

app.get('/dashboard_month', (req, res) => {
  console.log('Rendering /dashboard_month page:', 'dashboard_month'); // Log the file path
  res.render('dashboard_month');
});

app.get('/dashboard_day', (req, res) => {
  console.log('Rendering /dashboard_day page:', 'dashboard_day'); // Log the file path
  res.render('dashboard_day');
});

app.get('/employee', (req, res) => {
  console.log('Rendering /employee:', 'employee'); // Log the file path
  res.render('employee');
});


app.get('/employee_record_addemp', (req, res) => {
  console.log('Rendering /employee_record_addemp:', 'employee_record_addemp'); // Log the file path
  res.render('employee_record_addemp');
});


app.get('/employee_record', (req, res) => {
  console.log('Rendering /employee_record:', 'employee_record'); // Log the file path
  res.render('employee_record');
});

app.get('/recipt', (req, res) => {
  console.log('Rendering /recipt:', 'recipt'); // Log the file path
  res.render('recipt');
});

app.get('/store_setting', (req, res) => {
  console.log('Rendering /store_setting:', 'store_setting'); // Log the file path
  res.render('store_setting');
});




// Start the server{
app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('/http://localhost:3000/login'); // Log the file path
});
