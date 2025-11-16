const express = require("express");
const path = require("path");
const inventoryRouter = require("./routes/inventory");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup (still available for other routes)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/inventory", inventoryRouter);

// ✅ Root route (homepage without EJS dependency)
app.get("/", (req, res) => {
  res.send("<h1>Welcome to CSE Motors</h1><p>Your app is running successfully!</p>");
});

// ✅ Simple health check route
app.get("/health", (req, res) => {
  res.send("App is running!");
});

// Error handling middleware (must have 4 args)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Server Error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// 404 handler (no err argument)
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
