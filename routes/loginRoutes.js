const express = require('express');
const LoginController = require('../controllers/loginController');
const router = express.Router();

// Route for displaying the login form
router.get('/login', LoginController.loginView);

// Route for handling logout
router.get('/logout', LoginController.logoutView);

// Route for handling login submission
router.post('/loginUser', LoginController.loginStage);



module.exports = router;
