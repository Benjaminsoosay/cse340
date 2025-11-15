const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);

    if (isNaN(inv_id)) {
      throw new Error("Invalid vehicle ID");
    }

    const vehicleData = await invModel.getInventoryById(inv_id);

    if (!vehicleData) {
      const nav = await utilities.getNav();
      return res.render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, the requested vehicle could not be found.",
        nav,
        status: 404
      });
    }

    const vehicleHTML = utilities.buildInventoryDetail(vehicleData);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicleHTML,
      nav
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildByInventoryId };


