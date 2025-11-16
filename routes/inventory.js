// routes/inventory.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Inventory list
router.get('/', inventoryController.getInventoryList);

// Vehicle detail by ID
router.get('/:id', inventoryController.getVehicleDetail);

// Error test route
router.get('/error/test', inventoryController.triggerError);

module.exports = router;
