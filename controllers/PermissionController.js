

// Middleware to check permissions for different user types
const checkPermission = (allowedTypes) => {
    return (req, res, next) => {
      if (req.session.user && allowedTypes.includes(req.session.user.u_type_name_id)) {
        next(); 
      } else {
        console.log('Unauthorized access attempt!');
        res.redirect('/error_page'); 
      }
    };
  };
  
  module.exports = { checkPermission };
  

  

