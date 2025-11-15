function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`);

  // Get navigation
  const utilities = require("../utilities/"); // adjust path if needed
  utilities.getNav().then(nav => {
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav,
      status
    });
  }).catch(() => {
    // Fallback if nav fails
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav: [],
      status
    });
  });
}

module.exports = { errorHandler };
