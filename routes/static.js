const express = require("express");
const router = express.Router();

router.get("/error", (req, res, next) => {
  const err = new Error("Intentional 500 error for testing");
  err.status = 500;
  next(err);
});

module.exports = router;
