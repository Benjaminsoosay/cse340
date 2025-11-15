// src/controllers/inventoryController.js
const invModel = require("../models/inventory-model");

/**
 * Controller: buildByInventoryId
 * Fetches a vehicle by its inventory ID and renders or returns JSON
 */
async function buildByInventoryId(req, res) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryById(invId);

    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }

    // For now, just send JSON. Later you can render a view.
    res.json(vehicle);
  } catch (error) {
    console.error("buildByInventoryId error:", error.message);
    res.status(500).send("Server error");
  }
}

module.exports = { buildByInventoryId };
