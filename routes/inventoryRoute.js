const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Vehicle detail route
router.get("/detail/:invId", invController.buildByInventoryId);

module.exports = router;

