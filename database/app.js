const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const utilities = require("./utilities/");

const app = express();

// Static Middleware
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use(require("./routes/static")); // If you have static routes

// Inventory Routes - MAKE SURE THIS EXISTS
const inventoryRouter = require("./routes/inventoryRoute");
app.use("/inv", inventoryRouter); // This is crucial for Task 1

// Index Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// 404 Handler - MUST BE AFTER ALL ROUTES
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
    nav
  });
});

// Error Handling Middleware - MUST BE LAST (for Task 2 & 3)
app.use(async (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  try {
    const nav = await utilities.getNav();
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav,
      status
    });
  } catch {
    // Fallback if nav fails
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav: [],
      status
    });
  }
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
