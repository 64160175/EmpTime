const express = require('express');
const LoginModel = require('../models/loginModels'); 


// ------------------------- Function ------------------------- //

// Function to display the login form
exports.loginView = (req, res) => {
  res.render('login', { message: '' });
};

// controllers/loginController.js
exports.logoutView = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login/login'); // Redirect to /login/login
  });
};


// Function to handle login submission
exports.loginStage = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Call the login function from the model
  LoginModel.login(username, password, (err, user) => {
    if (err) {
      // Handle login errors (e.g., invalid credentials, database error)
      console.error('Login error:', err);
      res.render('login', { message: err.message }); // Or redirect to an error page
    } else {
      // Login successful
      req.session.user = user; // Store user data in the session

      // Redirect based on user type
      if (user.u_type_name_id === 0 || user.u_type_name_id === 1) {
        res.redirect('/dashboard_month'); 
      } else if (user.u_type_name_id === 2) {
        res.redirect('/user_home');
      } else {
        // Handle unknown user type (optional - you might want to log this)
        res.redirect('/login'); // Or redirect to an error page
      }
    }
  });
};

