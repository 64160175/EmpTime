const express = require('express');
const LoginModel = require('../models/loginModels');
const UserModel = require('../models/user_userModel'); 

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
    res.redirect('/login'); 
  });
};

// ----------- Function to handle login submission ----------- //

exports.loginStage = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Call the login function from the model
  LoginModel.login(username, password, async (err, user) => {
    if (err) {
      // Handle login errors 
      console.error('Login error:', err);
      res.render('login', { message: err.message });
    } else {
      // Login successful
      req.session.user = user; // Store user data in the session

      // Redirect based on user type
      if (user.u_type_name_id === 0 || user.u_type_name_id === 1) {
        res.redirect('/dashboard_month');
      } else if (user.u_type_name_id === 2) {
        try {
          // เรียกใช้ checkAndUpdateMonthlyQuota ก่อนที่จะ redirect
          await UserModel.checkAndUpdateMonthlyQuota(username);
          console.log('Monthly quota checked and updated if necessary for user:', username);
          res.redirect('/user_home');
        } catch (error) {
          console.error('Error checking/updating monthly quota:', error);
          // ถ้าเกิดข้อผิดพลาด เราจะยัง redirect ไปที่ user_home แต่จะ log ข้อผิดพลาด
          res.redirect('/user_home');
        }
      } else if (user.u_type_name_id === 3) {
        res.redirect('/gen_code');
      } else {
        res.redirect('/login');
      }
    }
  });
};

