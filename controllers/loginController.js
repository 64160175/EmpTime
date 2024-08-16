const express = require('express');
const LoginModel = require('../models/loginModels'); 


// ------------------------- Function ------------------------- //

// Function to display the login form
exports.loginView = (req, res) => {
  res.render('login', { message: '' });
};

// Function to handle logout
exports.logoutView = (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login'); // Redirect to the login page
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
      res.redirect('/dashboard_month'); 
    }
  });
};
