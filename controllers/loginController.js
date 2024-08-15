const express = require('express');
const User = require('../models/user'); // Import the User model

// Function to display the login form
exports.loginView = (req, res) => {
  res.render('login', { message: '' });
};

// Function to handle logout
exports.logoutView = (req, res) => {
  // Implement logout logic (e.g., clear session, redirect)
  res.redirect('/login'); // Redirect to the login page
};

// Function to handle login submission
exports.loginStage = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findUser(username, password, (err, results) => {
    if (err) {
      console.error('Error finding user:', err);
      // Handle password format error
      if (err.message.includes('Password must be at least')) {
        res.render('login', { message: err.message }); // Display error on login page
      } else {
        res.redirect('/error_page'); 
      }
    } else {
      if (results.length > 0) {
        // User found - Success!
        console.log('success');
        res.redirect('/dashboard_month');
      } else {
        // User not found - Fail
        res.render('login', { message: 'Invalid username or password' }); // Display error on login page
      }
    }
  });
};
