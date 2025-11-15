const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Create Express app
const app = express();

// Set up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static files (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import routes
const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/error"); // <-- added error route

// Use routes
app.use(staticRoutes);
app.use("/inv", inventoryRoute);
app.use(errorRoute); // <-- mounted error route

// Home route
app.get("/", (req, res) => {
  const utilities = require("./utilities/");
  const navPromise = utilities.getNav ? utilities.getNav() : Promise.resolve([]);

  navPromise.then(nav => {
    res.render("index", { title: "Home", nav });
  }).catch(() => {
    res.render("index", { title: "Home", nav: [] });
  });
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { title: "About", nav: [] });
});

// Contact route
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", nav: [] });
});

// 404 Handler - must be after all other routes
app.use((req, res) => {
  const utilities = require("./utilities/");
  const navPromise = utilities.getNav ? utilities.getNav() : Promise.resolve([]);

  navPromise.then(nav => {
    res.status(404).render("errors/error", {
      title: "404 - Page Not Found",
      message: "The page you are looking for does not exist.",
      nav,
      status: 404
    });
  }).catch(() => {
    res.status(404).render("errors/error", {
      title: "404 - Page Not Found",
      message: "The page you are looking for does not exist.",
      nav: [],
      status: 404
    });
  });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  const utilities = require("./utilities/");
  const navPromise = utilities.getNav ? utilities.getNav() : Promise.resolve([]);

  navPromise.then(nav => {
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav,
      status
    });
  }).catch(() => {
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav: [],
      status
    });
  });
});

// Set port and start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;

