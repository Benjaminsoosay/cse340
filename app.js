const express = require("express");
const path = require("path");
const inventoryRouter = require("./routes/inventory");

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/inventory", inventoryRouter);

// ✅ Root route (homepage with EJS)
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to CSE Motors" });
});

// ✅ Simple health check route (plain text)
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
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
