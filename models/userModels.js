const express = require('express');
const router = express.Router();

// Middleware to check permissions for different user types
const checkPermission = (allowedTypes) => {
  return (req, res, next) => {
    if (allowedTypes.includes(req.session.user.u_type_name_id)) {
      // User type has permission, proceed to the next middleware/route handler
      next();
    } else {
      // User type does not have permission, handle accordingly
      console.log('Unauthorized access attempt!');
      res.redirect('/error_page'); // Or render an error page
    }
  };
};



module.exports = router;
