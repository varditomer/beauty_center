// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session?.userid) {
    console.log(`123:`,)
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/');
  }
}
module.exports = isAuthenticated