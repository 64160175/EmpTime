const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const { logoutView } = require('./controllers/loginController'); // Import logoutView directly

const app = express();
const port = 3000;

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

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ตั้งค่า session
app.use(session({
  secret: 'your_secret_key', // Replace with a strong, randomly generated secret
  resave: false,
  saveUninitialized: false, // Set to false for security
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next(); // User is logged in
  } else {
    res.redirect('/login'); // Redirect to login if not
  }
};

// ------------------------- Login ------------------------- //
const loginRoutes = require('./routes/login');
app.get('/login', loginRoutes); 

app.post('/loginUser' , require('./routes/login'))

// Protect other routes with the isLoggedIn middleware
app.get('/logout', isLoggedIn, logoutView); 


// Protect all other routes that require authentication
app.get('/error_page', isLoggedIn, (req, res) => {
  res.render('error_page');
});

app.get('/dashboard_month', isLoggedIn, (req, res) => {
  res.render('dashboard_month');
});

app.get('/dashboard_day', isLoggedIn, (req, res) => {
  res.render('dashboard_day');
});

app.get('/employee', isLoggedIn, (req, res) => {
  res.render('employee');
});

app.get('/employee_record_addemp', isLoggedIn, (req, res) => {
  res.render('employee_record_addemp');
});

app.get('/employee_record', isLoggedIn, (req, res) => {
  res.render('employee_record');
});

app.get('/recipt', isLoggedIn, (req, res) => {
  res.render('recipt');
});

app.get('/store_setting', isLoggedIn, (req, res) => {
  res.render('store_setting');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}/login`); 
});
