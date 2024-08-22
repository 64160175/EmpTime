const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const { logoutView } = require('./controllers/loginController'); 
const { checkPermission } = require('./controllers/PermissionController'); 

const app = express();
const port = 3000;

// Database Configuration 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'empdatabase1'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');

  const LoginModel = require('./models/loginModels'); 
  LoginModel.initialize(connection); 
});

// Setup 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ตั้งค่า session
app.use(session({
  secret: 'password', 
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: false } 
}));

app.set('view engine', 'ejs');


const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next(); 
  } else {
    res.redirect('/login'); 
  }
};


// ------------------------- Login ------------------------- //
const loginRoutes = require('./routes/loginRoutes');
app.use('/', loginRoutes); // Use app.use to mount the router

app.get('/logout', isLoggedIn, logoutView); 
app.get('/error_page', isLoggedIn, (req, res) => {res.render('error_page');});

// ------------------- Import userRoutes ------------------- //
const userRoutes = require('./routes/userRoutes'); 
app.use('/', userRoutes);


// Start the server 
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}/login`); 
});
