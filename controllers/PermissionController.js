const UserModel = require('../models/user_userModel'); // Assuming this is your user model

const checkPermission = (allowedTypes) => {
  return async (req, res, next) => {
    if (req.session.user && allowedTypes.includes(req.session.user.u_type_name_id)) {
      try {
        // Fetch user data based on the session user ID
        const userData = await UserModel.getUserProfile(req.session.user.id);

        // Attach user data to req.user
        req.user = userData; 

        next(); // Proceed to the next middleware/route handler
      } catch (err) {
        console.error('Error fetching user data in checkPermission:', err);
        res.redirect('/error_page'); // Or handle the error appropriately
      }
    } else {
      console.log('Unauthorized access attempt!');
      res.redirect('/error_page'); 
    }
  };
};

module.exports = { checkPermission };
