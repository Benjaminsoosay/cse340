const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');

const inventoryController = {};

// Vehicle detail
inventoryController.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId) || vehicleId <= 0) {
      const error = new Error('Invalid vehicle ID');
      error.status = 400;
      throw error;
    }

    const vehicleData = await inventoryModel.getVehicleById(vehicleId);
    if (!vehicleData) {
      const error = new Error('Vehicle not found');
      error.status = 404;
      throw error;
    }

    const vehicleHTML = utilities.buildVehicleDetail(vehicleData);

    res.render('vehicle-detail', {
      title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
      vehicleHTML
    });
  } catch (error) {
    next(error);
  }
};

// Error test
inventoryController.triggerError = (req, res, next) => {
  const error = new Error('This is a test error from the footer link');
  error.status = 500;
  next(error);
};

// Inventory list (updated with duplicate filtering)
inventoryController.getInventoryList = async (req, res, next) => {
  try {
    // Fetch vehicles from the database
    const vehicles = await inventoryModel.getAllVehicles();

    // ✅ Remove duplicates by ID
    const uniqueVehicles = vehicles.filter(
      (v, index, self) => index === self.findIndex(u => u.id === v.id)
    );

    // Build HTML with only unique vehicles
    const inventoryHTML = utilities.buildInventoryList(uniqueVehicles);

    // Render the view
    res.render('inventory-index', {
      title: 'Vehicle Inventory',
      inventoryHTML
    });
  } catch (error) {
    next(error);
  }
};

module.exports = inventoryController;
